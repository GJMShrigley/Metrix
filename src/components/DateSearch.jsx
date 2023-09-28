import { Formik } from "formik";
import { Box, Button, TextField } from "@mui/material";
import * as moment from "moment";
import { Link } from "react-router-dom";
import * as yup from "yup";

const date = new Date();

const currentDate = moment(date).format("MM/DD/YYYY");

const lastWeek = moment(currentDate).subtract(7, "days").format("MM/DD/YYYY");

const initialValues = {
  startDate: `${lastWeek}`,
  endDate: `${currentDate}`,
};

const userSchema = yup.object().shape({
  startDate: yup.date().required("required"),
  endDate: yup.date(),
});

const DateSearch = () => {
  return (
    <Box
      sx={{
        margin: "0 .5rem",
        minWidth: "5rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      ></Box>
      <Formik initialValues={initialValues} validationSchema={userSchema}>
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
              <Button
                color="secondary"
                component={Link}
                state={{ endDate: values.endDate, startDate: values.startDate }}
                to={`/activity/0`}
                type="submit"
                variant="contained"
              >
                Go To Date
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default DateSearch;
