import { useRef, useLayoutEffect, useState } from "react";

import { Formik } from "formik";
import * as moment from "moment";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import * as yup from "yup";

import { updateValue } from "../store/userDataSlice";
import { tokens } from "../theme";

const date = new Date();

const currentDate = moment(date).format("MM/DD/YYYY kk:mm");

const initialValues = {
  x: `${currentDate}`,
  y: 0,
};

const userSchema = yup.object().shape({
  x: yup.date().required("required"),
  y: yup.number().required("required"),
});

const EntryBox = ({ id, lineColor, title, type }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const textRef = useRef(undefined);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useLayoutEffect(() => {
    setIsOverflowing(checkOverflow(textRef.current));
  }, [title]);

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

  const handleFormSubmit = (values) => {
    if (values.y != '') {
      dispatch(
        updateValue({
          color: lineColor,
          selectedMetric: title,
          type: type,
          values: values,
        })
      )
    };
  };

  const menuItems = Array.from({ length: 11 }, (_, i) => {
    return (
      <MenuItem key={i} value={`${i}`}>
        {`${i}`}
      </MenuItem>
    );
  });

  return (
    <Box
      sx={{
        margin: "0 .5rem",
        maxWidth: "100px",
        minWidth: "100px",
      }}
    >
      <Box
        component={Link}
        key={id}
        ref={textRef}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "0",
          height: "2.5rem",
          justifyContent: "center",
          overflow: "hidden",
        }}
        to={`/chart/${id}`}
      >
        <Typography
          component={isOverflowing ? Marquee : Box}
          speed={30}
          sx={{
            color: colors.grey[100],
            fontWeight: "bold",
            height: "2rem",
            textAlign: "center",
            width: "auto",
          }}
          variant="h5"
        >
          {isOverflowing && <Box width=".5rem"></Box>}
          {title}
        </Typography>
      </Box>
      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={userSchema}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          touched,
          values,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gridTemplateRows: "repeat(3, minmax(0, 1fr))",
              }}
            >
              {type === "Scale" ? (
                <FormControl>
                  <Box
                    sx={{
                      height: "3.5rem",
                      width: "6rem",
                    }}
                  >
                    <InputLabel>Value</InputLabel>
                    <Select
                      fullWidth
                      label="Value"
                      name="y"
                      onChange={(e) => { handleChange(e); handleSubmit(); }}
                      size="small"
                      value={values.y}
                    >
                      {menuItems}
                    </Select>
                  </Box>
                </FormControl>
              ) : (
                <Box
                  sx={{
                    height: "3.5rem",
                    width: "6rem",
                  }}
                >
                  <TextField
                    error={!!touched.y && !!errors.y}
                    fullWidth
                    helperText={touched.y && errors.y}
                    label="Value"
                    name="y"
                    onBlurCapture={handleBlur}
                    onChange={(e) => { handleChange(e); handleSubmit() }}
                    size="small"
                    type="text"
                    value={values.y}
                    variant="filled"
                  />
                </Box>
              )}
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default EntryBox;
