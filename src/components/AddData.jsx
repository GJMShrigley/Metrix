import { useState } from "react";

import { Formik } from "formik";
import * as moment from "moment";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { HexColorPicker } from "react-colorful";
import { useDispatch } from "react-redux";
import * as yup from "yup";

import { addCategory, addMetric, saveFile } from "../store/userDataSlice";
import { tokens } from "../theme";

const date = new Date();

const currentDate = moment(date).format("MM/DD/YYYY");

const initialValues = {
  metric: "",
  x: `${currentDate}`,
  y: 0,
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
  const [typeSelection, setTypeSelection] = useState("Scale");

  const newCategory = (values) => {
    dispatch(addCategory(values.category));
    dispatch(saveFile());
  };

  const newMetric = (values) => {
    dispatch(addMetric({values, color, typeSelection}));
    dispatch(saveFile());
  };

  const handleTypeChange = (value) => {
    setTypeSelection(value.target.value);
  };

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
                "& > .react-colorful": { margin: "1rem 0", width: "99%" },
                ".react-colorful__saturation": { height: "100%" },
                ".react-colorful__hue": { height: "50%" },
                ".react-colorful__hue-pointer, .react-colorful__saturation-pointer":
                  { height: "1rem", width: "1rem" },
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
                        sx={{
                          gridColumn: "span 1",
                        }}
                      />
                      <TextField
                        error={!!touched.y && !!errors.y}
                        fullWidth
                        helperText={touched.y && errors.y}
                        label="value"
                        name="y"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.y}
                        variant="filled"
                      />
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
                        type="submit"
                        variant="contained"
                      >
                        Track New Metric
                      </Button>
                    </Box>
                  </form>
                )}
              </Formik>
              <HexColorPicker color={color} onChange={setColor} />
            </Box>
            <Box
              sx={{
                backgroundColor: colors.primary[400],
                gap: ".5rem",
                height: "auto",
                margin: "1rem 0 0 0",
                padding: "1rem",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: colors.grey[100],
                  fontWeight: "bold",
                  m: ".2rem",
                  textAlign: "center",
                }}
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
                        display: "grid",
                      }}
                    >
                      <TextField
                        error={!!touched.category && !!errors.category}
                        fullWidth
                        helperText={touched.category && errors.category}
                        label="Category Name"
                        name="metric"
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
