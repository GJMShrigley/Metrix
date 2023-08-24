import { Box, Button, Typography, useTheme, TextField } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import LineChart from "../../components/LineChart";
import EntryBox from "../../components/EntryBox";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux"
import { addDate, addMetric, saveFile, exportFile, importFile, addCategory } from "../../store/userDataSlice";
import * as yup from "yup";
import * as moment from "moment";
import { MuiFileInput } from 'mui-file-input'
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Link } from "react-router-dom";
import DateSearch from "../../components/DateSearch";
import BiaxialChart from "../../components/BiaxialChart";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const userData = useSelector((state) => state.userData.metrics);
  const userCategories = useSelector((state) => state.userData.categories)
  const userActivity = useSelector((state) => state.userData.dates);
  const dispatch = useDispatch();
  const [recentActivity, setRecentActivity] = useState([{ x: 0, 0: { y: 0, id: "" } }])
  const [color, setColor] = useState("#ffff");
  const [selectedCategory, setSelectedCategory] = useState(userCategories[0]);
  const [chartData, setChartData] = useState({
    categoryId: "",
    contents: [{
      "id": "",
      "color": "#ffff",
      "data": [
        {
          "x": "07/20/2023",
          "y": "0"
        }
      ],
      "type": "Scale"
    }]
  });
  const [data1, setData1] = useState([])
  const [data2, setData2] = useState([])

  const currentDate = (new Date()).toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
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
    category: yup.string().required("required")
  })

  const inputItems = userData.map((data, i) =>
    <Box
      backgroundColor={colors.primary[400]}
      display="flex"
      alignItems="center"
      justifyContent="center"
      key={`${data.id}`}
    >
      <EntryBox
        title={`${data.id}`}
        type={`${data.type}`}
        lineColor={`${data.color}`}
      />
    </Box>
  )

  const activity = recentActivity.map((date, i) => {
    const entries = Object.entries(date);
    return (
      <Link
        to={`/activity/${i}`}
        style={{ textDecoration: 'none' }}
        state={{ startDate: date.x }}
        key={`${i}`}
      >
        <Box
          key={`${date.x}`}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderBottom={`4px solid ${colors.primary[500]}`}
          p="15px"
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

          >
            {entries.map((metric, i) => {
              if (metric[1].y > 0) {
                return (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    key={`${i}`}
                  >
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
              }
            })}
          </Box>
        </Box >
      </Link >
    )
  });

  useEffect(() => {
    let activityCopy = [...userActivity];
    activityCopy.reverse();
    setRecentActivity(activityCopy);
  }, [userActivity])

  useEffect(() => {
    for (let i = 0; i < userCategories.length; i++) {
      if (userCategories[i].categoryId === "Dashboard") {
        setSelectedCategory(userCategories[i])
      }
    }
  })

  useEffect(() => {
    let metricsData = []
    for (let i = 0; i < selectedCategory.contents.length; i++) {
      const metricsMatch = userData.find(data => data.id === selectedCategory.contents[i]);
      metricsData.push(metricsMatch);
    }
    const categoryData = Object.assign({}, { categoryId: selectedCategory.categoryId, contents: metricsData })
    setChartData(categoryData)

  }, [selectedCategory])

  useEffect(() => {
    let tempData1 = [];
    let tempData2 = [];
    for (let i = 0; i < chartData.contents.length; i++) {
      if (chartData.contents[i].type === chartData.contents[0].type) {
        tempData1.push(chartData.contents[i]);
      } else {
        tempData2.push(chartData.contents[i]);
      }
    }
    if (tempData2.length) {
      setData1(tempData1)
      setData2(tempData1.concat(tempData2));
    } else {
      setData1([])
      setData2([])
    }
  }, [chartData, userCategories, selectedCategory]);

  dispatch(addDate())

  return (
    <Box m="15px">
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gap="10px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 12"
          backgroundColor={colors.primary[400]}
        >
          <Box m="10px 10px">
            {data2.length > 0 ? <BiaxialChart dataType="Dashboard" data1={data1} data2={data2} /> : <LineChart dataType="category" chartData={chartData.contents} />}
          </Box>
        </Box>
        {/* ROW 2 */}
        <Box gridColumn="span 12">
          <Accordion disableGutters >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                variant="h5"
                textAlign="center">
                QUICK UPDATE
              </Typography>
            </AccordionSummary>
            <AccordionDetails >
              <Box
                display="flex"
                alignItems="center"
                width="auto"
                overflow="auto">
                {inputItems}
              </Box>
            </AccordionDetails>
          </Accordion>
          </Box>
        {/* ROW 2 */}
        <Box
          display="grid"
          gridColumn="span 12"
          gridTemplateColumns="repeat(2,1fr)"
          alignItems="flex-start"
          overflow="auto"
          backgroundColor={colors.primary[400]}
        >
          <Accordion disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography 
              variant="h5"
              textAlign="center">
                ADD DATA
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                height="90vh">
                <Box
                  display="flex"
                  flexDirection="column"
                  overflow="auto"
                  backgroundColor={colors.primary[400]}
                  p="10px"
                >
                  <Box
                    p="2px"
                    sx={{
                      "& > .react-colorful": { width: "99%", margin: "20px 0" },
                      ".react-colorful__saturation": { height: "100%" },
                      ".react-colorful__hue": { height: "100%" },
                      ".react-colorful__hue-pointer, .react-colorful__saturation-pointer": { width: "25px", height: "25px" }
                    }}>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      textAlign="center"
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
                    <HexColorPicker color={color} onChange={setColor} />
                  </Box>
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  overflow="auto"
                  backgroundColor={colors.primary[400]}
                  p="10px"
                >
                  <Box height="auto" gap="10px">
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
                      {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                          <Box
                            display="grid">
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
                            <Button type="submit" color="secondary" variant="contained">
                              Track New Category
                            </Button>
                          </Box>
                        </form>
                      )}
                    </Formik>
                  </Box>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
          <Accordion disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">
                RECENT ACTIVITY
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                height="90vh"
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
                    m="5px 0 0 0"
                    sx={{ color: colors.grey[100] }}
                  >
                    RECENT ACTIVITY
                  </Typography>
                </Box>
                <DateSearch />
                {activity}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;