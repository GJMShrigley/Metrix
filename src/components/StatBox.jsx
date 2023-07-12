import { Box, Typography, useTheme, Button, TextField } from "@mui/material";
import { tokens } from "../theme";
import { Formik } from "formik";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { addDate, saveFile } from "../store/userDataSlice";
import ProgressCircle from "./ProgressCircle";

const StatBox = ({ title }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const params = useParams();
    const chartId = parseInt(params.id);
    const userData = useSelector((state) => state.userData.metrics);
    const selectionId = userData[chartId];
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const dispatch = useDispatch();

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
        dispatch(addDate({ values: values, selectionId: selectionId }));
        dispatch(saveFile());
    };

    return (
        <Box width="350px" height="100%" m="30px">
            <Box m="10px">
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    textAlign="center"
                    sx={{ color: colors.grey[100] }}
                >
                    {title}
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
                            gap="5px"
                            gridTemplateRows="repeat(3, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridRow: isNonMobile ? undefined : "span 3" },
                            }}
                        >
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Time Logged"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.x}
                                name="x"
                                error={!!touched.x && !!errors.x}
                                helperText={touched.x && errors.x}
                                sx={{ gridRow: "span 1" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Value"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.y}
                                name="y"
                                error={!!touched.y && !!errors.y}
                                helperText={touched.y && errors.y}
                                sx={{ gridRow: "span 1" }}
                            />
                            <Button type="submit" color="secondary" variant="contained">
                                Add
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};

export default StatBox;