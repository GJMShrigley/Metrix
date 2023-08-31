import { useEffect, useState } from "react";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Box, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { toggleSidebar } from "../../store/displaySlice";

const Topbar = () => {
  const dispatch = useDispatch();

  const handleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <Box display="flex" p={2}>
      <Box display="flex" width="100%" justifyContent="space-between">
        <IconButton onClick={handleSidebar}>
          <MenuOutlinedIcon />
        </IconButton>
        <Box>
          <IconButton component={Link} to={"/settings"}>
            <SettingsOutlinedIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;
