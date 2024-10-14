import { useState } from "react";

import { Formik } from "formik";
import { Box, Button, TextField } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as moment from "moment";
import { Link } from "react-router-dom";
import * as yup from "yup";

const date = new Date();

const currentDate = moment.utc(date);

const lastWeek = moment.utc(currentDate).subtract(6, "days")

const DateSearch = () => {
  const [startDate, setStartDate] = useState(lastWeek);
  const [endDate, setEndDate] = useState(currentDate);

  return (

    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%"
        }}
      >
        <DatePicker label="Start Date"
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)} />
        <DatePicker label="End Date"
          value={endDate}
          onChange={(newValue) => setEndDate(newValue)} />
      </Box>

      <Button
        component={Link}
        color="secondary"
        fullWidth
        state={{ startDate: startDate.format("MM/DD/YYYY"), endDate: endDate.format("MM/DD/YYYY") }}
        to={`activity/0`}
        variant="contained"
      >
        Go To Date
      </Button>
    </Box >
  );
};

export default DateSearch;
