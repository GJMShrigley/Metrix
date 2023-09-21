import { useLayoutEffect, useRef, useState } from "react";

import { Box, Typography, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Marquee from "react-fast-marquee";

import { tokens } from "../theme";

const ProgressCircle = ({ goal, latest }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isLandscape = useMediaQuery("(orientation: landscape)");
  const progress = 360 / goal;
  const angle = progress * latest;
  const textRef = useRef(undefined);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useLayoutEffect(() => {
    setIsOverflowing(checkOverflow(textRef.current));
  }, [goal, latest]);

  function checkOverflow(textRef) {
    if (textRef === undefined || textRef === null) return false;

    var curOverflow = textRef.style.overflow;

    if (!curOverflow || curOverflow === "visible")
      textRef.style.overflow = "hidden";
    var isOverflowing =
      textRef.clientWidth < textRef.scrollWidth ||
      textRef.clientHeight < textRef.scrollHeight;

    textRef.style.overflow = curOverflow;

    return isOverflowing;
  }

  return (
    <Box>
      <Box
        sx={{
          alignContent: "center",
          alignItems: "center",
          background: `radial-gradient(${colors.primary[400]} 55%, transparent 56%),
            conic-gradient(transparent 0deg ${angle}deg, ${colors.blueAccent[500]} ${angle}deg 360deg),
            ${colors.greenAccent[500]}`,
          borderRadius: "50%",
          display: "flex",
          height: "80px",
          justifyContent: "center",
          justifyItems: "center",
          overflow: "hidden",
          position: "relative",
          top: isLandscape ? "0" : "-10px",
          width: "80px",
        }}
      >
        <Box
          overflow="hidden"
          ref={textRef}
          sx={{
            alignContent: "center",
            alignItems: "center",
            display: "flex",
            height: "3rem",
            justifyContent: "center",
            justifyItems: "center",
            width: "3rem",
          }}
        >
          <Typography
            component={isOverflowing ? Marquee : Box}
            speed={30}
            sx={{ height: "2.2rem", width: "auto" }}
            variant="h2"
          >
            {isOverflowing && <Box width=".5rem"></Box>}
            {`${latest}/${goal}`}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ProgressCircle;
