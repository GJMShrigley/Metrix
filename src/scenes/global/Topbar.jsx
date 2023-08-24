import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch } from "react-redux";
import { deleteAll, saveFile } from "../../store/userDataSlice";
import { Link } from "react-router-dom";

const Topbar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const dispatch = useDispatch();

    const handleClearAll = () => {
        dispatch(deleteAll())
        dispatch(saveFile());
    }

    return (
        <Box display="flex" justifyContent="flex-end" p={2}>
            {/*Icons */}
            <Box display="flex">
                {/* <IconButton >
                    <DeleteForeverOutlinedIcon onClick={handleClearAll}/>
                </IconButton> */}
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === "dark" ? (
                        <DarkModeOutlinedIcon />
                    ) : (
                        <LightModeOutlinedIcon />
                    )}
                </IconButton>
                <IconButton 
                component={Link}
                to={"/settings"}>
                    <SettingsOutlinedIcon />
                </IconButton>
            </Box>
        </Box>
    );
}

export default Topbar;