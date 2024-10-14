import { useState, useEffect } from "react";

import * as moment from "moment";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import BiaxialChart from "../../components/BiaxialChart";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import QuickUpdate from "../../components/QuickUpdate";
import StatBox from "../../components/StatBox";

import { addMetricToCategory } from "../../store/userDataSlice";
import { tokens } from "../../theme";

const date = new Date();

const currentDate = moment(date).format("MM/DD/YYYY");

const lastWeek = moment(currentDate).subtract(6, "days").format("MM/DD/YYYY");

const Category = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width: 992px)");
  const isLandscape = useMediaQuery("(orientation: landscape)");
  const dispatch = useDispatch();
  const params = useParams();
  const id = parseInt(params.id);
  const categoryArray = useSelector((state) => state.userData.categories);
  const metricsArray = useSelector((state) => state.userData.metrics);
  const [selection, setSelection] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryArray[0]);
  const [chartData, setChartData] = useState({
    categoryId: "",
    contents: [
      {
        id: "",
        color: "#ffff",
        data: [
          {
            x: "07/20/2023",
            y: "0",
          },
        ],
        type: "Scale",
      },
    ],
  });
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [startDate, setStartDate] = useState(lastWeek);
  const [endDate, setEndDate] = useState(currentDate);

  //Set the 'selectedCategory' state with the relevant category data.
  useEffect(() => {
    setSelectedCategory(categoryArray[id]);
  });

  //Set the 'chartData' state with an object containing the relevant metrics for the selected category.
  useEffect(() => {
    let metricsData = [];
    for (let i = 0; i < selectedCategory.contents.length; i++) {
      const metricsMatch = metricsArray.find(
        (data) => data.id === selectedCategory.contents[i]
      );
      metricsData.push(metricsMatch);
    }
    const categoryData = Object.assign(
      {},
      { categoryId: selectedCategory.categoryId, contents: metricsData }
    );
    setChartData(categoryData);
  }, [selectedCategory]);

  //Check if all metrics are of the same data type.
  //If metrics contain more than one data type, assign them to different state arrays.
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
    if (tempData2.length > 0) {
      setData1(tempData1);
      setData2(tempData1.concat(tempData2));
    } else {
      setData1([]);
      setData2([]);
    }
  }, [chartData, categoryArray, params, selectedCategory]);

  const selectionItems = metricsArray.map((metric, i) => {
    return (
      <MenuItem key={metric.id} value={i}>
        {metric.id}
      </MenuItem>
    );
  });


  //Push the values of the selected metrics into new arrays.
  //Use the 'calculateCorrelation' library to find the correlation between the two arrays of values.
  //Set the 'correlationResult' variable with the relation between the two arrays (between 'very low' and 'very high'.)

  const handleChange = (value) => {
    setSelection(value.target.value);
  };

  const handleDate = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const handleSubmit = () => {
    dispatch(
      addMetricToCategory({ selectionValues: selection, categoryId: id })
    );
    setSelection([]);
  };

  const statBoxes = chartData.contents.map((data, i) => {
    return (
      <Accordion disableGutters key={i}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">{data.id}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <StatBox
            endDate={endDate}
            id={i}
            key={i}
            stats={data.data}
            startDate={startDate}
            title={data.id}
          />
        </AccordionDetails>
      </Accordion>
    );
  });

  return (
    <Box
      sx={{
        display: "grid",
        width: "100vw",
      }}
    >
      <Box
        sx={{
          backgroundColor: colors.primary[400],
          display: "flex",
          justifyContent: "center",
          width: "100vw",
        }}
      >
        <Header isCategory={true} title={chartData.categoryId} />
      </Box>
      <Box>
        <Box>
          <Box
            sx={{
              padding: "1rem",
              height: isNonMobile ? "81vh" : "auto",
              width: "100vw",
            }}
          >
            {data2.length > 0 ? (
              <BiaxialChart
                dataType="category"
                data1={data1}
                data2={data2}
                endDate={endDate}
                handleDate={handleDate}
                startDate={startDate}
              />
            ) : (
              <LineChart
                chartData={chartData.contents}
                dataType="category"
                endDate={endDate}
                handleDate={handleDate}
                startDate={startDate}
              />
            )}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <QuickUpdate userData={metricsArray} />
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">ADD/REMOVE METRIC FROM CATEGORY</Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              alignContent: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <FormControl>
              <InputLabel>Add/Remove Metric</InputLabel>
              <Select
                label="Metrics"
                multiple
                onChange={handleChange}
                sx={{
                  width: isLandscape ? "30vw" : "50vw",
                }}
                value={selection}
              >
                {selectionItems}
              </Select>
            </FormControl>
            <Button
              color="secondary"
              onClick={handleSubmit}
              type="submit"
              variant="contained"
            >
              Add/Remove
            </Button>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">HISTORY</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                display: "grid",
                gap: "1rem",
                justifyItems: "center",
                gridTemplateColumns: isNonMobile ? "repeat(2, 1fr)" : "1",
              }}
            >
              {statBoxes}
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export default Category;
