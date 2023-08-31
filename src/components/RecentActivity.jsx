import { useEffect, useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import * as moment from "moment";
import { Box, Typography, useTheme } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { Link } from "react-router-dom";

import DateSearch from "../components/DateSearch";

import { tokens } from "../theme";

const RecentActivity = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const userData = props.userData;
  const date = new Date();
  const currentDate = moment(date).format("MM/DD/YYYY");
  const [recentActivity, setRecentActivity] = useState([
    {
      x: 0,
      0: {
        y: 0,
        id: "",
      },
    },
  ]);

  useEffect(() => {
    const dataCopy = [...userData];
    const startDate = moment(currentDate)
      .subtract(6, "days")
      .format("MM/DD/YYYY");
    let activityDate = startDate;
    let activityData = [];
    let activityObj = {};
    let dates = [];

    function combineDates() {
      for (let i = 0; i < dataCopy.length; i++) {
        const metricCopy = [dataCopy[i].data];
        metricCopy[0].filter((obj) => {
          if (obj.x === activityDate) {
            const newObj = {
              y: obj.y,
              id: dataCopy[i].id,
            };
            activityData.push(newObj);
          }
        });
      }
      activityObj = { x: activityDate, ...activityData };
      dates.push(activityObj);
      activityData = [];
    }

    while (dates.length < 7) {
      combineDates();
      activityDate = moment(activityDate).add(1, "days").format("MM/DD/YYYY");
    }
    dates.reverse();
    setRecentActivity(dates);
  }, [userData]);

  const activity = recentActivity.map((date, i) => {
    const entries = Object.entries(date);

    return (
      <Link
        to={`/activity/${i}`}
        style={{ textDecoration: "none" }}
        state={{ startDate: date.x }}
        key={i}
      >
        <Box
          key={date.x}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          alignItems="center"
          borderBottom={`4px solid ${colors.primary[500]}`}
          p="15px"
        >
          <Typography
            color={colors.greenAccent[500]}
            variant="h3"
            fontWeight="900"
            m="0 0 20px 0"
          >
            {date.x}
          </Typography>
          <Box width="100%" p="20px">
            {entries.map((metric, i) => {
              if (metric[1].y > 0) {
                return (
                  <Box display="flex" justifyContent="space-between" key={i}>
                    <Typography
                      color={colors.grey[100]}
                      variant="h4"
                      fontWeight="700"
                    >
                      {metric[1].id}
                    </Typography>
                    <Typography
                      color={colors.greenAccent[500]}
                      variant="h4"
                      fontWeight="700"
                    >
                      {metric[1].y}
                    </Typography>
                  </Box>
                );
              }
            })}
          </Box>
        </Box>
      </Link>
    );
  });

  return (
    <Box
      display="grid"
      gridColumn="span 12"
      alignItems="flex-start"
      overflow="auto"
      backgroundColor={colors.primary[400]}
    >
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">RECENT ACTIVITY</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            height="auto"
            backgroundColor={colors.primary[400]}
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
  );
};

export default RecentActivity;
