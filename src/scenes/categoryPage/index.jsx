import { useState, useEffect } from "react";

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
import StatBox from "../../components/StatBox";

import { addMetricToCategory, saveFile } from "../../store/userDataSlice";
import { tokens } from "../../theme";

const Category = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const params = useParams();
  const id = parseInt(params.id);
  const categoryArray = useSelector((state) => state.userData.categories);
  const metricsArray = useSelector((state) => state.userData.metrics);
  const isMobile = useMediaQuery("(max-width: 800px)");

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

  useEffect(() => {
    setSelectedCategory(categoryArray[id]);
  });

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

  const handleChange = (value) => {
    setSelection(value.target.value);
  };

  const handleSubmit = () => {
    dispatch(
      addMetricToCategory({ selectionValues: selection, categoryId: id })
    );
    setSelection([]);
    dispatch(saveFile());
  };

  const statBoxes = chartData.contents.map((data, i) => {
    return (
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">{data.id}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <StatBox
            isCategory={true}
            key={i}
            stats={data.data}
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
          display: "flex",
          justifyContent: "center",
          width: "100vw",
        }}
      >
        <Header isCategory={true} title={chartData.categoryId} />
      </Box>
      <Box>
        <Box>
          <Box sx={{  padding: "1rem", width: "100vw" }}>
            {data2.length > 0 ? (
              <BiaxialChart dataType="category" data1={data1} data2={data2} />
            ) : (
              <LineChart chartData={chartData.contents} dataType="category" />
            )}
          </Box>
        </Box>
      </Box>
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">ADD/REMOVE METRIC</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            alignContent: "center",
            display: "flex",
            justifyContent: "center",
            width: "100vw",
          }}
        >
          <FormControl>
            <InputLabel>Add/Remove Metric</InputLabel>
            <Select
              label="Metrics"
              multiple
              onChange={handleChange}
              sx={{
                maxWidth: "70vw",
                width: "15rem",
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
          <Typography variant="h5">VIEW STATS</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: "grid",
              gap: "1rem",
              justifyItems: "center",
            }}
          >
            {statBoxes}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Category;
