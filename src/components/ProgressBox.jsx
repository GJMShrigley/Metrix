import { Box, Typography, useTheme } from "@mui/material";
import { useRef, useState, useLayoutEffect } from "react";
import { tokens } from "../theme";
import ProgressCircle from "./ProgressCircle";
import Marquee from "react-fast-marquee";

const ProgressBox = ({ title, icon, latest, increase, goal }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const textRef = useRef(undefined);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useLayoutEffect(() => {
    setIsOverflowing(checkOverflow(textRef.current));
  }, [])

  function checkOverflow(textRef) {
    if (textRef === undefined || textRef === null) return false;

    var curOverflow = textRef.style.overflow;

    if (!curOverflow || curOverflow === "visible") textRef.style.overflow = "hidden";
    var isOverflowing =
      textRef.clientWidth < textRef.scrollWidth || textRef.clientHeight < textRef.scrollHeight;

    textRef.style.overflow = curOverflow;

    return isOverflowing;
  }

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
      <Marquee>
        <Box display="flex" justifyContent="space-between" mt="2px" ref={textRef}>

          <Typography
            variant="h5"
            fontStyle="italic"
            sx={{ color: colors.greenAccent[600] }}
            
          >
            {increase}
          </Typography>

        </Box>
      </Marquee>
    </Box>
  );
};

export default ProgressBox;