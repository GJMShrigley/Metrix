import { useLayoutEffect, useRef, useState } from "react";

import { Box, Typography, useTheme } from "@mui/material";
import Marquee from "react-fast-marquee";

import ProgressCircle from "./ProgressCircle";

import { tokens } from "../theme";

const ProgressBox = ({ title, icon, latest, increase, goal }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const textRef = useRef(undefined);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useLayoutEffect(() => {
    setIsOverflowing(checkOverflow(textRef.current));
  }, []);

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
    <Box sx={{ display: "flex", gap: ".2rem", margin: "0 1rem" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>{icon}</Box>
        <Box>
          <ProgressCircle goal={goal} latest={latest} title={title} />
        </Box>
      </Box>
      <Marquee>
        <Box
          ref={textRef}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: ".2rem",
          }}
        >
          <Typography
            sx={{ color: colors.greenAccent[600], fontStyle: "italic" }}
            variant="h5"
          >
            {increase}
          </Typography>
        </Box>
      </Marquee>
    </Box>
  );
};

export default ProgressBox;
