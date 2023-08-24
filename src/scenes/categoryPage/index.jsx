import { Box, FormControl, Typography, useTheme, InputLabel, Select, MenuItem, Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import BiaxialChart from "../../components/BiaxialChart";
import { useState, useEffect } from "react";
import { addMetricToCategory, saveFile, loadFile, changeTitle } from "../../store/userDataSlice";
import { tokens } from "../../theme";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DateSlice from "../../components/DateSlice";
import moment from "moment";

const Category = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const params = useParams();
    const id = parseInt(params.id);
    const categoryArray = useSelector((state) => state.userData.categories);
    const metricsArray = useSelector((state) => state.userData.metrics);
    const dispatch = useDispatch();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [selection, setSelection] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(categoryArray[0]);
    const [chartData, setChartData] = useState({
        categoryId: "",
        contents: [{
            "id": "",
            "color": "#ffff",
            "data": [
                {
                    "x": "07/20/2023",
                    "y": "0"
                }
            ],
            "type": "Scale"
        }]
    });
    const [data1, setData1] = useState([])
    const [data2, setData2] = useState([])

    useEffect(() => {
        setSelectedCategory(categoryArray[id])
    })

    useEffect(() => {
        let metricsData = []
        for (let i = 0; i < selectedCategory.contents.length; i++) {
            const metricsMatch = metricsArray.find(data => data.id === selectedCategory.contents[i]);
            metricsData.push(metricsMatch);
        }
        const categoryData = Object.assign({}, { categoryId: selectedCategory.categoryId, contents: metricsData })
        setChartData(categoryData)
    }, [selectedCategory]);

    useEffect(() => {
        let tempData1 = [];
        let tempData2 = [];
        for (let i = 0; i < chartData.contents.length; i++) {
            if (chartData.contents[i].type === chartData.contents[0].type) {
                tempData1.push(chartData.contents[i]);
            } else {
                tempData2.push(chartData.contents[i]);
            }
        }
        if (tempData2.length) {
            setData1(tempData1)
            setData2(tempData1.concat(tempData2));
        } else {
            setData1([])
            setData2([])
        }
    }, [chartData, categoryArray, params, selectedCategory]);


    const selectionItems = metricsArray.map((metric, i) => {
        return (
            <MenuItem key={metric.id} value={i}>{metric.id}</MenuItem>
        )
    })

    const handleChange = (value) => {
        setSelection(value.target.value)
    }

    const handleSubmit = () => {
        dispatch(addMetricToCategory({ selectionValues: selection, categoryId: id }));
        setSelection([])
        dispatch(saveFile())
    }

    const sliceDate = (startDate, endDate) => {
        let contentsArray = [];
        for (let i = 0; i < chartData.contents.length; i++) {
            let dateArray = [];
            for (let e = 0; e < chartData.contents[i].data.length; e++) {
                if ((moment(chartData.contents[i].data[e].x).isAfter(startDate)) && (moment(chartData.contents[i].data[e].x).isBefore(endDate))) {
                    dateArray.push(chartData.contents[i].data[e])
                }
            }
            contentsArray.push({ ...chartData.contents[i], data: dateArray })
        }
        setChartData({ ...chartData[0], contents: contentsArray })
    }

    return (
        <Box
            ml="20px"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gap="10px">
            <Box
                gridColumn="span 12"
                backgroundColor={colors.primary[400]}
            >
                <Header
                    title={chartData.categoryId}
                    subtitle=""
                    isCategory={true}
                    display="flex"
                    gridColumn="span 12"
                />
                <Accordion gridColumn="span 6" >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h5">
                            SELECT DATES
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <DateSlice sliceDate={sliceDate} />
                    </AccordionDetails>
                </Accordion>
            </Box>
            <Box
                gridColumn="span 12"
                backgroundColor={colors.primary[400]}
            >
                <Box m="10px 10px">
                    {data2.length > 0 ? <BiaxialChart dataType="category" data1={data1} data2={data2} /> : <LineChart dataType="category" chartData={chartData.contents} />}
                    <Box width="50%" display="flex">
                    </Box>
                    <Box
                        width="100vw"
                        display="flex"
                        alignContent="center"
                        justifyContent="center">
                        <FormControl >
                            <InputLabel>Add/Remove Metric</InputLabel>
                            <Select
                                label="Metrics"
                                onChange={handleChange}
                                value={selection}
                                multiple
                                sx={{
                                    width: "25vw"
                                }}
                            >
                                {selectionItems}
                            </Select>
                        </FormControl>
                        <Button type="submit" color="secondary" variant="contained" onClick={handleSubmit} sx={{ gridColumn: "span 1" }}>
                            Add/Remove
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box >
    )
}

export default Category