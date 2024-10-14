import { useState } from "react";

import { Box, Button } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import * as moment from "moment";

const date = new Date();

const currentDate = moment(date);

const lastWeek = moment(currentDate).subtract(6, "days");

const DateSlice = (props) => {
  const isLandscape = useMediaQuery("(orientation: landscape)");
  const [startDate, setStartDate] = useState(lastWeek);
  const [endDate, setEndDate] = useState(currentDate);
  const handleSubmit = () => {
    props.sliceDate(moment.utc(startDate).format("MM/DD/YYYY"), moment.utc(endDate).format("MM/DD/YYYY"));
    if (props.handleDate) {
      props.handleDate(moment.utc(startDate).format("MM/DD/YYYY"), moment.utc(endDate).format("MM/DD/YYYY"));
    }
  };

  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        width: "95%"
      }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "1rem",
          justifyContent: "space-between",
          width: isLandscape ? "75%" : "95%"
        }}
      >
        <DatePicker label="Start Date"
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)} />
        <DatePicker label="End Date"
          value={endDate}
          onChange={(newValue) => setEndDate(newValue)} />
      </Box>
      <Button color="secondary" onClick={() => {
        handleSubmit({ startDate: startDate, endDate: endDate });
      }} sx={{ width: isLandscape ? "75%" : "100%" }} type="submit" variant="contained">
        Go To Date
      </Button>
    </Box >
  );
};

export default DateSlice;
