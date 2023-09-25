import { useEffect, useState } from "react";

import calculateCorrelation from "calculate-correlation";
import { Formik } from "formik";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import useMediaQuery from "@mui/material/useMediaQuery";
import { HexColorPicker } from "react-colorful";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as yup from "yup";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import ProgressBox from "../../components/ProgressBox";
import StatBox from "../../components/StatBox";

import {
  addGoal,
  addNote,
  saveFile,
  updateValue,
} from "../../store/userDataSlice";
import { tokens } from "../../theme";

const currentDate = new Date().toLocaleDateString("en-US", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const initialValues = {
  x: `${currentDate}`,
  y: 0,
  goal: "0",
  note: "",
};

const userSchema = yup.object().shape({
  x: yup.date().required("required"),
  y: yup.number().required("required"),
  goal: yup.number(),
  note: yup.string(),
});

const ChartPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width: 992px)");
  const isLandscape = useMediaQuery("(orientation: landscape)");
  const dispatch = useDispatch();
  const params = useParams();
  const chartId = parseInt(params.id);
  const userData = useSelector((state) => state.userData.metrics);
  const [color, setColor] = useState("#0000");
  const [typeSelection, setTypeSelection] = useState("Scale");
  const [chartData, setChartData] = useState(userData);
  const [goal, setGoal] = useState();
  const [latest, setLatest] = useState(0);
  const [correlationSelection, setCorrelationSelection] = useState([]);
  const [correlationResult, setCorrelationResult] = useState();
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(null);
  let height;

  if (isNonMobile) {
    height = 80;
  } else if (!isNonMobile && isLandscape) {
    height = 125;
  } else if (!isNonMobile && !isLandscape) {
    height = 64;
  }

  //Set the chart data
  useEffect(() => {
    for (let i = 0; i < userData.length; i++) {
      if (i === chartId) {
        setColor(userData[chartId].color);
        setChartData([userData[chartId]]);
        setTypeSelection(userData[chartId].type);
      }
    }
  }, [userData, chartId]);

  //Set the goal and latest chart data value
  useEffect(() => {
    setGoal(parseInt(chartData[0].goal));
    setLatest(parseInt(chartData[0].data[chartData[0].data.length - 1].y));
  }, [chartData]);

  function handleDate(newStartDate, newEndDate) {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  }

  const statBoxes = chartData.map((data, i) => {
    return (
      <StatBox
        key={i}
        endDate={endDate}
        startDate={startDate}
        stats={data.data}
        type={data.type}
      />
    );
  });

  const selectionItems = userData.map((metric, i) => {
    return (
      <MenuItem key={metric.id} value={i}>
        {metric.id}
      </MenuItem>
    );
  });

  const radioButtons = Array.from({ length: 10 }, (_, i) => {
    return (
      <FormControlLabel
        key={i}
        control={
          <Radio
            sx={{
              "& .MuiSvgIcon-root": {
                fontSize: 35,
              },
            }}
          />
        }
        label={`${i + 1}`}
        value={`${i + 1}`}
      />
    );
  });

  const menuItems = Array.from({ length: 10 }, (_, i) => {
    return (
      <MenuItem key={i + 1} value={`${i + 1}`}>
        {`${i + 1}`}
      </MenuItem>
    );
  });

  const handleCorrelationChange = (value) => {
    setCorrelationSelection(value.target.value);
  };

  const handleCorrelationSubmit = () => {
    let metric1 = [];
    let metric2 = [];
    for (let i = 0; i < chartData[0].data.length; i++) {
      metric1.push(parseInt(chartData[0].data[i].y));
    }

    for (let i = 0; i < userData[correlationSelection].data.length; i++) {
      metric2.push(parseInt(userData[correlationSelection].data[i].y));
    }

    const correlation = calculateCorrelation(metric1, metric2);

    function findCorrelationBracket(correlation) {
      if (correlation < -0.5) {
        return "Very low";
      } else if (correlation < 0 && correlation > -0.5) {
        return "Low";
      } else if (correlation === 0) {
        return "Medium";
      } else if (correlation > 0 && correlation < 0.5) {
        return "High";
      } else if (correlation > 0.5) {
        return "Very High";
      }
    }

    const correlationBracket = findCorrelationBracket(correlation);

    const result = { correlation: correlation, relation: correlationBracket };
    setCorrelationResult(result);
  };

  const handleTypeChange = (value) => {
    setTypeSelection(value.target.value);
  };

  const handleFormSubmit = (values) => {
    dispatch(
      updateValue({
        color: color,
        selectedMetric: chartData[0].id,
        type: typeSelection,
        values: values,
      })
    );
    dispatch(saveFile());
  };

  const handleGoalSubmit = (value) => {
    dispatch(addGoal({ chartId: chartData[0].id, goal: value.goal }));
    dispatch(saveFile());
  };

  const handleNoteSubmit = (value) => {
    dispatch(
      addNote({ chartId: chartData[0].id, note: value.note, x: value.x })
    );
    dispatch(saveFile());
  };

  return (
    <Box>
      <Box
        sx={{
          alignItems: "center",
          backgroundColor: colors.primary[400],
          display: "flex",
          flexDirection: isLandscape ? "row" : "column",
          gap: ".5rem",
          justifyContent: "center",
        }}
      >
        <Header title={chartData[0].id} />
        {goal ? (
          <ProgressBox goal={goal} latest={latest} title={chartData[0].id} />
        ) : null}
      </Box>
      <Box
        sx={{
          height: `${height}vh`,
          padding: "1rem",
          width: "100vw",
        }}
      >
        <LineChart
          chartData={chartData}
          dataType="metric"
          handleDate={handleDate}
        />
      </Box>
      <Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: isLandscape ? "row" : "column",
            }}
          >
            <Accordion disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5">ADD DATA</Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: isNonMobile ? "50vw" : "100%",
                }}
              >
                <Formik
                  initialValues={initialValues}
                  onSubmit={handleFormSubmit}
                  validationSchema={userSchema}
                >
                  {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    touched,
                    values,
                  }) => (
                    <form onSubmit={handleSubmit}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "1rem",
                        }}
                      >
                        <TextField
                          error={!!touched.x && !!errors.x}
                          fullWidth
                          helperText={touched.x && errors.x}
                          label="Time Logged"
                          name="x"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          type="text"
                          value={values.x}
                          variant="filled"
                        />
                        {typeSelection === "Scale" ? (
                          <FormControl>
                            <FormLabel id="scale-buttons-group-label">
                              Value
                            </FormLabel>
                            <RadioGroup
                              aria-labelledby="scale-buttons-group-label"
                              name="y"
                              onChange={handleChange}
                              row
                            >
                              {radioButtons}
                            </RadioGroup>
                          </FormControl>
                        ) : (
                          <TextField
                            error={!!touched.y && !!errors.y}
                            fullWidth
                            helperText={touched.y && errors.y}
                            label="Value"
                            name="y"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.y}
                            variant="filled"
                          />
                        )}
                        <FormControl>
                          <InputLabel>Select Measurement Type</InputLabel>
                          <Select
                            id="type"
                            label="type"
                            name="type"
                            onChange={handleTypeChange}
                            value={typeSelection}
                          >
                            <MenuItem value={"Scale"}>Scale</MenuItem>
                            <MenuItem value={"Number"}>Number</MenuItem>
                          </Select>
                        </FormControl>
                        <Button
                          color="secondary"
                          sx={{ height: "3rem" }}
                          type="submit"
                          variant="contained"
                        >
                          Add Measurement
                        </Button>
                      </Box>
                    </form>
                  )}
                </Formik>
              </AccordionDetails>
            </Accordion>
            <Accordion disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5">COLOUR</Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: isLandscape ? "25vw" : "90vw",
                }}
              >
                <HexColorPicker color={color} onChange={setColor} />
              </AccordionDetails>
            </Accordion>
            <Accordion disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5">SET GOAL</Typography>
              </AccordionSummary>
              <AccordionDetails
              sx={{
                width: isLandscape ? "25vw" : "90vw",
              }}>
                <Formik
                  initialValues={initialValues}
                  onSubmit={handleGoalSubmit}
                  validationSchema={userSchema}
                >
                  {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    touched,
                    values,
                  }) => (
                    <form onSubmit={handleSubmit}>
                      {typeSelection === "Scale" ? (
                        <FormControl fullWidth>
                          <InputLabel>GOAL</InputLabel>
                          <Select
                            label="goal"
                            name="goal"
                            onChange={handleChange}
                            value={values.goal}
                          >
                            {menuItems}
                          </Select>
                        </FormControl>
                      ) : (
                        <TextField
                          error={!!touched.goal && !!errors.goal}
                          fullWidth
                          helperText={touched.goal && errors.goal}
                          label="goal"
                          name="goal"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          type="text"
                          value={values.goal}
                          variant="filled"
                        />
                      )}

                      <Button
                        color="secondary"
                        fullWidth
                        type="submit"
                        variant="contained"
                      >
                        SET GOAL
                      </Button>
                    </form>
                  )}
                </Formik>
              </AccordionDetails>
            </Accordion>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: isLandscape ? "row" : "column",
              width: "100vw",
            }}
          >
            <Accordion disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5">ADD NOTE</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Formik
                  initialValues={initialValues}
                  onSubmit={handleNoteSubmit}
                  validationSchema={userSchema}
                >
                  {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    touched,
                    values,
                  }) => (
                    <form onSubmit={handleSubmit}>
                      <Box
                        sx={{
                          width: isLandscape ? "48vw" : "90vw",
                        }}
                      >
                        <TextField
                          error={!!touched.note && !!errors.note}
                          fullWidth
                          helperText={touched.note && errors.note}
                          label=""
                          name="note"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.note}
                          variant="filled"
                          type="text"
                        />
                        <Button
                          color="secondary"
                          fullWidth
                          type="submit"
                          variant="contained"
                        >
                          Add Note
                        </Button>
                      </Box>
                    </form>
                  )}
                </Formik>
              </AccordionDetails>
            </Accordion>
            <Accordion disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5">HISTORY</Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  width: isLandscape ? "48vw" : "90vw",
                }}
              >
                {statBoxes}
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">CORRELATION</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100vw",
              }}
            >
              <FormControl>
                <InputLabel>Add/Remove Metric</InputLabel>
                <Select
                  label="Metrics"
                  onChange={handleCorrelationChange}
                  sx={{
                    width: "80vw",
                  }}
                  value={correlationSelection}
                >
                  {selectionItems}
                </Select>
              </FormControl>
              <Button
                color="secondary"
                onClick={handleCorrelationSubmit}
                sx={{
                  width: "80vw",
                }}
                type="submit"
                variant="contained"
              >
                Add/Remove
              </Button>
            </Box>
            {correlationResult ? (
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <Typography sx={{ display: "flex" }} variant="h5">
                  {` The correlation between ${
                    userData[correlationSelection].id
                  } and ${
                    chartData[0].id
                  } is ${correlationResult.correlation.toFixed(3)}`}
                  &#40;{correlationResult.relation}&#41;
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isLandscape ? "row" : "column",
                    gap: "1rem",
                  }}
                >
                  <StatBox
                    endDate={endDate}
                    startDate={startDate}
                    stats={chartData[0].data}
                    title={chartData[0].id}
                    type={chartData[0].type}
                  />
                  <StatBox
                    endDate={endDate}
                    startDate={startDate}
                    stats={userData[correlationSelection].data}
                    title={userData[correlationSelection].id}
                    type={userData[correlationSelection].type}
                  />
                </Box>
              </Box>
            ) : null}
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export default ChartPage;
