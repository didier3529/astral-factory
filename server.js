const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const { createCanvas, loadImage } = require("canvas");
const app = express();
const fs = require("fs");
const lowDb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const s3Actions = require("./s3Actions");
var multer = require("multer");
const archiver = require("archiver");
var path = require("path");

require("dotenv").config({ path: "./config.env" });
// Uncomment for Database connection
// const dbo = require("./DB/connection");

const db = lowDb(new FileSync("./src/traffic.json"));

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:4000', // Allow requests from React app
  credentials: true
}));
const port = process.env.PORT || 8443;

// Create necessary directories if they don't exist
const layersDir = path.join(__dirname, 'src', 'EditingPage', 'layers');
const generatedDir = path.join(__dirname, 'generated');

if (!fs.existsSync(layersDir)) {
  fs.mkdirSync(layersDir, { recursive: true });
}

if (!fs.existsSync(generatedDir)) {
  fs.mkdirSync(generatedDir, { recursive: true });
}

const dirTree = require("directory-tree");

app.get("/getFolderTree", (req, res) => {
  const uuid = req.query.uuid;
  const treePath = path.join(layersDir, uuid);
  
  if (!fs.existsSync(treePath)) {
    return res.status(404).json({ error: "Folder not found" });
  }
  
  const tree = dirTree(treePath);
  res.json(tree);
});

app.get("/getTotalUsers", (req, res) => {
  const data = db.get("TotalUsers").value();
  return res.json(data);
});

app.get("/getTotalItems", (req, res) => {
  const data = db.get("TotalItems").value();
  return res.json(data);
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uuid = file.fieldname.split('/')[0];
    const targetDir = path.join(__dirname, 'src', 'EditingPage', 'layers', uuid);
    
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    cb(null, targetDir);
  },
  filename: function (req, file, cb) {
    const fileName = file.fieldname.split('/')[1];
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
      return cb(new Error('Only JPG, JPEG, and PNG files are allowed!'), false);
    }
    cb(null, true);
  }
}).any();

app.post("/uploadFiles", (req, res) => {
  console.log("File upload request received");
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
          error: "File size cannot exceed 10MB",
          details: err.message,
          code: err.code
        });
      }
      return res.status(400).json({ 
        error: err.message,
        code: err.code
      });
    } else if (err) {
      console.error("Upload error:", err);
      return res.status(500).json({ 
        error: "File upload failed",
        details: err.message
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files were uploaded" });
    }

    console.log(`Successfully uploaded ${req.files.length} files`);
    res.status(200).json({ 
      message: "Files uploaded successfully",
      files: req.files.map(f => ({
        filename: f.filename,
        size: f.size,
        mimetype: f.mimetype,
        path: f.path
      }))
    });
  });
});

const fields = [];
var filePaths = new Set();

app.post("/uploadPath", (req, res) => {
  console.log("Path registration request received");
  
  if (!Array.isArray(req.body)) {
    console.error("Invalid request body: not an array");
    return res.status(400).json({ 
      error: "Expected an array of file paths",
      received: typeof req.body
    });
  }

  try {
    // Clear previous paths
    fields.length = 0;
    filePaths.clear();

    req.body.forEach((file, index) => {
      if (!file.path || !file.uuid) {
        throw new Error(`Invalid file data at index ${index}: missing path or uuid`);
      }
      const filePath = file.path;
      const hashKey = file.uuid;
      const fullPath = hashKey + "/" + filePath;
      filePaths.add(fullPath);
      console.log(`Registered path: ${fullPath}`);
    });

    filePaths.forEach((file) => {
      fields.push({ name: file });
    });

    console.log(`Successfully registered ${filePaths.size} paths`);
    res.status(200).json({ 
      message: "Paths registered successfully",
      paths: Array.from(filePaths),
      count: filePaths.size
    });
  } catch (error) {
    console.error("Path registration error:", error);
    res.status(400).json({ 
      error: "Failed to register paths",
      details: error.message
    });
  }
});

app.post("/deleteLocalFiles", (req, res) => {
  const data = req.body;
  const uuid = data.uuid;
  fs.rmdir(`./src/EditingPage/layers/${uuid}`, { recursive: true }, (err) => {
    if (err) {
      return console.log("error occurred in deleting directory", err);
    }

    console.log("Directory deleted successfully");
  });
  return res.status(200).json("Success");
});

const wr = (w) => {
  const cw = [];
  for (let i = 0; i < w.length; i += 1) {
    cw[i] = w[i] + (cw[i - 1] || 0);
  }

  const mcw = cw[cw.length - 1];
  const rn = mcw * Math.random();

  for (let i = 0; i < w.length; i += 1) {
    if (cw[i] >= rn) {
      return i;
    }
  }
};

