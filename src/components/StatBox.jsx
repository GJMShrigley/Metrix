import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import ProgressCircle from "./ProgressCircle";

const StatBox = ({ title, stats }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const statsList = stats.map((day, i) => {
    return (
      <Box display="flex" gap="30px" key={i}>
        <Typography
          variant="h4"
          sx={{ color: colors.greenAccent[500] }}
        >
          {day.x}
        </Typography>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: colors.greenAccent[500] }}
        >
          {day.y}
        </Typography>
      </Box>

    )
  })


  return (
    <Box width="auto" height="auto" m="0 30px" p="10px" backgroundColor={colors.primary[400]}>
      <Box display="flex" justifyContent="space-around" alignItems="center">
        <Box display="flex">
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            {title}
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" gap="20px">
          {statsList}
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2px">
        {/* <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: colors.greenAccent[600] }}
        >
          {increase}
        </Typography> */}
      </Box>
    </Box>
  );
};

export default StatBox;