import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Typography, useTheme } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import EntryBox from "../components/EntryBox";

import { tokens } from "../theme";

const QuickUpdate = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const inputItems = props.userData.map((data, i) => (
    <Box
      backgroundColor={colors.primary[400]}
      display="flex"
      alignItems="center"
      justifyContent="center"
      key={`${i}`}
    >
      <EntryBox
        title={`${data.id}`}
        type={`${data.type}`}
        lineColor={`${data.color}`}
      />
    </Box>
  ));

  return (
    <Box width="100vw">
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5" textAlign="center">
            QUICK UPDATE
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" alignItems="center" width="100%" overflow="auto">
            {inputItems}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default QuickUpdate;
