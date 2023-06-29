import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import { useSelector, useDispatch } from "react-redux"
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import { addDate, replaceDate } from "../../store/userDataSlice";

const currentDate = (new Date()).toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
});

const initialValues = {
    // id: "",
    x: `${currentDate}`,
    y: 0,
    // data: "",
};

const userSchema = yup.object().shape({
    // id: yup.string().required("required"),
    x: yup.date().required("required"),
    y: yup.string().required("required"),
    // data: yup.string().required("required")
});

const ChartPage = () => {
    // const userData = useSelector((state) => state.userData.habits);
    const dispatch = useDispatch();
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const handleFormSubmit = (values) => {
            dispatch(addDate(values))
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
                                    {/* <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Type of Habit"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.id}
                                        name="id"
                                        error={!!touched.id && !!errors.id}
                                        helperText={touched.id && errors.id}
                                        sx={{ gridColumn: "span 1" }}
                                    /> */}
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
                                    {/* <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Value"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.data}
                                        name="data"
                                        error={!!touched.data && !!errors.data}
                                        helperText={touched.data && errors.data}
                                        sx={{ gridColumn: "span 1" }}
                                    /> */}

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