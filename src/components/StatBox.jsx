import { useEffect, useState } from "react";

import * as moment from "moment";
import { Box, Typography, useTheme } from "@mui/material";
import Marquee from "react-fast-marquee";
import { Link } from "react-router-dom";

import { tokens } from "../theme";

const findRange = function (statsSlice) {
  let max = 0;
  let min = 0;
  for (let i = 0; i < statsSlice.length; i++) {
    if (parseFloat(statsSlice[i].y) > max) {
      max = statsSlice[i].y;
    } else if (parseFloat(statsSlice[i].y) < min) {
      min = parseFloat(statsSlice[i].y);
    }
  }
  return max - min;
};

const StatBox = ({ id, title, stats, startDate, endDate }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [statsSlice, setStatsSlice] = useState([{}]);

  const sum = statsSlice.reduce((acc, obj) => acc + parseInt(obj.y), 0);
  const range = findRange(statsSlice, title);
  const mean = (sum / statsSlice.length).toFixed(2);

  useEffect(() => {
    let statsArray = [];

    if (!endDate) {
      for (let i = 0; i < stats.length; i++) {
        if (stats[i].x === startDate && stats[i].times) {
          for (let j = 0; j < stats[i].times.length; j++) {
            statsArray.push(stats[i].times[j])
          }
        }
      }
    } else {
      for (let i = 0; i < stats.length; i++) {
        if (moment(stats[i].x).isBetween(startDate, endDate, "day", "[]")) {
          statsArray.push(stats[i]);
        }
      }
    }

    setStatsSlice(statsArray);
  }, [stats, endDate, startDate]);

  const statsList = statsSlice.map((day, i) => {
    let previous = i > 0 ? statsSlice[i - 1].y : 0;
    const difference = (day.y - previous).toFixed(2);
    const percent =
      parseInt(day.y) === parseInt(difference)
        ? 0
        : Math.round((difference / previous) * 100);
    const color =
      difference >= 0
        ? { color: colors.blueAccent[300] }
        : { color: colors.redAccent[300] };
    let result = true;

    switch (day.y) {
      case (day.y < day.goal && day.goalType === 'Low'):
        result = true
        break;
      case (day.y > day.goal && day.goalType === 'Low'):
        result = false
        break;
      case (day.y < day.goal && day.goalType === 'High'):
        result = false
        break;
      case (day.y > day.goal && day.goalType === 'High'):
        result = true
        break;
      default:
        result = true
    }

    return (
      <Box
        key={i}
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          justifyContent: "flex-start",
        }}>

        <Box
          key={i}
          sx={{
            alignItems: "center",
            display: "flex",
            gap: "1rem",
            justifyContent: "flex-start",
          }}
        >
          <Typography
            component={endDate ? Link : null}
            sx={{
              color: colors.greenAccent[100],
            }}
            state={{ startDate: day.x }}
            to={`/activity/0`}
            variant="h4"
          >
            {day.x}
          </Typography>
          <Typography
            sx={{
              color: colors.greenAccent[600],
              display: "flex",
              fontWeight: "bold",
              justifyContent: "center",
            }}
            variant="h4"
          >
            {day.y}
          </Typography>
          <Typography
            sx={{
              color,
              display: "flex",
              justifyContent: "center",
            }}
            variant="h5"
          >
            {difference}
          </Typography>
          <Typography
            sx={{
              color,
              display: "flex",
              fontStyle: "italic",
              justifyContent: "center",
            }}
            variant="h5"
          >
            {percent}&#37;
          </Typography>
          {day.goal && day.goal != "" ? <Typography
            sx={{
              color: result === true ? colors.redAccent[300] : colors.blueAccent[300],
              display: "flex",
              fontStyle: "italic",
              justifyContent: "center",
            }}
            variant="h5"
          >
            Goal: {day.goalType === 'Low' ? "Under" : "Over"} {day.goal}
          </Typography> : null}
          <Box>

          </Box>

        </Box>
        <Typography
          component={Marquee}
          speed={30}
          sx={{
            color: colors.greenAccent[100],
            overflowY: "hidden",
          }}
          variant="h4"
        >
          {day.note}
        </Typography>
      </Box>
    );
  });

  return (
    <Box
      sx={{
        backgroundColor: colors.primary[400],
        margin: "0",
        padding: "1rem",
        width: "100%",
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Typography
          component={Link}
          sx={{
            color: colors.grey[100],
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
          to={`/chart/${id}`}
          variant="h3"
        >
          {title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: ".5rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: ".5rem",
            }}
          >
            <Typography
              sx={{
                color: colors.grey[100],
                fontWeight: "bold",
              }}
              variant="h4"
            >
              Mean&#58;
            </Typography>
            <Typography
              sx={{
                color: colors.greenAccent[500],
                fontWeight: "bold",
              }}
              variant="h4"
            >
              {mean === "NaN" ? "N/A" : mean}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: ".5rem",
            }}
          >
            <Typography
              sx={{
                color: colors.grey[100],
                fontWeight: "bold",
              }}
              variant="h4"
            >
              Range&#58;
            </Typography>
            <Typography
              sx={{
                color: colors.greenAccent[500],
                fontWeight: "bold",
              }}
              variant="h4"
            >
              {range > 0 ? "+" : ""}
              {range}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            margin: "1rem 0",
          }}
        >
          {statsList}
        </Box>
      </Box>
    </Box>
  );
};

export default StatBox;
