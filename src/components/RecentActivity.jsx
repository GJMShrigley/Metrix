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

const date = new Date();

const currentDate = moment(date).format("MM/DD/YYYY");

const RecentActivity = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const userData = props.userData;
  const [recentActivity, setRecentActivity] = useState([
    {
      x: 0,
      0: {
        y: 0,
        id: "",
      },
    },
  ]);

  //Get the last 7 days of data from each metric and collect them into the 'recentActivity' state. 
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
      <Box
        component={Link}
        key={i}
        to={`/activity/${i}`}
        state={{ startDate: date.x }}
        sx={{
          alignItems: "center",
          borderBottom: `4px solid ${colors.primary[500]}`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "1rem",
          textDecoration: "none",
        }}
      >
        <Typography
          sx={{
            color: colors.greenAccent[500],
            fontWeight: "900",
            margin: "0 0 1rem 0",
          }}
          variant="h3"
        >
          {date.x}
        </Typography>
        <Box
          sx={{
            padding: "1rem",
            width: "100%",
          }}
        >
          {entries.map((metric, i) => {
            if (metric[1].y > 0) {
              return (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      color: colors.grey[100],
                      fontWeight: "700",
                    }}
                    variant="h4"
                  >
                    {metric[1].id}
                  </Typography>
                  <Typography
                    sx={{
                      color: colors.greenAccent[500],
                      fontWeight: "700",
                    }}
                    variant="h4"
                  >
                    {metric[1].y}
                  </Typography>
                </Box>
              );
            }
          })}
        </Box>
      </Box>
    );
  });

  return (
    <Box
      sx={{
        alignItems: "flex-start",
        backgroundColor: colors.primary[400],
        display: "grid",
        overflow: "auto",
        width: "100vw",
      }}
    >
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">RECENT ACTIVITY</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              backgroundColor: colors.primary[400],
              height: "auto",
            }}
          >
            <Box
              sx={{
                alignItems: "center",
                borderBottom: `4px solid ${colors.primary[500]}`,
                colors: colors.grey[100],
                display: "flex",
                justifyContent: "center",
                padding: ".2rem",
              }}
            >
              <Typography
                sx={{
                  color: colors.grey[100],
                  fontWeight: "bold",
                  m: ".2rem 0 0 0",
                }}
                variant="h4"
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
