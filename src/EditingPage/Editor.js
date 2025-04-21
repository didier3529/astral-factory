import React from "react";
import { SliderComponent } from "./Slider";
import { ObjectContext, ObjectSelection } from "./EditingPage";

export const Editor = (props) => {
  const { objects, dispatch1 } = React.useContext(ObjectContext);
  const { selection, dispatch2 } = React.useContext(ObjectSelection);

  const commonStyle = {
    margin: "10px",
    padding: "5px",
    borderRadius: "var(--astral-border-radius)",
    fontWeight: "500",
    fontFamily: "'Times New Roman', Times, serif",
    color: "#ffffff",
    textShadow: "0 0 5px rgba(77, 255, 77, 0.3)"
  };

  const currentValues = React.useRef(
    props.currentValues.find((obj) => obj.name === selection.name)
  );

  React.useEffect(() => {
    currentValues.current =
      objects && objects.find((obj) => obj.name === selection.name);
  }, [objects, selection.name]);

  return (
    <div className="editor-control-panel">
      <div className="editor-title" style={{ 
        color: "#FFFFFF",
        fontFamily: "var(--professional-font)",
        fontSize: "24px",
        marginBottom: "20px",
        textAlign: "center",
        textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
        textTransform: "uppercase"
      }}>
        EDITOR
      </div>

      <div style={commonStyle}>
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
          <SliderComponent
            className="editor-slider"
            name={"height"}
            value={props.currentValues.length ? props.currentValues[0].height : 0}
          />
        </div>
      </div>
      <div style={commonStyle}>
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
          <SliderComponent
            className="editor-slider"
            name={"width"}
            value={props.currentValues.width ? props.currentValues[0].width : 0}
          />
        </div>
      </div>
      <div style={commonStyle}>
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
            DEPTH:
          </label>
          <SliderComponent
            className="editor-slider"
            marks={true}
            name={"depth"}
            value={props.currentValues.depth ? props.currentValues[0].depth : 0}
          />
        </div>
      </div>
      {/* <div style={commonStyle}>
        Rarity:
        <SliderComponent
          marks={true}
          name={"rarity"}
          value={props.currentValues.rarity ? props.currentValues[0].rarity : 0}
        />
      </div> */}
    </div>
  );
};
