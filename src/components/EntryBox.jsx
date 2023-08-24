import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormLabel, RadioGroup, FormControlLabel, Radio, Typography, useTheme } from "@mui/material";
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
    }, [title])

    function checkOverflow(textRef) {
        if (textRef === undefined || textRef === null) return false;

        var curOverflow = textRef.style.overflow;

        if (!curOverflow || curOverflow === "visible") textRef.style.overflow = "hidden";
        var isOverflowing =
            textRef.clientWidth < textRef.scrollWidth || textRef.clientHeight < textRef.scrollHeight;

        textRef.style.overflow = curOverflow;

        return isOverflowing;
    }

    const currentDate = (new Date()).toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
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
        dispatch(updateValue({ values: values, selectedMetric: title, color: lineColor, type: type }));
        dispatch(saveFile());
    };

    return (
        <Box width="auto" minWidth="100px" maxWidth="100px" height="100%" m="0 10px">
            <Box ref={textRef} display="flex" flexDirection="column" gap="0" justifyContent="center" overflow="hidden">
                <Typography
                    component={isOverflowing ? Marquee : Box}
                    speed={30}
                    variant="h5"
                    width="auto"
                    height="22px"
                    fontWeight="bold"
                    textAlign="center"
                    sx={{ color: colors.grey[100] }}
                >
                    {isOverflowing && <Box width="10px"></Box>}{title}
                </Typography>
            </Box>
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={userSchema}
            >
                {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            gridTemplateRows="repeat(3, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridRow: isNonMobile ? undefined : "span 3" },
                            }}
                        >
                            {type === "Scale"
                                ?
                                <FormControl sx={{ gridColumn: "span 3" }} >
                                    <InputLabel>Value</InputLabel>
                                    <Select
                                        label="Value"
                                        onChange={handleChange}
                                        name="y"
                                        value={values.y}
                                        size="small"
                                    >
                                        <MenuItem key={0} value={0}>0</MenuItem>
                                        <MenuItem key={1} value={1}>1</MenuItem>
                                        <MenuItem key={2} value={2}>2</MenuItem>
                                        <MenuItem key={3} value={3}>3</MenuItem>
                                        <MenuItem key={4} value={4}>4</MenuItem>
                                        <MenuItem key={5} value={5}>5</MenuItem>
                                        <MenuItem key={6} value={6}>6</MenuItem>
                                        <MenuItem key={7} value={7}>7</MenuItem>
                                        <MenuItem key={8} value={8}>8</MenuItem>
                                        <MenuItem key={9} value={9}>9</MenuItem>
                                        <MenuItem key={10} value={10}>10</MenuItem>
                                    </Select>
                                </FormControl>
                                :
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    size="small"
                                    label="Value"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.y}
                                    name="y"
                                    error={!!touched.y && !!errors.y}
                                    helperText={touched.y && errors.y}
                                    sx={{ gridRow: "span 1" }}
                                />}
                            <Button type="submit" color="secondary" variant="contained" >
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