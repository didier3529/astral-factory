import React from "react";
import Slider from "@material-ui/core/Slider";
import { useState } from "react";
import { ObjectContext, ObjectSelection } from "./EditingPage";
import "./Slider.css";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    color: "#FFFFFF",
    height: 8,
  },
  thumb: {
    height: 16,
    width: 16,
    backgroundColor: '#FFFFFF',
    border: '2px solid #FFFFFF',
    marginTop: -4,
    marginLeft: -8,
    '&:focus, &:hover, &$active': {
      boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
    color: '#FFFFFF',
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  rail: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  mark: {
    backgroundColor: '#FFFFFF',
    height: 8,
    width: 2,
    marginTop: 0,
  },
  markActive: {
    opacity: 1,
    backgroundColor: '#FFFFFF',
  },
});

export const SliderComponent = (props) => {
  const { objects, dispatch1 } = React.useContext(ObjectContext);
  const { selection, dispatch2 } = React.useContext(ObjectSelection);
  const classes = useStyles();

  return (
    <Slider
      classes={{
        root: classes.root,
        thumb: classes.thumb,
        active: classes.active,
        valueLabel: classes.valueLabel,
        track: classes.track,
        rail: classes.rail,
        mark: classes.mark,
        markActive: classes.markActive
      }}
      value={props.value}
      onChange={(event, value) => {
        dispatch1({
          type: "UPDATE",
          payload: {
            name: selection.name,
            [props.name]: value,
          },
        });
      }}
      min={0}
      max={100}
      marks={props.marks}
    />
  );
};
