import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../theme";
import Marquee from "react-fast-marquee";
import { useRef, useState, useLayoutEffect } from "react";

const ProgressCircle = ({ goal, latest }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const progress = 360 / goal;
  const angle = progress * latest;
  const textRef = useRef(undefined);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useLayoutEffect(() => {
    setIsOverflowing(checkOverflow(textRef.current));
  }, [goal, latest])

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
    <Box>
      <Box
        sx={{
          background: `radial-gradient(${colors.primary[400]} 55%, transparent 56%),
            conic-gradient(transparent 0deg ${angle}deg, ${colors.blueAccent[500]} ${angle}deg 360deg),
            ${colors.greenAccent[500]}`,
          borderRadius: "50%",
          width: "80px",
          height: "80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
          justifyItems: "center",
          overflow: "hidden",
          position: "relative",
          top: "-10px"
        }}
      >
        <Box
          ref={textRef}
          overflow="hidden"
          sx={{
            width: "50px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            alignContent: "center",
            justifyItems: "center",
          }}>
          <Typography component={isOverflowing ? Marquee : Box} speed={30} variant="h2" sx={{ width: "auto", height: "45px" }}>
            {isOverflowing && <Box width="10px"></Box>}{`${latest}/${goal}`}
          </Typography>
        </Box>
      </Box>

    </Box>
  );
};

export default ProgressCircle;