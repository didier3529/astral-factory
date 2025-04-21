import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { CircularProgress } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from 'uuid';

export const MyDropzone = () => {
  const [loaded, setLoaded] = React.useState(0);

  React.useEffect(() => {
    // Initialize UUID if not exists
    if (!sessionStorage.getItem('uuid')) {
      sessionStorage.setItem('uuid', JSON.stringify(uuidv4()));
    }
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) {
      toast.error("No files selected");
      return;
    }

    const uuid = sessionStorage.getItem('uuid');
    if (!uuid) {
      toast.error("Session error: No UUID found. Please refresh the page.");
      return;
    }

    console.log('Current UUID:', uuid);
    const parsedUuid = JSON.parse(uuid);

    const formData = new FormData();
    const folderPath = [];

    try {
      acceptedFiles.forEach((file) => {
        // Log file information
        console.log('Processing file:', {
          name: file.name,
          path: file.path,
          size: file.size,
          type: file.type
        });

        // Use file name if path is not available
        const fileName = file.name;
        const fieldName = `${parsedUuid}/${fileName}`;
        
        console.log('Adding file to formData:', fieldName);
        formData.append(fieldName, file);

        folderPath.push({
          path: fileName,
          uuid: parsedUuid
        });
      });

      console.log('Folder paths to create:', folderPath);

      // First create the upload path
      axios
        .post("http://localhost:8443/uploadPath", folderPath, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(function (response) {
          console.log("Path creation response:", response.data);
          
          // Then upload the files
          axios
            .post("http://localhost:8443/uploadFiles", formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              onUploadProgress: (ProgressEvent) => {
                const progress = (ProgressEvent.loaded / ProgressEvent.total) * 100;
                console.log('Upload progress:', progress);
                setLoaded(progress);
              },
            })
            .then(function (response) {
              console.log("File upload response:", response.data);
              toast.success("Upload successful");
              setLoaded(0);
            })
            .catch(function (error) {
              console.error("Upload error details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
              });
              toast.error(error.response?.data?.error || "Upload failed");
            });
        })
        .catch(function (error) {
          console.error("Path creation error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
          });
          toast.error(error.response?.data?.error || "Failed to create upload path");
        });
    } catch (error) {
      console.error("File processing error:", error);
      toast.error("Error processing files: " + error.message);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: true
  });

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      <div className="dropzone-content">
        <CloudUploadIcon style={{ 
          fontSize: 64,
          color: 'var(--accent-color)',
          marginBottom: '1.5rem'
        }} />
        {isDragActive ? (
          <p style={{ 
            fontSize: '1.25rem',
            color: 'var(--text-primary)',
            margin: '0.5rem 0'
          }}>
            Drop files here
          </p>
        ) : (
          <>
            <p style={{ 
              fontSize: '1.25rem',
              color: 'var(--text-primary)',
              margin: '0.5rem 0'
            }}>
              Click or drag files to upload
            </p>
            <p style={{ 
              fontSize: '1rem', 
              color: 'var(--text-secondary)',
              margin: '0.5rem 0',
              maxWidth: '400px',
              textAlign: 'center',
              lineHeight: '1.5'
            }}>
              Supported files: JPG, JPEG, PNG (max 10MB each)
            </p>
          </>
        )}
      </div>
      {loaded > 0 && (
        <div className="progress-wrapper" style={{ 
          marginTop: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <CircularProgress 
            variant="determinate" 
            value={loaded} 
            style={{ 
              color: 'var(--accent-color)',
              width: '48px',
              height: '48px'
            }}
          />
          <p style={{ 
            marginTop: '0.5rem', 
            color: 'var(--text-secondary)',
            fontSize: '1rem'
          }}>
            {Math.round(loaded)}% uploaded
          </p>
        </div>
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};
