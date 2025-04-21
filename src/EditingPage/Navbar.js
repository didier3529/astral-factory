import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import './navbar-theme.css';

// Using Inline Styling
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: '#000000',
  },
  appBar: {
    backgroundColor: '#000000',
    boxShadow: 'none',
  },
}));

// Exporting Default Navbar to the App.js File
export const NavComponent = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="sticky" className="nav-container" style={{ backgroundColor: '#000000' }}>
        <Toolbar variant="dense" className="nav-toolbar">
          <img
            className="nav-logo"
            src={require("./PlanetLogo.png")}
            alt="astral"
          />
          
          <div className="nav-titles-wrapper">
            <Typography
              variant="h6"
              component="a"
              href="/"
              className="nav-title"
            >
              ASTRAL FACTORY
            </Typography>

            <Typography
              variant="h6"
              component="a"
              href="/"
              className="nav-suite-title"
            >
              NFT GENERATOR SUITE
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};
