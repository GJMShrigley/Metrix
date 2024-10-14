import { Box, Typography, useTheme } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import EntryBox from "../components/EntryBox";

import { tokens } from "../theme";

const QuickUpdate = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const inputItems = props.userData.map((data, i) => (
    <Box
      key={`${i}`}
      sx={{
        alignItems: "center",
        backgroundColor: colors.primary[400],
        display: "flex",
        justifyContent: "center",
      }}
    >
      <EntryBox
        id={`${i}`}
        lineColor={`${data.color}`}
        title={`${data.id}`}
        type={`${data.type}`}
      />
    </Box>
  ));

  return (
    <Box
      sx={{
        width: "100vw",
      }}
    >
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            sx={{
              textAlign: "center",
            }}
            variant="h5"
          >
            QUICK UPDATE
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              overflow: "auto",
            }}
          >
            {inputItems}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default QuickUpdate;
