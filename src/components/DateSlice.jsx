import { Formik } from "formik";
import { Box, Button, TextField } from "@mui/material";
import * as moment from "moment";
import * as yup from "yup";

const DateSlice = (props) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const lastWeek = moment(currentDate).subtract(6, "days").format("MM/DD/YYYY");

  const initialValues = {
    startDate: `${lastWeek}`,
    endDate: `${currentDate}`,
  };

  const userSchema = yup.object().shape({
    startDate: yup.date().required("required"),
    endDate: yup.date(),
  });

  const handleFormSubmit = (values) => {
    props.sliceDate(values.startDate, values.endDate);
    if (props.changeDate) {
      props.changeDate(values.startDate, values.endDate);
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        flexDirection="column"
        gap="0"
        justifyContent="center"
        overflow="hidden"
      ></Box>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
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
              }}
            >
              <Box
                sx={{
                  columnGap: ".2rem",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <TextField
                  error={!!touched.startDate && !!errors.startDate}
                  fullWidth
                  helperText={touched.startDate && errors.startDate}
                  label="Start Date"
                  name="startDate"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.startDate}
                  variant="filled"
                />
                <TextField
                  error={!!touched.endDate && !!errors.endDate}
                  fullWidth
                  helperText={touched.endDate && errors.endDate}
                  label="End Date"
                  name="endDate"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.endDate}
                  variant="filled"
                />
              </Box>
              <Button color="secondary" type="submit" variant="contained">
                Go To Date
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default DateSlice;