app.post("/submitDetails", (request, response) => {
  const data = request.body;
  const uuid = data.uuid;
  const tree = data.folderTree;
  const width = data.canvasWidth;
  const height = data.canvasHeight;
  const canvas = createCanvas(width, height);
  const metadata = [];
  const name = data.name;
  const description = data.description;
  const URL = data.URL;
  const context = canvas.getContext("2d", {
    patternQuality: "bilinear",
    quality: "bilinear",
  });
  var startDate = new Date();

  const layerData = [];

  data &&
    data.objects.map((obj) => {
      layerData.push(obj);
    });

  // sorting based on depth
  layerData &&
    layerData.sort((a, b) => {
      return a.depth - b.depth;
    });

  var values = data.total.value;

  const folderLayers = tree.children;

  const finalLayers = [];

  // sorting the tree layers based on depth
  layerData.forEach((item) => {
    finalLayers.push(folderLayers.filter((obj) => obj.name === item.name)[0]);
  });

  tree.children = finalLayers;

  if (fs.existsSync(`generated/${uuid}`) === false) {
    fs.mkdirSync(`generated/${uuid}`, { recursive: true });
  }

  while (values) {
    var hash = 0;
    let objRarity = 0;
    let totalRarity = 0;

    // eslint-disable-next-line no-loop-func
    tree.children.forEach(async (item, index) => {
      const weights = [];
      item.children.forEach((item) =>
        weights.push(item.rarity ? item.rarity : 50)
      );

      const idx = wr(weights);
      const obj = item.children[idx];

      objRarity += item.children[idx].rarity ? item.children[idx].rarity : 50;
      totalRarity += 100;

      const image = await loadImage(`./${obj.path}`);

      context.drawImage(
        image,
        JSON.parse(layerData[index].x),
        JSON.parse(layerData[index].y),
        JSON.parse(layerData[index].width),
        JSON.parse(layerData[index].height)
      );
      const buffer = canvas.toBuffer("image/png", 0);
      fs.writeFileSync(__dirname + `/generated/${uuid}/${hash}.png`, buffer);

      if (tree.children.length === index + 1) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (hash === data.total.value) {
          const jsonContent = JSON.stringify(metadata);
          fs.writeFile(
            `generated/${uuid}/metadata.json`,
            jsonContent,
            "utf8",
            function (err) {
              if (err) {
                console.log(
                  "An error occured while writing JSON Object to File."
                );
                return console.log(err);
              }

              console.log("JSON file has been saved.");
            }
          );
          return response.json("Success").status(200);
        }

        const rarityPercentage = (objRarity / totalRarity) * 100;

        // Metadata Generation
        const dataImage = {
          name: `${name} #${hash}`,
          description: description,
          external_link: URL,
          traits: {
            rarity: rarityPercentage,
          },
        };

        metadata.push(dataImage);
        hash += 1;
      }
    });

    hash += 1;
    values -= 1;
  }
  var endDate = new Date();
  var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
  console.log("The total Time Taken was : ", seconds);
  const totalUsers = db.get("TotalUsers").value() + 1;
  const totalItems = db.get("TotalItems").value();
  db.set("TotalUsers", totalUsers).write();
  db.set("TotalItems", data.total.value + totalItems).write();
});

app.get("/compress", (req, res) => {
  const uuid = req.query.uuid;
  const output = fs.createWriteStream(`generated/${uuid}.zip`);
  const archive = archiver("zip");

  archive.on("error", function (err) {
    res.status(500).send({ error: err.message });
  });

  //on stream closed we can end the request
  archive.on("end", function () {
    console.log("Archive wrote %d bytes", archive.pointer());
  });

  //set the archive name
  res.attachment(`${uuid}.zip`);

  //this is the streaming magic
  archive.pipe(output);

  archive.directory(`generated/${uuid}`, `${uuid}`);

  archive.finalize();

  return res.status(200).json("Success");
});

app.get("/upload", (req, res, next) => {
  const uuid = req.query.uuid;

  s3Actions.uploadFile(`generated/${uuid}.zip`, res);
});

app.get("/resolveFiles", function (req, res, next) {
  const uuid = req.query.uuid;

  // fs.unlink(`./generated/${uuid}.zip`, function (err) {
  //   if (err) throw err;
  //   console.log("File deleted!");
  // });

  return res.status(200).json("Success");
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, '0.0.0.0', () => {
  // Uncommented for connecting to mongoDB
  // dbo.connectToServer(function (err) {
  //   if (err) console.error(err);
  // });
  console.log(`Server is running on port: ${port}`);
  console.log(`Server is ready to accept connections`);
});

//s3Actions.uploadFile("uuid/src/EditingPage/layers/ball/red eye ball_sr.png");
//uploadFile("src/EditingPage/layers/ball/white eye ball.png");
//s3Actions.emptyS3Directory(process.env.BUCKET_NAME, "src/");
// tree &&
//   tree.children &&
//   tree.children.forEach((items) => {
//     items &&
//       items.children &&
//       items.children.forEach((item) => s3Actions.uploadFile(item.path));
//   });
