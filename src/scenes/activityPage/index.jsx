import { useEffect, useState } from "react";

import { Formik } from "formik";
import { Box, Button, TextField, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import * as moment from "moment";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import BiaxialChart from "../../components/BiaxialChart";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import StatBox from "../../components/StatBox";

import { addJournal, saveFile } from "../../store/userDataSlice";

const ActivityPage = () => {
  const dispatch = useDispatch();
  const location = useLocation().state;
  const categoryArray = useSelector((state) => state.userData.categories);
  const journalArray = useSelector((state) => state.userData.journal);
  const metricsArray = useSelector((state) => state.userData.metrics);

  const [chartData, setChartData] = useState([
    {
      id: "",
      color: "",
      data: [
        {
          x: "",
          y: "",
          goal: "",
        },
      ],
      type: "",
      goal: "",
    },
  ]);
  const [startDate, setStartDate] = useState(location.startDate);
  const [endDate, setEndDate] = useState(location.endDate);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [pageTitle, setPageTitle] = useState(startDate);
  const [textData, setTextData] = useState("");

  const userSchema = yup.object().shape({
    journal: yup.string(),
  });

  const initialValues = {
    journal: `${textData}`,
  };

  //Set the start and end dates when provided by page selection.
  useEffect(() => {
    setStartDate(location.startDate);
    setEndDate(location.endDate);
  }, [location]);

  //Set the page title and chart data.
  useEffect(() => {
    setChartData(metricsArray);
    //If no end date given, set title to the start date.
    if (!endDate) {
      setPageTitle(startDate);
      //If an end date is given, set the title to the period between the start and end dates.
    } else {
      setPageTitle(startDate + " - " + endDate);
    }
  }, [metricsArray, endDate, startDate]);

  //Split the chart data into 'number' or 'scale' data types. If both types exist, push them to separate state arrays.
  useEffect(() => {
    let tempData1 = [];
    let tempData2 = [];

    for (let i = 0; i < chartData.length; i++) {
      if (chartData[i].type === chartData[0].type) {
        tempData1.push(chartData[i]);
      } else {
        tempData2.push(chartData[i]);
      }
    }

    if (tempData2.length) {
      setData1(tempData1);
      setData2(tempData1.concat(tempData2));
    } else {
      setData1([]);
      setData2([]);
    }
  }, [chartData, categoryArray, location]);

  useEffect(() => {
    //If no end date given, set the journal text for the given start date.
    for (let i = 0; i < journalArray.length; i++) {
      if (journalArray[i].x === startDate) {
        journalArray[i].journal != undefined
          ? setTextData(journalArray[i].journal)
          : setTextData("");
      }
    }
  }, [journalArray, initialValues, endDate]);

  const changeDate = (newStartDate, newEndDate) => {
    if (newStartDate === newEndDate) {
      setStartDate(newStartDate);
      setEndDate(null);
    } else {
      setStartDate(newStartDate);
      setEndDate(newEndDate);
    }
  };

  //When a journal is submitted, record it in global state with the 'x' value as the given start date.
  const handleJournalSubmit = (value) => {
    dispatch(addJournal({ journal: value.journal, x: startDate }));
    dispatch(saveFile());
  };

  const statBoxes = chartData.map((data, i) => {
    return (
      <StatBox
        endDate={endDate}
        key={i}
        startDate={startDate}
        stats={data.data}
        title={data.id}
      />
    );
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          color="secondary"
          component={Link}
          state={{
            startDate: moment(startDate)
              .subtract(1, "days")
              .format("MM/DD/YYYY"),
          }}
          sx={{
            height: "2rem",
            width: "5rem",
          }}
          to={`/activity/0`}
          type="submit"
          variant="contained"
        >
          Previous
        </Button>
        <Header isDate={true} title={pageTitle} />
        <Button
          color="secondary"
          component={Link}
          state={{
            startDate: moment(startDate).add(1, "days").format("MM/DD/YYYY"),
          }}
          sx={{
            height: "2rem",
            width: "5rem",
          }}
          to={`/activity/0`}
          type="submit"
          variant="contained"
        >
          Next
        </Button>
      </Box>
      <Box
        sx={{
          gridColumn: "span 12",
          height: "65vh",
        }}
      >
        {data2.length > 0 ? (
          <BiaxialChart
            changeDate={changeDate}
            dataType="date"
            data1={data1}
            data2={data2}
            endDate={endDate}
            startDate={startDate}
          />
        ) : (
          <LineChart
            changeDate={changeDate}
            chartData={chartData}
            dataType="date"
            endDate={endDate}
            startDate={startDate}
          />
        )}
      </Box>
      {!endDate ? (
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">ADD JOURNAL ENTRY</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Formik
              enableReinitialize
              initialValues={initialValues}
              onSubmit={handleJournalSubmit}
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
                  <TextField
                    error={!!touched.journal && !!errors.journal}
                    fullWidth
                    helperText={touched.journal && errors.journal}
                    label=""
                    multiline
                    name="journal"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    variant="filled"
                    sx={{
                      "& .MuiInputBase-root": {
                        fontSize: "1rem",
                        height: "65vh",
                      },
                    }}
                    type="text"
                    value={values.journal}
                  />
                  <Button
                    color="secondary"
                    fullWidth
                    type="submit"
                    variant="contained"
                  >
                    Add Journal
                  </Button>
                </form>
              )}
            </Formik>
          </AccordionDetails>
        </Accordion>
      ) : null}
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">VIEW STATS</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: "grid",
              gap: "1rem",
              justifyItems: "center",
            }}
          >
            {statBoxes}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ActivityPage;
