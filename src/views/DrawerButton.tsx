import { Drawer, IconButton } from "@mui/material";
import React from "react";
import DrawerContent from "./DrawerContents";
import MenuIcon from "@mui/icons-material/Menu";

export default function DrawerButton() {
  const [open, setOpen] = React.useState(false);

  function handleDrawerClose() {
    setOpen(false);
  }

  return (
    <React.Fragment>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={() => setOpen(true)}
      >
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={handleDrawerClose}>
        <DrawerContent onClose={handleDrawerClose} />
      </Drawer>
    </React.Fragment>
  );
}
