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
import { updateValue, saveFile, addJournal } from "../../store/userDataSlice";
import { HexColorPicker } from "react-colorful";
import { useLocation } from "react-router-dom";
import ProgressBox from "../../components/ProgressBox";
import * as moment from "moment";
import DateSearch from "../../components/DateSearch";
import StatBox from "../../components/StatBox";
import BiaxialChart from "../../components/BiaxialChart";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const userSchema = yup.object().shape({
    x: yup.date().required("required"),
    note: yup.string()
});

const ActivityPage = () => {
    const location = useLocation().state
    const startDate = location.startDate;
    const endDate = location.endDate;
    const dispatch = useDispatch();
    const metricsArray = useSelector((state) => state.userData.metrics);
    const categoryArray = useSelector((state) => state.userData.categories);
    const journalArray = useSelector((state) => state.userData.journal);
    const [chartData, setChartData] = useState([{
        "id": "",
        "color": "",
        "data": [
            {
                "x": "",
                "y": "",
                "goal": ""
            }
        ],
        "type": "",
        "goal": ""
    }])
    const [pageTitle, setPageTitle] = useState(startDate)
    const [data1, setData1] = useState([])
    const [data2, setData2] = useState([])
    const [textData, setTextData] = useState("")

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
            setPageTitle(startDate);

            for  (let i = 0; i < journalArray.length; i++) { 
                if (journalArray[i].x === startDate) {
                    setTextData(journalArray[i].note)
                }
            }
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

    useEffect(() => {
        let tempData1 = [];
        let tempData2 = [];
        for (let i = 0; i < chartData.length; i++) {
            if (chartData[i].type === chartData[0].type) {
                tempData1.push(chartData[i]);
            } else {
                tempData2.push(chartData[i]);
            }
        }
        if (tempData2.length) {
            setData1(tempData1)
            setData2(tempData1.concat(tempData2));
        } else {
            setData1([])
            setData2([])
        }
    }, [chartData, categoryArray, location]);

    const handleNoteSubmit = (value) => {
        dispatch(addJournal({ x: startDate, note: value.note }))
        dispatch(saveFile());
    }

    const statBoxes = chartData.map((data, i) => {
        return (
            <StatBox
                title={data.id}
                stats={data.data}
                key={i}
                type={data.type} />
        )
    });

    return (
        <Box
            ml="20px"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gap="10px">
            <Box
                height="7vh"
                gridColumn="span 12"
                display="flex"
                flexDirection="column"
                justifyContent="center">
                <Box display="flex">
                    <Button
                        component={Link}
                        to={`/activity/0`}
                        state={{ startDate: moment(startDate).subtract(1, "days").format("MM/DD/YYYY") }}
                        type="submit"
                        color="secondary"
                        variant="contained"
                        sx={{ height: "5vh" }}>
                        Previous
                    </Button>
                    <Header
                        title={pageTitle}
                        subtitle=""
                        isDate={true} />
                    <Button
                        component={Link}
                        to={`/activity/0`}
                        state={{ startDate: moment(startDate).add(1, "days").format("MM/DD/YYYY") }}
                        type="submit"
                        color="secondary"
                        variant="contained"
                        sx={{ height: "5vh" }}>
                        Next
                    </Button>
                </Box>
                <Box width="300px">
                    <DateSearch />
                </Box>
            </Box>
            <Box
                gridColumn="span 12"
                height="67vh">
                {data2.length > 0 ?
                    <BiaxialChart
                        dataType="date"
                        startDate={startDate}
                        endDate={endDate}
                        data1={data1}
                        data2={data2} />
                    :
                    <LineChart
                        dataType="date"
                        startDate={startDate}
                        endDate={endDate}
                        chartData={chartData} />}
            </Box>
            {!endDate
                ?
                <Accordion sx={{ gridColumn: "span 12" }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h5">
                            ADD JOURNAL ENTRY
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Formik
                            onSubmit={handleNoteSubmit}
                            initialValues={{note: textData}}
                            validationSchema={userSchema}
                            enableReinitialize
                        >
                            {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                                <form onSubmit={handleSubmit}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label=""
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.note}
                                        name="note"
                                        error={!!touched.note && !!errors.note}
                                        helperText={touched.note && errors.note}
                                        multiline
                                        sx={{
                                            gridColumn: "span 12",
                                            "& .MuiInputBase-root": {
                                                height: "65vh",
                                                fontSize: "20px"
                                            },
                                        }}
                                    />
                                    <Button fullWidth type="submit" color="secondary" variant="contained" sx={{ gridColumn: "span 1" }}>
                                        Add Note
                                    </Button>
                                </form>
                            )}
                        </Formik>
                    </AccordionDetails>
                </Accordion>
                :
                <></>}
            <Accordion sx={{ gridColumn: "span 12" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5">
                        VIEW STATS
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box
                        gridColumn="span 12"
                        height="67vh"
                        display="grid"
                        gridTemplateColumns="repeat(2, 1fr)"
                        gap="10px"
                        justifyItems="center">
                        {statBoxes}
                    </Box>
                </AccordionDetails>
            </Accordion>

        </Box>
    )
}

export default ActivityPage;