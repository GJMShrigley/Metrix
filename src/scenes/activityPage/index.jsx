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
import * as moment from "moment";


const ActivityPage = () => {
    const location = useLocation().state
    const startDate = location.startDate;
    const endDate = location.endDate;
    const metricsArray = useSelector((state) => state.userData.metrics);
    const [chartData, setChartData] = useState([])
    const [pageTitle, setPageTitle] = useState(startDate)

    useEffect(() => {
        if (!endDate) {
            let dateArray = [];
            metricsArray.map((metric, i) => {
                for (let i = 0; i < metric.data.length; i++) {
                    if (metric.data[i].x === startDate) {
                        let tempArray = [];
                        tempArray.push(metric.data.slice(i - 1, i + 2))
                        const temp = tempArray.reduce((temp, data) => ({ ...metricsArray, data: temp }))
                        dateArray.push({ ...metric, data: [...temp] })
                    }
                }
            })
            setChartData(dateArray);
        } else {
            let newChartData = []
            metricsArray.map((metric, i) => {
                let newMetricData = [];
                for (let i = 0; i < metric.data.length; i++) {
                    if (moment(metric.data[i].x).isSameOrAfter(startDate, "day") && moment(metric.data[i].x).isSameOrBefore(endDate, "day")) {
                        newMetricData.push(metric.data[i]);                      
                    }
                }
                newChartData.push({ ...metric, data: newMetricData });
            })
            setPageTitle(startDate + " - " + endDate);
            setChartData(newChartData);
        }
    }, [metricsArray])

    return (
        <Box ml="20px">
            <Header title={pageTitle} subtitle="" isDate={true} />
            <Box height="67vh">
                <LineChart dataType="date" startDate={startDate} endDate={endDate} chartData={chartData} />
            </Box>
        </Box>
    )
}

export default ActivityPage;