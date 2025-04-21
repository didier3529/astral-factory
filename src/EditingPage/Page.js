import React from "react";

import { Editor } from "./Editor";
import { Items } from "./Items";
import { NumberOfCopies, ObjectContext, ObjectSelection } from "./EditingPage";
import { EditorInput } from "./EditorInput";
import TreesTemp from "./FolderStructure";
import { Button } from "@material-ui/core";
import "./Page.css";
import { ModalComponent } from "./Modal";
import { LoadingModalComponent } from "./loadingModal";
import axios from "axios";
import { RarityModalComponent } from "./RarityModal";

export const Page = (props) => {
  const { dispatch1 } = React.useContext(ObjectContext);
  const { selection, dispatch2 } = React.useContext(ObjectSelection);
  const { dispatch3 } = React.useContext(NumberOfCopies);
  const [totalCopies, setTotalCopies] = React.useState({ value: 0 });
  const [open, setOpen] = React.useState(false);
  const [rarityOpen, setRarityOpen] = React.useState(false);
  const [loadingModal, setLoadingModal] = React.useState(false);
  const [coord, setCoor] = React.useState({ x: 0, y: 0 });
  const [canvasHeight, setCanvasHeight] = React.useState({
    value: 400,
  });
  const [canvasWidth, setCanvasWidth] = React.useState({
    value: 400,
  });

  const setCurrentElement = (val) => {
    dispatch2({
      type: "update",
      name: val,
    });
  };

  var parentRef = React.useRef(null);

  const handleMouseOver = (e) => {
    const parent = parentRef.current.getBoundingClientRect();
    const rect = e.target.getBoundingClientRect();

    const width = rect.width;
    const positionX = rect.left - parent.left;
    const positionY = rect.top - parent.top;

    //console.log(`width: ${width}, position: ${positionX} , ${positionY}`);
    const values = { x: positionX, y: positionY };

    return values;
  };

  const setCoord = (event, file) => {
    const curr_Coor = handleMouseOver(event);

    dispatch2({
      type: "update",
      name: `${file.name}`,
    });
    dispatch1({
      type: "update",
      nameToFind: selection.name,
      valueToChange: "x",
      currentSlide: curr_Coor.x,
    });
    dispatch1({
      type: "update",
      nameToFind: selection.name,
      valueToChange: "y",
      currentSlide: curr_Coor.y,
    });

    setCoor({ x: curr_Coor.x, y: curr_Coor.y });
  };

  const editValues = (input1, input2, input4) => {
    if (input1.value) {
      dispatch1({
        type: "update",
        nameToFind: selection.name,
        valueToChange: input1.name,
        currentSlide: input1.value,
      });
    }

    if (input2.value) {
      dispatch1({
        type: "update",
        nameToFind: selection.name,
        valueToChange: input2.name,
        currentSlide: input2.value,
      });
    }

    if (input4.value) {
      dispatch3({
        type: "update",
        value: input4.value,
      });

      setTotalCopies({ value: input4.value });
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleRarityOpen = () => {
    setRarityOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRarityClose = () => {
    setRarityOpen(false);
  };

  const openLoadingModal = () => {
    setLoadingModal(true);
  };

  return (
    <div style={{ display: 'flex', width: '100%', backgroundColor: '#000000', fontFamily: 'var(--professional-font)' }}>
      <div
        className="editor-control-panel gray-element animated-border"
        style={{
          width: "15%",
          height: "100vh",
          padding: "20px",
          borderRadius: "8px",
          overflowX: "hidden",
          overflowY: "auto",
          zIndex: 20,
          transition: "width .35s",
          backgroundColor: "#000000",
          borderRight: "2px solid #4DFF4D"
        }}
      >
        <TreesTemp folderData={props.folderStructure} />
      </div>
      <div
        className="editor-canvas-container gray-element"
        style={{
          width: "70%",
          height: "100vh",
          padding: "20px",
          backgroundColor: "#000000",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}
      >
        <div
          className="editor-canvas-controls canvas-controls animated-border"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "15px",
            borderRadius: "8px",
            backgroundColor: "#000000"
          }}
        >
          <p className="editor-text-primary">
            Canvas Height:{" "}
            <input
              className="canvas-dimension-input"
              onChange={(event) => {
                setCanvasHeight({
                  value: JSON.parse(event.target.value),
                });
              }}
              placeholder="400"
            />
            &nbsp; px &nbsp;Canvas Width:{" "}
            <input
              className="canvas-dimension-input"
              onChange={(event) => {
                setCanvasWidth({
                  value: JSON.parse(event.target.value),
                });
              }}
              placeholder="400"
            />
            &nbsp; px
          </p>
        </div>
        <div id="content" className="canvas-area animated-border canvas-grid-detailed">
          <Items
            onClick={setCurrentElement}
            files={props.folderStructure}
            hashedFolder={props.hashedElements}
            imageHeight={canvasHeight.value}
            imageWidth={canvasWidth.value}
            setCoord={setCoord}
            parent={parentRef}
          />
        </div>
        <div
          className="editor-canvas-controls canvas-controls animated-border"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "15px",
            borderRadius: "8px",
            backgroundColor: "#000000"
          }}
        >
          <p className="coordinate-display">
            Selection: <span className="coordinate-value">{selection.name}</span> &nbsp; 
            X: <span className="coordinate-value">{coord.x}</span> &nbsp;
            Y: <span className="coordinate-value">{coord.y}</span>
          </p>
        </div>
      </div>
      <div
        style={{
          width: "15%",
          borderRadius: "8px",
          zIndex: 20,
          padding: "20px",
          backgroundColor: "#000000",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}
      >
        <div
          className="editor-control-panel animated-border"
          style={{
            height: "100vh",
            padding: "20px",
            backgroundColor: "#000000",
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }}
        >
          <div className="editor-section">
            <Editor currentValues={props.hashedElements} />
          </div>
          <div className="manual-input-section">
            <EditorInput setValues={editValues} />
          </div>
          <div className="button-container" style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "15px" }}>
            <Button
              className="editor-button"
              variant="contained"
              onClick={handleRarityOpen}
            >
              💎 Add Rarity 💎
            </Button>
            <Button
              className="editor-button"
              variant="contained"
              size="large"
              onClick={totalCopies && totalCopies.value > 10000 ? null : handleOpen}
            >
              Generate
            </Button>
          </div>
          <RarityModalComponent
            isOpen={rarityOpen}
            handleClose={handleRarityClose}
            folderStructure={props.folderStructure}
          />
          <ModalComponent
            isOpen={open}
            handleClose={handleClose}
            canvasHeight={canvasHeight.value}
            canvasWidth={canvasWidth.value}
            openLoadingModal={openLoadingModal}
          />
          <LoadingModalComponent isOpen={loadingModal} />
        </div>
      </div>
    </div>
  );
};
