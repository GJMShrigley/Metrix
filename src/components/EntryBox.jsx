import { Box, Typography, useTheme, Button, TextField } from "@mui/material";
import { tokens } from "../theme";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { addDate, saveFile } from "../store/userDataSlice";


const StatBox = ({ title, lineColor }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
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
        title: ""
    };

    const userSchema = yup.object().shape({
        y: yup.string().required("required"),
    });


    const handleFormSubmit = (values) => {
        dispatch(addDate({ values: values, selectedMetric: title, color: lineColor }));
        dispatch(saveFile());
    };

    return (
        <Box width="auto" minWidth="100px" height="100%" m="0 10px">
            <Box display="flex" flexDirection="column" gap="0" justifyContent="center" overflow="hidden">
                <Typography
                    variant="h5"
                    width="auto"
                    height="20px"
                    fontWeight="bold"
                    textAlign="center"
                    overflow="hidden"
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
                             flexDirection="column"
                            gridTemplateRows="repeat(3, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridRow: isNonMobile ? undefined : "span 3" },
                            }}
                        >
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
                            />
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

export default StatBox;