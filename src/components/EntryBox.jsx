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
import * as yup from "yup";

import { updateValue, saveFile } from "../store/userDataSlice";
import { tokens } from "../theme";

const date = new Date();

const currentDate = moment(date).format("MM/DD/YYYY");

const initialValues = {
  x: `${currentDate}`,
  y: 0,
};

const userSchema = yup.object().shape({
  x: yup.date().required("required"),
  y: yup.number().required("required"),
});

const EntryBox = ({ title, lineColor, type }) => {
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
    dispatch(
      updateValue({
        color: lineColor,
        selectedMetric: title,
        type: type,
        values: values,
      })
    );
    dispatch(saveFile());
  };

  const menuItems = Array.from({ length: 10 }, (_, i) => {
    return (
      <MenuItem key={i + 1} value={`${i + 1}`}>
        {`${i + 1}`}
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
        ref={textRef}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "0",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Typography
          component={isOverflowing ? Marquee : Box}
          speed={30}
          sx={{
            color: colors.grey[100],
            fontWeight: "bold",
            height: "1.3rem",
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
                      height: "2.5rem",
                      width: "6rem",
                    }}
                  >
                    <InputLabel>Value</InputLabel>
                    <Select
                      fullWidth
                      label="Value"
                      name="y"
                      onChange={handleChange}
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
                    height: "2.5rem",
                    width: "6rem",
                  }}
                >
                  <TextField
                    error={!!touched.y && !!errors.y}
                    fullWidth
                    helperText={touched.y && errors.y}
                    label="Value"
                    name="y"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    size="small"
                    type="text"
                    value={values.y}
                    variant="filled"
                  />
                </Box>
              )}
              <Button
                color="secondary"
                sx={{
                  height: "2.5rem",
                  width: "6rem",
                }}
                type="submit"
                variant="contained"
              >
                Add
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default EntryBox;
