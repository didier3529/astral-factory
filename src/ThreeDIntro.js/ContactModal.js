import * as React from "react";
import { Backdrop } from "@material-ui/core";
import { Box } from "@material-ui/core";
import { Modal } from "@material-ui/core";
import { Fade } from "@material-ui/core";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  height: 650,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "10px",
  p: 4,
  backgroundColor: "#525050d7",
};

export const ContactModalComponent = (props) => {
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={props.isOpen}
        onClose={props.handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.isOpen}>
          <Box sx={style}>
            <p style={{ color: "#fff", fontFamily: "var(--professional-font)", textTransform: "uppercase" }}>
              This is a Contact project
            </p>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
