import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import { tokens } from "../../theme";
import { addDate, saveFile } from "../../store/userDataSlice";
import { HexColorPicker } from "react-colorful";
import { useLocation } from "react-router-dom";
import StatBox from "../../components/StatBox";


const ActivityPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const params = useParams();
    const location = useLocation()
    const props = location.state
    const chartId = props.i;
    const userData = useSelector((state) => state.userData.dates);
    const selectedDate = userData[chartId];

    return (
        <Box ml="20px">
            <Header title={`Activity on ${selectedDate.x}`} subtitle="" isDate={true} />
            <Box height="67vh">
                 <LineChart dataType="date"/>
            </Box>
        </Box>
    )
}

export default ActivityPage;