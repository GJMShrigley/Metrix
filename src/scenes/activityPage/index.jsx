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

const userSchema = yup.object().shape({
  journal: yup.string(),
});

const ActivityPage = () => {
  const dispatch = useDispatch();
  const location = useLocation().state;
  const startDate = location.startDate;
  const endDate = location.endDate;
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
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [pageTitle, setPageTitle] = useState(startDate);
  const [textData, setTextData] = useState("");

  //Set the page title and chart data.
  useEffect(() => {
    //If no end date given, set chart data to one day prior and one day after start date. Set title to the start date.
    if (!endDate) {
      let dateArray = [];
      metricsArray.map((metric, i) => {
        for (let i = 0; i < metric.data.length; i++) {
          if (metric.data[i].x === startDate) {
            let tempArray = [];
            tempArray.push(metric.data.slice(i - 1, i + 2));
            const temp = tempArray.reduce((temp, data) => ({
              ...metricsArray,
              data: temp,
            }));
            dateArray.push({ ...metric, data: [...temp] });
          }
        }
      });
      setChartData(dateArray);
      setPageTitle(startDate);

      //If an end date is given, set the chart data and title to the period between the start and end dates.
    } else {
      let newChartData = [];
      metricsArray.map((metric, i) => {
        let newMetricData = [];
        for (let i = 0; i < metric.data.length; i++) {
          if (
            moment(metric.data[i].x).isSameOrAfter(startDate, "day") &&
            moment(metric.data[i].x).isSameOrBefore(endDate, "day")
          ) {
            newMetricData.push(metric.data[i]);
          }
        }
        newChartData.push({ ...metric, data: newMetricData });
      });
      setPageTitle(startDate + " - " + endDate);
      setChartData(newChartData);
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

  //When a journal is submitted, record it in global state with the 'x' value as the given start date.
  const handleJournalSubmit = (value) => {
    dispatch(addJournal({ x: startDate, journal: value.journal }));
    dispatch(saveFile());
  };

  const statBoxes = chartData.map((data, i) => {
    return (
      <StatBox key={i} stats={data.data} title={data.id} type={data.type} />
    );
  });

  const initialValues = {
    journal: `${textData}`,
  };

  useEffect(() => {
    //If no end date given, set the journal text for the given start date.
    for (let i = 0; i < journalArray.length; i++) {
      if (journalArray[i].x === startDate) {
        journalArray[i].journal != undefined ? setTextData(journalArray[i].journal) : setTextData("");
      }
    }
  }, [journalArray, initialValues, endDate]);

  return (
    <Box display="flex" flexDirection="column" gap="1rem">
      <Box alignItems="center" display="flex" justifyContent="center">
        <Button
          component={Link}
          to={`/activity/0`}
          state={{
            startDate: moment(startDate)
              .subtract(1, "days")
              .format("MM/DD/YYYY"),
          }}
          type="submit"
          color="secondary"
          variant="contained"
          sx={{ height: "5vh" }}
        >
          Previous
        </Button>
        <Header title={pageTitle} isDate={true} />
        <Button
          component={Link}
          to={`/activity/0`}
          state={{
            startDate: moment(startDate).add(1, "days").format("MM/DD/YYYY"),
          }}
          type="submit"
          color="secondary"
          variant="contained"
          sx={{ height: "5vh" }}
        >
          Next
        </Button>
      </Box>

      <Box gridColumn="span 12" height="65vh">
        {data2.length > 0 ? (
          <BiaxialChart
            dataType="date"
            startDate={startDate}
            endDate={endDate}
            data1={data1}
            data2={data2}
          />
        ) : (
          <LineChart
            dataType="date"
            startDate={startDate}
            endDate={endDate}
            chartData={chartData}
          />
        )}
      </Box>
      {!endDate ? (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">ADD JOURNAL ENTRY</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Formik
              onSubmit={handleJournalSubmit}
              initialValues={initialValues}
              validationSchema={userSchema}
              enableReinitialize
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
                    value={values.journal}
                    name="journal"
                    error={!!touched.journal && !!errors.journal}
                    helperText={touched.journal && errors.journal}
                    multiline
                    sx={{
                      "& .MuiInputBase-root": {
                        height: "65vh",
                        fontSize: "1rem",
                      },
                    }}
                  />
                  <Button
                    fullWidth
                    type="submit"
                    color="secondary"
                    variant="contained"
                  >
                    Add Journal
                  </Button>
                </form>
              )}
            </Formik>
          </AccordionDetails>
        </Accordion>
      ) : (
        <></>
      )}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">VIEW STATS</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="grid" gap="1rem" justifyItems="center">
            {statBoxes}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ActivityPage;
