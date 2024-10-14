import { Box } from "@mui/material";

import ProgressCircle from "./ProgressCircle";

const ProgressBox = ({ title, icon, latest, goal, goalType }) => {

  return (
    <Box
      sx={{
        display: "flex",
        gap: ".2rem",
        margin: "0 1rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>{icon}</Box>
        <Box>
          <ProgressCircle goal={goal} latest={latest} title={title} goalType={goalType} />
        </Box>
      </Box>
    </Box>
  );
};

export default ProgressBox;
