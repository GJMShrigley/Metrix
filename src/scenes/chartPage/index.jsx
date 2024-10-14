import { useEffect, useState } from "react";

import calculateCorrelation from "calculate-correlation";
import { Formik } from "formik";
import * as moment from "moment";
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
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
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
  updateValue,
} from "../../store/userDataSlice";
import { tokens } from "../../theme";

const date = new Date();

const currentDate = moment(date).local().format("MM/DD/YYYY kk:mm");
const lastWeek = moment(currentDate).subtract(6, "days")//.format("MM/DD/YYYY");

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
  const [totalSelection, setTotalSelection] = useState("Average");
  const [typeSelection, setTypeSelection] = useState("Scale");
  const [chartData, setChartData] = useState(userData);
  const [goal, setGoal] = useState();
  const [goalType, setGoalType] = useState();
  const [latest, setLatest] = useState(0);
  const [startDate, setStartDate] = useState(lastWeek);
  const [endDate, setEndDate] = useState(currentDate);
  const [dateLog, setDateLog] = useState(currentDate);
  let height;

  //Set the height variable to the relevant value for desktop, landscape, and portrait viewports.
  if (isNonMobile) {
    height = 72;
  } else if (!isNonMobile && isLandscape) {
    height = 125;
  } else if (!isNonMobile && !isLandscape) {
    height = 67;
  }

  const initialValues = {
    x: `${dateLog}`,
    y: 0,
    goal: "0",
    goalType: "High",
    note: "",
  };

  //Set the chart data with the relevant metric.
  useEffect(() => {
    for (let i = 0; i < userData.length; i++) {
      if (i === chartId) {
        setColor(userData[chartId].color);
        setChartData([userData[chartId]]);
        setTypeSelection(userData[chartId].type);
        setTotalSelection(userData[chartId].total);
      }
    }
  }, [userData, chartId]);

  //Set the goal and latest chart data value.
  useEffect(() => {
    setGoal(parseInt(chartData[0].data.at(-1).goal));
    setGoalType(chartData[0].data.at(-1).goalType);
    setLatest(parseInt(chartData[0].data[chartData[0].data.length - 1].y));
  }, [chartData]);

  const statBoxes = chartData.map((data, i) => {
    return (
      <StatBox
        endDate={endDate}
        key={i}
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

  const radioButtons = Array.from({ length: 11 }, (_, i) => {
    return (
      <FormControlLabel
        key={i}
        control={
          <Radio
            sx={{
              "& .MuiSvgIcon-root": {
                fontSize: 50,
              },
            }}
          />
        }
        label={`${i}`}
        value={`${i}`}
      />
    );
  });

  const menuItems = Array.from({ length: 11 }, (_, i) => {
    return (
      <MenuItem key={i} value={`${i}`}>
        {`${i}`}
      </MenuItem>
    );
  });

  const goalTypeItems = [
    <MenuItem
      key={0}
      value={`Low`}>
      {`Low`}
    </MenuItem>,
    <MenuItem
      key={1}
      value={`High`}>
      {`High`}
    </MenuItem>]

  Array.from({ length: 11 }, (_, i) => {
    return (
      <MenuItem key={i} value={`${i}`}>
        {`${i}`}
      </MenuItem>
    );
  });

  const handleDate = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const handleTypeChange = (value) => {
    setTypeSelection(value.target.value);
  };

  const handleTotalChange = (value) => {
    setTotalSelection(value.target.value);
  };

  const handleFormSubmit = (values) => {
    dispatch(
      updateValue({
        total: totalSelection,
        color: color,
        selectedMetric: chartData[0].id,
        type: typeSelection,
        values: {
          ...values, x: `${moment(dateLog).format("MM/DD/YYYY kk:mm")}`
        },
      })
    );
  };

  const handleGoalSubmit = (value) => {
    dispatch(addGoal({ chartId: chartData[0].id, goal: value.goal, goalType: value.goalType, x: `${moment(dateLog).format("MM/DD/YYYY")}` }));
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
          <ProgressBox goal={goal} latest={latest} title={chartData[0].id} goalType={goalType} />
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
          endDate={endDate}
          handleDate={handleDate}
          startDate={startDate}
        />
      </Box>
      <Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Accordion disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">ADD DATA</Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "92vw",
              }}
            >
              <DateTimePicker ampm={false} fullWidth label="Date Logged"
                onChange={(newValue) => (setDateLog(newValue))}
                type="text"
              />
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
                        display: "grid",
                        flexDirection: "column",
                        gap: "1rem",
                        gridTemplateColumns: "1",
                        "& > .react-colorful": { margin: "1rem 0", width: "100%" },
                        ".react-colorful__saturation": { height: "100%" },
                        ".react-colorful__hue": { height: "50%" },
                        ".react-colorful__hue-pointer, .react-colorful__saturation-pointer":
                          { height: "1rem", width: "1rem" },
                        width: "85vw",
                      }}
                    >
                      {typeSelection === "Scale" ? (
                        <FormControl
                          sx={{
                            margin: "1rem 4rem",
                            width: isLandscape ? "90%" : "100%",
                          }}>
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
                      <Button
                        color="secondary"
                        fullWidth
                        sx={{
                          height: "3rem",
                          marginTop: "1rem",
                        }}
                        type="submit"
                        variant="contained"
                      >
                        Add Measurement
                      </Button>
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
                      <FormControl>
                        <InputLabel>Select Measurement Total</InputLabel>
                        <Select
                          id="type"
                          label="type"
                          name="type"
                          onChange={handleTotalChange}
                          value={totalSelection}
                        >
                          <MenuItem value={"Cumulative"}>Cumulative</MenuItem>
                          <MenuItem value={"Average"}>Average</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        error={!!touched.note && !!errors.note}
                        fullWidth
                        helperText={touched.note && errors.note}
                        label="Note (Optional)"
                        name="note"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.note}
                        variant="filled"
                        type="text"
                      />
                      <HexColorPicker color={color} onChange={setColor} />
                    </Box>
                  </form>
                )}
              </Formik>
              <Box
                sx={{
                  width: "85vw"
                }}
              >
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
                        <FormControl fullWidth
                          sx={{
                            marginTop: "1rem",
                          }}>
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
                      <FormControl fullWidth
                        sx={{
                          marginTop: ".5rem",
                        }}>
                        <InputLabel>TYPE OF GOAL</InputLabel>
                        <Select
                          label="goalType"
                          name="goalType"
                          onChange={handleChange}
                          value={values.goalType}
                        >
                          {goalTypeItems}
                        </Select>
                      </FormControl>
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
              </Box>
            </AccordionDetails>
          </Accordion>

          <Box
            sx={{
              display: "grid",
              width: "100%",
            }}
          >
            <Accordion disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5">HISTORY</Typography>
              </AccordionSummary>
              <AccordionDetails>{statBoxes}</AccordionDetails>
            </Accordion>
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default ChartPage;
