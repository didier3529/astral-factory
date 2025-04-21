import React from "react";
import { SliderComponent } from "./Slider";
import { TextField } from "@material-ui/core";
import { NumberOfCopies, ObjectContext, ObjectSelection } from "./EditingPage";
import { Button, Input } from "@material-ui/core";

export const EditorInput = (props) => {
  // eslint-disable-next-line no-undef
  const { objects, dispatch1 } = React.useContext(ObjectContext);
  const { selection, dispatch2 } = React.useContext(ObjectSelection);

  const commonStyle = {
    margin: "10px",
    padding: "5px",
    borderRadius: "var(--astral-border-radius)",
    color: "var(--astral-teal)",
    fontFamily: "var(--professional-font)"
  };

  const handleFinalClick = () => {
    return input4 > 10000 ? null : props.setValues(input1, input2, input4);
  };

  const [input1, setInput1] = React.useState({ name: "height", value: null });
  const [input2, setInput2] = React.useState({ name: "width", value: null });
  //const [input3, setInput3] = React.useState({ name: "depth", value: null });
  const [input4, setInput4] = React.useState({ value: null });

  return (
    <div className="editor-control-panel">
      <div 
        className="editor-section-title"
        style={{
          color: "#00E5FF",
          textAlign: "center",
          fontSize: "20px",
          fontFamily: "var(--professional-font)",
          marginBottom: "20px",
          textShadow: "0 0 10px rgba(0, 229, 255, 0.5)",
          textTransform: "uppercase"
        }}
      >
        MANUAL INPUT
      </div>

      <div className="input-group">
        <label 
          className="input-label"
          style={{
            color: "#00E5FF",
            fontFamily: "var(--professional-font)",
            fontSize: "14px",
            marginBottom: "8px",
            display: "block",
            textShadow: "0 0 5px rgba(0, 229, 255, 0.3)",
            textTransform: "uppercase"
          }}
        >
          HEIGHT:
        </label>
        <input
          className="editor-input"
          type="text"
          placeholder="(in px)"
          onChange={(event) => {
            setInput1({
              name: "height",
              value: JSON.parse(event.target.value),
            });
          }}
        />
      </div>

      <div className="input-group" style={{ marginTop: "20px" }}>
        <label 
          className="input-label"
          style={{
            color: "#00E5FF",
            fontFamily: "var(--professional-font)",
            fontSize: "14px",
            marginBottom: "8px",
            display: "block",
            textShadow: "0 0 5px rgba(0, 229, 255, 0.3)",
            textTransform: "uppercase"
          }}
        >
          WIDTH:
        </label>
        <input
          className="editor-input"
          type="text"
          placeholder="(in px)"
          onChange={(event) => {
            setInput2({
              name: "width",
              value: JSON.parse(event.target.value),
            });
          }}
        />
      </div>

      <div className="input-group" style={{ marginTop: "20px" }}>
        <label 
          className="input-label"
          style={{
            color: "#00E5FF",
            fontFamily: "var(--professional-font)",
            fontSize: "14px",
            marginBottom: "8px",
            display: "block",
            textShadow: "0 0 5px rgba(0, 229, 255, 0.3)",
            textTransform: "uppercase"
          }}
        >
          TOTAL COPIES:
        </label>
        <input
          className="editor-input"
          type="text"
          placeholder="Enter number of copies"
          onChange={(event) => {
            setInput4({
              name: "copies",
              value: JSON.parse(event.target.value),
            });
          }}
        />
      </div>

      <div style={{ textAlign: "center", marginTop: "25px" }}>
        <Button
          className="editor-button"
          variant="contained"
          onClick={handleFinalClick}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};
