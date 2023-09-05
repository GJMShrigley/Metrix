import { Box, IconButton } from "@mui/material";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import { toggleSidebar } from "../../store/displaySlice";

const Topbar = () => {
  const dispatch = useDispatch();

  const handleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <Box display="flex" sx={{ padding: "1rem" }}>
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
