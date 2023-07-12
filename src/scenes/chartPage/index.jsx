import { useEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import { tokens } from "../../theme";
import { addDate, saveFile } from "../../store/userDataSlice";

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

const ChartPage = () => {
    const params = useParams();
    const chartId = parseInt(params.id);
    const userData = useSelector((state) => state.userData.metrics);
    const selectionId = userData[chartId];
    const dispatch = useDispatch();
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const handleFormSubmit = (values) => {
        dispatch(addDate({values: values, selectionId: selectionId}));
        dispatch(saveFile());
    };
    
    return (
        <Box m="20px">
            <Header title="LINE CHART" subtitle="Simple Line Chart" />
            <Box height="75vh">
                <LineChart />
                <Box>
                    <Formik
                        onSubmit={handleFormSubmit}
                        initialValues={initialValues}
                        validationSchema={userSchema}
                    >
                        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <Box
                                    display="grid"
                                    gap="30px"
                                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                    sx={{
                                        "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
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
                                        sx={{ gridColumn: "span 1" }}
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
                                        sx={{ gridColumn: "span 1" }}
                                    />
                                    <Button type="submit" color="secondary" variant="contained">
                                        Add Measurement
                                    </Button>
                                </Box>
                            </form>
                        )}
                    </Formik>
                </Box>
            </Box>
        </Box>
    )
}

export default ChartPage;