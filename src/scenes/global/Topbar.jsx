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
    <Box
      sx={{
        display: "flex",
        padding: ".3rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
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
