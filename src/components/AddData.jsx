import { useState } from "react";

import { Formik } from "formik";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, Typography, useTheme, TextField } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import useMediaQuery from "@mui/material/useMediaQuery";
import { HexColorPicker } from "react-colorful";
import { useDispatch } from "react-redux";
import * as yup from "yup";

import { addMetric, saveFile, addCategory } from "../store/userDataSlice";
import { tokens } from "../theme";

const AddData = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("max-width: 800px");
  const [color, setColor] = useState("#ffff");

  const currentDate = new Date().toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const newMetric = (values) => {
    dispatch(addMetric(values));
    dispatch(saveFile());
  };

  const newCategory = (values) => {
    dispatch(addCategory(values.category));
    dispatch(saveFile());
  };

  const initialValues = {
    metric: "",
    x: `${currentDate}`,
    y: 0,
  };

  const userSchema = yup.object().shape({
    metric: yup.string().required("required"),
    x: yup.date().required("required"),
    y: yup.string().required("required"),
  });

  const categorySchema = yup.object().shape({
    category: yup.string().required("required"),
  });

  return (
    <Box display="grid" alignItems="flex-start" width="100vw">
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5" textAlign="center">
            ADD DATA
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            display="flex"
            flexDirection="column"
            width="100%"
            overflow="hidden"
            p="10px"
          >
            <Box
            backgroundColor={colors.primary[400]}
              p="20px"
              sx={{
                "& > .react-colorful": { width: "99%", margin: "20px 0" },
                ".react-colorful__saturation": { height: "100%" },
                ".react-colorful__hue": { height: "50%" },
                ".react-colorful__hue-pointer, .react-colorful__saturation-pointer":
                  { width: "25px", height: "25px" },
              }}
            >
              <Typography variant="h4" fontWeight="bold" textAlign="center">
                ADD NEW METRIC
              </Typography>
              <Formik
                onSubmit={newMetric}
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
                    <Box display="grid">
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Metric Name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.metric}
                        name="metric"
                        error={!!touched.metric && !!errors.metric}
                        helperText={touched.metric && errors.metric}
                        sx={{ gridColumn: "span 1" }}
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
                        sx={{ gridColumn: "span 1" }}
                      />
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
                        sx={{ gridColumn: "span 1" }}
                      />
                      <Button
                        type="submit"
                        color="secondary"
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
              height="auto"
              m="20px 0 0 0"
              gap="10px"
              p="20px"
              backgroundColor={colors.primary[400]}
            >
              <Typography
                variant="h4"
                fontWeight="bold"
                textAlign="center"
                m="2px"
                sx={{ color: colors.grey[100] }}
              >
                ADD NEW CATEGORY
              </Typography>
              <Formik
                onSubmit={newCategory}
                initialValues={initialValues}
                validationSchema={categorySchema}
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
                    <Box display="grid">
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Category Name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.category}
                        name="category"
                        error={!!touched.category && !!errors.category}
                        helperText={touched.category && errors.category}
                        sx={{ gridColumn: "span 1" }}
                      />
                      <Button
                        type="submit"
                        color="secondary"
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
