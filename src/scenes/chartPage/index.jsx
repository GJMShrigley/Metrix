import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import {
  updateValue,
  saveFile,
  addGoal,
  addNote,
} from "../../store/userDataSlice";
import { HexColorPicker } from "react-colorful";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ProgressBox from "../../components/ProgressBox";
import StatBox from "../../components/StatBox";
import calculateCorrelation from "calculate-correlation";

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
  y: yup.string().required("required"),
  goal: yup.string(),
  note: yup.string(),
});

const ChartPage = () => {
  const params = useParams();
  const chartId = parseInt(params.id);
  const userData = useSelector((state) => state.userData.metrics);
  const dispatch = useDispatch();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [color, setColor] = useState("#0000");
  const [typeSelection, setTypeSelection] = useState("Scale");
  const [chartData, setChartData] = useState(userData);
  const [goal, setGoal] = useState();
  const [latest, setLatest] = useState(0);
  const [correlationSelection, setCorrelationSelection] = useState([]);
  const [correlationResult, setCorrelationResult] = useState();

  useEffect(() => {
    for (let i = 0; i < userData.length; i++) {
      if (i === chartId) {
        setColor(userData[chartId].color);
        setChartData([userData[chartId]]);
        setTypeSelection(userData[chartId].type);
      }
    }
  }, [userData, chartId]);

  useEffect(() => {
    setGoal(parseInt(chartData[0].goal));
    setLatest(parseInt(chartData[0].data[chartData[0].data.length - 1].y));
  }, [chartData]);

  const statBoxes = chartData.map((data, i) => {
    return <StatBox stats={data.data} key={i} type={data.type} />;
  });

  const selectionItems = userData.map((metric, i) => {
    return (
      <MenuItem key={metric.id} value={i}>
        {metric.id}
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

    const relation = function (correlation) {
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
    };

    const result = { correlation: correlation, relation: relation };
    setCorrelationResult(result);
  };

  const handleTypeChange = (value) => {
    setTypeSelection(value.target.value);
  };

  const handleFormSubmit = (values) => {
    dispatch(
      updateValue({
        values: values,
        selectedMetric: chartData[0].id,
        color: color,
        type: typeSelection,
      })
    );
    dispatch(saveFile());
  };

  const handleGoalSubmit = (value) => {
    dispatch(addGoal({ goal: value.goal, chartId: chartData[0].id }));
    dispatch(saveFile());
  };

  const handleNoteSubmit = (value) => {
    dispatch(
      addNote({ x: value.x, note: value.note, chartId: chartData[0].id })
    );
    dispatch(saveFile());
  };
  console.log("chartPage", chartData)
  return (
    <Box ml="20px">
      <Box display="flex" justifyContent="center" alignItems="center">
        <Header title={chartData[0].id} subtitle="" />
        {goal ? (
          <ProgressBox title={chartData[0].id} goal={goal} latest={latest} />
        ) : (
          <></>
        )}
      </Box>
      <Box height="60vh">
        <LineChart dataType="metric" chartData={chartData} />
      </Box>
      <Box>
        <Box
          display="grid"
          gridTemplateColumns="10fr 1fr"
          sx={{
            "& > .react-colorful": {
              marginTop: "10px",
              width: "75%",
              height: "50px",
            },
            ".react-colorful__saturation": {
              height: "100%",
              position: "relative",
              top: "30%",
            },
            ".react-colorful__hue": { height: "100%" },
            ".react-colorful__hue-pointer, .react-colorful__saturation-pointer":
              { width: "25px", height: "25px" },
          }}
        >
          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={userSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box
                  display="grid"
                  gap="10px"
                  width="95%"
                  gridTemplateColumns="repeat(16, minmax(0, 1fr))"
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 4",
                    },
                  }}
                >
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Time Logged"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.x}
                    name="x"
                    error={!!touched.x && !!errors.x}
                    helperText={touched.x && errors.x}
                    sx={{ gridColumn: "span 2" }}
                  />
                  {typeSelection === "Scale" ? (
                    <FormControl sx={{ gridColumn: "span 10" }}>
                      <FormLabel id="scale-buttons-group-label">
                        Value
                      </FormLabel>
                      <RadioGroup
                        aria-labelledby="scale-buttons-group-label"
                        onChange={handleChange}
                        name="y"
                        row
                      >
                        <FormControlLabel
                          value="1"
                          control={
                            <Radio
                              sx={{
                                "& .MuiSvgIcon-root": {
                                  fontSize: 20,
                                },
                              }}
                            />
                          }
                          label="1"
                        />
                        <FormControlLabel
                          value="2"
                          control={
                            <Radio
                              sx={{
                                "& .MuiSvgIcon-root": {
                                  fontSize: 20,
                                },
                              }}
                            />
                          }
                          label="2"
                        />
                        <FormControlLabel
                          value="3"
                          control={
                            <Radio
                              sx={{
                                "& .MuiSvgIcon-root": {
                                  fontSize: 20,
                                },
                              }}
                            />
                          }
                          label="3"
                        />
                        <FormControlLabel
                          value="4"
                          control={
                            <Radio
                              sx={{
                                "& .MuiSvgIcon-root": {
                                  fontSize: 20,
                                },
                              }}
                            />
                          }
                          label="4"
                        />
                        <FormControlLabel
                          value="5"
                          control={
                            <Radio
                              sx={{
                                "& .MuiSvgIcon-root": {
                                  fontSize: 20,
                                },
                              }}
                            />
                          }
                          label="5"
                        />
                        <FormControlLabel
                          value="6"
                          control={
                            <Radio
                              sx={{
                                "& .MuiSvgIcon-root": {
                                  fontSize: 20,
                                },
                              }}
                            />
                          }
                          label="6"
                        />
                        <FormControlLabel
                          value="7"
                          control={
                            <Radio
                              sx={{
                                "& .MuiSvgIcon-root": {
                                  fontSize: 20,
                                },
                              }}
                            />
                          }
                          label="7"
                        />
                        <FormControlLabel
                          value="8"
                          control={
                            <Radio
                              sx={{
                                "& .MuiSvgIcon-root": {
                                  fontSize: 20,
                                },
                              }}
                            />
                          }
                          label="8"
                        />
                        <FormControlLabel
                          value="9"
                          control={
                            <Radio
                              sx={{
                                "& .MuiSvgIcon-root": {
                                  fontSize: 20,
                                },
                              }}
                            />
                          }
                          label="9"
                        />
                        <FormControlLabel
                          value="10"
                          control={
                            <Radio
                              sx={{
                                "& .MuiSvgIcon-root": {
                                  fontSize: 20,
                                },
                              }}
                            />
                          }
                          label="10"
                        />
                      </RadioGroup>
                    </FormControl>
                  ) : (
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Value"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.y}
                      name="y"
                      error={!!touched.y && !!errors.y}
                      helperText={touched.y && errors.y}
                      sx={{ gridColumn: "span 2" }}
                    />
                  )}
                  <FormControl sx={{ gridColumn: "span 2" }}>
                    <InputLabel>Select Measurement Type</InputLabel>
                    <Select
                      id="type"
                      name="type"
                      label="type"
                      onChange={handleTypeChange}
                      value={typeSelection}
                    >
                      <MenuItem value={"Scale"}>Scale</MenuItem>
                      <MenuItem value={"Number"}>Number</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    type="submit"
                    color="secondary"
                    variant="contained"
                    sx={{ gridColumn: "span 2", height: "50px" }}
                  >
                    Add Measurement
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
        <Box display="flex">
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">COLOUR</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <HexColorPicker color={color} onChange={setColor} />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">SET GOAL</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Formik
                onSubmit={handleGoalSubmit}
                initialValues={initialValues}
                validationSchema={userSchema}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                }) => (
                  <form onSubmit={handleSubmit}>
                    {typeSelection === "Scale" ? (
                      <FormControl fullWidth>
                        <InputLabel>Goal</InputLabel>
                        <Select
                          label="goal"
                          onChange={handleChange}
                          name="goal"
                          value={values.goal}
                        >
                          <MenuItem key={0} value={"0"}>
                            0
                          </MenuItem>
                          <MenuItem key={1} value={"1"}>
                            1
                          </MenuItem>
                          <MenuItem key={2} value={"2"}>
                            2
                          </MenuItem>
                          <MenuItem key={3} value={"3"}>
                            3
                          </MenuItem>
                          <MenuItem key={4} value={"4"}>
                            4
                          </MenuItem>
                          <MenuItem key={5} value={"5"}>
                            5
                          </MenuItem>
                          <MenuItem key={6} value={"6"}>
                            6
                          </MenuItem>
                          <MenuItem key={7} value={"7"}>
                            7
                          </MenuItem>
                          <MenuItem key={8} value={"8"}>
                            8
                          </MenuItem>
                          <MenuItem key={9} value={"9"}>
                            9
                          </MenuItem>
                          <MenuItem key={10} value={"10"}>
                            10
                          </MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="goal"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.goal}
                        name="goal"
                        error={!!touched.goal && !!errors.goal}
                        helperText={touched.goal && errors.goal}
                        sx={{ gridColumn: "span 2" }}
                      />
                    )}

                    <Button
                      fullWidth
                      type="submit"
                      color="secondary"
                      variant="contained"
                      sx={{ gridColumn: "span 1" }}
                    >
                      Set Goal
                    </Button>
                  </form>
                )}
              </Formik>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ gridColumn: "span 5" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">ADD NOTE</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Formik
                onSubmit={handleNoteSubmit}
                initialValues={initialValues}
                validationSchema={userSchema}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                }) => (
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
                      sx={{ gridColumn: "span 5" }}
                    />
                    <Button
                      fullWidth
                      type="submit"
                      color="secondary"
                      variant="contained"
                      sx={{ gridColumn: "span 1" }}
                    >
                      Add Note
                    </Button>
                  </form>
                )}
              </Formik>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">HISTORY</Typography>
            </AccordionSummary>
            <AccordionDetails>{statBoxes}</AccordionDetails>
          </Accordion>
        </Box>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">CORRELATION</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box width="100vw" display="flex">
              <FormControl>
                <InputLabel>Add/Remove Metric</InputLabel>
                <Select
                  label="Metrics"
                  onChange={handleCorrelationChange}
                  value={correlationSelection}
                  sx={{
                    width: "25vw",
                  }}
                >
                  {selectionItems}
                </Select>
              </FormControl>
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                onClick={handleCorrelationSubmit}
                sx={{ gridColumn: "span 1" }}
              >
                Add/Remove
              </Button>
            </Box>
            {correlationResult ? (
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography variant="h5">
                  {` The correlation between ${
                    userData[correlationSelection].id
                  } 
                                       and 
                                        ${chartData[0].id} 
                                       is 
                                        ${correlationResult.correlation.toFixed(
                                          3
                                        )} `}
                  &#40;{correlationResult.relation}&#41;
                </Typography>

                <Box display="flex">
                  <StatBox
                    title={chartData[0].id}
                    stats={chartData[0].data}
                    type={chartData[0].type}
                  />
                  <StatBox
                    title={userData[correlationSelection].id}
                    stats={userData[correlationSelection].data}
                    type={userData[correlationSelection].type}
                  />
                </Box>
              </Box>
            ) : (
              <></>
            )}
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export default ChartPage;
