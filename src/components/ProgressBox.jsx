import { Box, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { tokens } from "../theme";
import ProgressCircle from "./ProgressCircle";

const ProgressBox = ({ title, subtitle, icon, latest, increase, goal }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


  return (
    <Box m="0 30px" display="flex" gap="5px">
      <Box display="flex" justifyContent="space-between">
        <Box>
          {icon}
        </Box>
        <Box>
          <ProgressCircle latest={latest} goal={goal} title={title} />
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: colors.greenAccent[600] }}
        >
          {increase}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProgressBox;