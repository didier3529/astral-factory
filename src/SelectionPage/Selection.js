import React from "react";
import { NavComponent } from "../EditingPage/Navbar";
import { Button } from "@material-ui/core";
import { MyDropzone } from "./Dropzone";
import "./style.css";
import './astral-colors.css';
import { v4 as uuidv4 } from 'uuid';

export const Selection = () => {
  React.useEffect(() => {
    // Initialize UUID if not exists
    if (!sessionStorage.getItem('uuid')) {
      const newUuid = uuidv4();
      sessionStorage.setItem('uuid', JSON.stringify(newUuid));
      console.log('New UUID created:', newUuid);
    } else {
      console.log('Existing UUID:', JSON.parse(sessionStorage.getItem('uuid')));
    }
  }, []);

  const handleClick = () => {
    window.location.href = "/editing";
  };

  return (
    <div className="selection-container">
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100 }}>
        <NavComponent />
      </div>
      <div className="content-area">
        <h1 className="page-title">Upload Files</h1>
        <div className="upload-container">
          <div className="upload-box">
            <MyDropzone />
          </div>
        </div>
        <div className="button-container">
          <Button
            variant="contained"
            className="continue-button"
            onClick={handleClick}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};
