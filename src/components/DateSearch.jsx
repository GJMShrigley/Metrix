import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormLabel, RadioGroup, FormControlLabel, Radio, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { addDate, saveFile } from "../store/userDataSlice";
import * as moment from "moment";
import { Link } from 'react-router-dom';


const DateSearch = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const dispatch = useDispatch();
    const currentDate = (new Date()).toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const lastWeek = moment(currentDate).subtract(7, "days").format("MM/DD/YYYY");

    const initialValues = {
        startDate: `${lastWeek}`,
        endDate: `${currentDate}`,
    };

    const userSchema = yup.object().shape({
        startDate: yup.date().required("required"),
        endDate: yup.date(),
    });


    const handleFormSubmit = (values) => {

    };

    return (
        <Box width="auto" minWidth="100px" m="0 10px">
            <Box display="flex" flexDirection="column" gap="0" justifyContent="center" overflow="hidden">
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
                        >
                            <Box
                                display="flex"
                                flexDirection="row"
                                columnGap={"5px"}
                            >
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    size="small"
                                    label="startDate"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.startDate}
                                    name="startDate"
                                    error={!!touched.startDate && !!errors.startDate}
                                    helperText={touched.startDate && errors.startDate}
                                    sx={{ gridRow: "span 1", gridColumn: "span 1" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    size="small"
                                    label="endDate"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.endDate}
                                    name="endDate"
                                    error={!!touched.endDate && !!errors.endDate}
                                    helperText={touched.endDate && errors.endDate}
                                    sx={{ gridRow: "span 1", gridColumn: "span 1" }}
                                />
                            </Box>
                            <Button component={Link} to={`/activity/0`} state={{ startDate: values.startDate, endDate: values.endDate }} type="submit" color="secondary" variant="contained" >
                                Go To Date
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box >
    );
}

export default DateSearch