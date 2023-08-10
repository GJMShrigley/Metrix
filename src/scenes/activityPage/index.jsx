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
import ProgressBox from "../../components/ProgressBox";
import * as moment from "moment";
import DateSearch from "../../components/DateSearch";
import StatBox from "../../components/StatBox"

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
            setPageTitle(startDate)
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
    }, [metricsArray, endDate, startDate]);

    const statBoxes = chartData.map((data, i) => {
        return (
            <StatBox title={data.id} stats={data.data} key={i} />
        )
    })

    return (
        <Box m="30px 0 0 20px" display="flex" flexDirection="column" justifyContent="space-around" alignItems="center">
            <Box height="7vh" display="flex" justifyContent="center">
                <Button component={Link} to={`/activity/0`} state={{ startDate: moment(startDate).subtract(1, "days").format("MM/DD/YYYY") }} type="submit" color="secondary" variant="contained" sx={{ height: "5vh" }}>
                    Previous
                </Button>
                <Header title={pageTitle} subtitle="" isDate={true} />
                <Button component={Link} to={`/activity/0`} state={{ startDate: moment(startDate).add(1, "days").format("MM/DD/YYYY") }} type="submit" color="secondary" variant="contained" sx={{ height: "5vh" }}>
                    Next
                </Button>
            </Box>
            <Box width="380px">
                <DateSearch />
            </Box>
            <Box width="100%" height="67vh">
                <LineChart dataType="date" startDate={startDate} endDate={endDate} chartData={chartData} />
            </Box>
            <Box width="100%" height="67vh" display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
                {statBoxes}
            </Box>
        </Box>
    )
}

export default ActivityPage;