import { useState } from "react";

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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { HexColorPicker } from "react-colorful";
import { useDispatch } from "react-redux";
import * as yup from "yup";

import { addCategory, addMetric } from "../store/userDataSlice";
import { tokens } from "../theme";

const date = new Date();

const currentDate = moment(date).format("MM/DD/YYYY");

const initialValues = {
  metric: "",
  x: `${currentDate}`,
  y: 0,
  category: ""
};

const categorySchema = yup.object().shape({
  category: yup.string().required("required"),
});

const metricSchema = yup.object().shape({
  metric: yup.string().required("required"),
  x: yup.date().required("required"),
  y: yup.number().required("required"),
});

const AddData = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const [color, setColor] = useState("#ffff");
  const [totalSelection, setTotalSelection] = useState("Average");
  const [typeSelection, setTypeSelection] = useState("Scale");
  const [dateLog, setDateLog] = useState(currentDate);

  const newCategory = async (values) => {
    dispatch(addCategory(values.category));
  };

  const newMetric = (values) => {
    dispatch(addMetric({ values, color, typeSelection, totalSelection }));
  };

  const handleTypeChange = (value) => {
    setTypeSelection(value.target.value);
  };

  const handleTotalChange = (value) => {
    setTotalSelection(value.target.value);
  };

  const radioButtons = Array.from({ length: 11 }, (_, i) => {
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
        label={`${i}`}
        value={`${i}`}
      />
    );
  });

  return (
    <Box
      sx={{
        alignItems: "flex-start",
        display: "grid",
        width: "100vw",
      }}
    >
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            sx={{
              textAlign: "center",
            }}
            variant="h5"
          >
            ADD DATA
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              padding: ".5rem",
              width: "100%",
            }}
          >
            <Box
              sx={{
                backgroundColor: colors.primary[400],
                padding: "1rem",
                width: "100%"
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                }}
                variant="h4"
              >
                ADD NEW METRIC
              </Typography>
              <DateTimePicker ampm={false} label="Date Logged"
                onChange={(newValue) => (setDateLog(newValue))}
                sx={{ width: "100%" }}
                type="text"
              />
              <Formik
                initialValues={initialValues}
                onSubmit={newMetric}
                validationSchema={metricSchema}
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
                        gap: ".5rem"
                      }}
                    >
                      <TextField
                        error={!!touched.metric && !!errors.metric}
                        fullWidth
                        helperText={touched.metric && errors.metric}
                        label="Metric Name"
                        name="metric"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.metric}
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
                      <Box
                        sx={{
                          backgroundColor: colors.primary[400],
                          padding: "1rem",
                          "& > .react-colorful": { margin: "1rem 0", width: "100%" },
                          ".react-colorful__saturation": { height: "100%" },
                          ".react-colorful__hue": { height: "50%" },
                          ".react-colorful__hue-pointer, .react-colorful__saturation-pointer":
                            { height: "1rem", width: "1rem" },
                        }}
                      >
                        <HexColorPicker color={color} onChange={setColor} />
                      </Box>
                      <Button
                        color="secondary"
                        type="submit"
                        variant="contained"
                      >
                        Track New Metric
                      </Button>
                    </Box>
                  </form>
                )}
              </Formik>
            </Box>
            <Box
              sx={{
                backgroundColor: colors.primary[400],
                padding: "1rem",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                }}
                variant="h4"
              >
                ADD NEW CATEGORY
              </Typography>
              <Formik
                initialValues={initialValues}
                onSubmit={newCategory}
                validationSchema={categorySchema}
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
                        gap: ".5rem"
                      }}
                    >
                      <TextField
                        error={!!touched.category && !!errors.category}
                        fullWidth
                        helperText={touched.category && errors.category}
                        label="Category Name"
                        name="category"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.category}
                        variant="filled"
                      />
                      <Button
                        color="secondary"
                        type="submit"
                        variant="contained"
                      >
                        Track New Category
                      </Button>
                    </Box>
                  </form>
                )}
              </Formik>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default AddData;
