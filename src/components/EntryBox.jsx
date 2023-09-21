import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../theme";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { updateValue, saveFile } from "../store/userDataSlice";
import Marquee from "react-fast-marquee";
import { useRef, useState, useLayoutEffect } from "react";

const EntryBox = ({ title, lineColor, type }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
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

  const currentDate = new Date().toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const initialValues = {
    x: `${currentDate}`,
    y: 0,
  };

  const userSchema = yup.object().shape({
    x: yup.date().required("required"),
    y: yup.string().required("required"),
  });

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
                  <InputLabel>Value</InputLabel>
                  <Select
                    label="Value"
                    name="y"
                    onChange={handleChange}
                    size="small"
                    value={values.y}
                  >
                    <MenuItem key={0} value={0}>
                      0
                    </MenuItem>
                    <MenuItem key={1} value={1}>
                      1
                    </MenuItem>
                    <MenuItem key={2} value={2}>
                      2
                    </MenuItem>
                    <MenuItem key={3} value={3}>
                      3
                    </MenuItem>
                    <MenuItem key={4} value={4}>
                      4
                    </MenuItem>
                    <MenuItem key={5} value={5}>
                      5
                    </MenuItem>
                    <MenuItem key={6} value={6}>
                      6
                    </MenuItem>
                    <MenuItem key={7} value={7}>
                      7
                    </MenuItem>
                    <MenuItem key={8} value={8}>
                      8
                    </MenuItem>
                    <MenuItem key={9} value={9}>
                      9
                    </MenuItem>
                    <MenuItem key={10} value={10}>
                      10
                    </MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  error={!!touched.y && !!errors.y}
                  fullWidth
                  helperText={touched.y && errors.y}
                  label="Value"
                  name="y"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.y}
                  variant="filled"
                />
              )}
              <Button color="secondary" type="submit" variant="contained">
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
