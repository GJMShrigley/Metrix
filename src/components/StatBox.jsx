import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import ProgressCircle from "./ProgressCircle";
import { isInteger } from "formik";

const StatBox = ({ title, stats, type }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const statsList = stats.map((day, i) => {
    let previous = i > 0 ? stats[i - 1].y : 0;
    const difference = (day.y - previous).toFixed(2);
    const percent = parseInt(day.y) === parseInt(difference) ? 0 : Math.round((difference / previous) * 100);

    return (
      <Box display="flex" gap="30px" key={i} justifyContent="space-around" alignItems="center">
        <Typography
          variant="h4"
          sx={{ color: colors.greenAccent[100] }}
        >
          {day.x}
        </Typography>
        <Typography
          variant="h4"
          display="flex"
          justifyContent="center"
          fontWeight="bold"
          sx={{ color: colors.greenAccent[600] }}
        >
          {day.y}
        </Typography>
        <Typography
          variant="h5"
          display="flex"
          justifyContent="center"
          sx={difference >= 0 ? { color: colors.blueAccent[300] } : { color: colors.redAccent[300] }}
        >
          {difference}
        </Typography>
        <Typography
          variant="h5"
          width="33%"
          display="flex"
          justifyContent="center"
          fontStyle="italic"
          sx={percent >= 0 ? { color: colors.blueAccent[500] } : { color: colors.redAccent[500] }}
        >
          {percent}&#37;
        </Typography>
      </Box>

    )
  })
  const sum = stats.reduce(function (acc, obj) { return acc + parseInt(obj.y); }, 0);
  const movement = (parseInt(stats[stats.length - 1].y) - parseInt(stats[0].y));
  const mean = (sum / stats.length).toFixed(2);
  return (
    <Box width="70%" m="0px" p="10px 50px" backgroundColor={colors.primary[400]}>
      <Box display="flex" flexDirection="column" justifyContent="space-between" alignItems="center">
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: colors.grey[100] }}
        >
          {title}
        </Typography>
        <Box display="flex" flexDirection="row" gap="20px">
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: colors.grey[100] }}
        >
          AVERAGE &#40;MEAN&#41;&#58;
        </Typography>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: colors.greenAccent[500] }}
        >
          {mean}
        </Typography>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: colors.grey[100] }}
        >
          MOVEMENT&#58;
        </Typography>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: colors.greenAccent[500] }}
        >
          {movement > 0 ? "+" : ""}{movement}
        </Typography>
        </Box>
        <Box display="flex" flexDirection="column" gap="20px">
          {statsList}
        </Box>
      </Box>
    </Box>
  );
};

export default StatBox;