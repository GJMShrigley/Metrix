import { Box, Button, IconButton, Typography, useTheme, TextField } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import LineChart from "../../components/LineChart";
import StatBox from "../../components/StatBox";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux"
import { addMetric, saveFile, exportFile, importFile } from "../../store/userDataSlice";
import * as yup from "yup";
import * as moment from "moment";
import { MuiFileInput } from 'mui-file-input'
import { useEffect, useState } from "react";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const userData = useSelector((state) => state.userData.metrics);
  const userActivity = useSelector((state) => state.userData.dates);
  const dispatch = useDispatch();
  const [recentActivity, setRecentActivity] = useState([{ x: 0, 0: { y: 0, id: "" } }])

  const currentDate = (new Date()).toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const newMetric = (values) => {
    dispatch(addMetric(values));
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

  const fileLoad = (e) => {
    const file = e;
    const reader = new FileReader();

    if (file.length > 1) {
      alert("Please select a single file to load");
      return;
    }

    reader.addEventListener("load", () => {
      const loadedFile = JSON.parse(reader.result);
      dispatch(importFile(loadedFile))
    }, false);
    reader.readAsText(file);
  }

  const inputItems = userData.map((data, i) =>
    <Box
      gridColumn="span 3"
      backgroundColor={colors.primary[400]}
      display="flex"
      alignItems="center"
      justifyContent="center"
      key={`${data.id}`}
    >
      <StatBox
        title={`${data.id}`}
        key={`${data.id}`}
      />
    </Box>
  )

  const activity = recentActivity.map((date, i) => {
    const entries = Object.entries(date);

    const data = entries.map((metric, i) => {
      return (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%">
          <Typography color={colors.grey[100]}>
            {metric[1].id}
          </Typography>
          <Typography
            color={colors.greenAccent[500]}
            variant="h5"
            fontWeight="600"
          >
            {metric[1].y}
          </Typography>
        </Box>
      )
    });

    return (
      <Box
        key={`${date.x}`}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        borderBottom={`4px solid ${colors.primary[500]}`}
        p="15px"
        width="100%"
      >
        <Typography
          color={colors.greenAccent[500]}
          variant="h5"
          fontWeight="600"
          m="0 30px 0 0"
        >
          {date.x}
        </Typography>
        <Box
          width="100%">
          {data}
        </Box>
      </Box >)
  });

  useEffect(() => {
    let activityCopy = [...userActivity];
    activityCopy.reverse();
    setRecentActivity(activityCopy);
  }, [userActivity])

  return (
    <Box m="15px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        <Box display="flex" flexDirection="column" justifyContent="space-around" alignItems="center" p="5px">
          <MuiFileInput placeholder="Insert a file" onChange={fileLoad} />
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 78px",
            }}
            onClick={() => {
              dispatch(exportFile());
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Export User Data
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}

        {/* ROW 2 */}
        <Box
          gridColumn="span 12"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box height="100%" m="-20px 10px">
            {<LineChart isDashboard={true} />}
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="5px"
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              m="10px"
              sx={{ color: colors.grey[100] }}
            >
              RECENT ACTIVITY
            </Typography>
          </Box>
          {activity}
        </Box>
        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="10px"
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            m="10px"
            sx={{ color: colors.grey[100] }}
          >
            ADD NEW METRIC
          </Typography>
          <Formik
            onSubmit={newMetric}
            initialValues={initialValues}
            validationSchema={userSchema}
          >
            {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Box
                  display="grid">
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
                  <Button type="submit" color="secondary" variant="contained">
                    Track New Metric
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          gridColumn="span 4"
          gridRow="span 2"
          overflow="auto"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            m="10px"
            sx={{ color: colors.grey[100] }}
          >
            UPDATE METRIC
          </Typography>
          {inputItems}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;