import { useEffect, useState } from "react";
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import { tokens } from "../../theme";
import { addDate, saveFile } from "../../store/userDataSlice";
import { HexColorPicker } from "react-colorful";
import { type } from "@testing-library/user-event/dist/type";

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
    const selectedMetric = userData[chartId];
    const dispatch = useDispatch();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [color, setColor] = useState("#0000");
    const [typeSelection, setTypeSelection] = useState("Scale");

    useEffect(() => {
        for (let i = 0; i < userData.length; i++) {
            if (i === chartId) {
                setColor(userData[i].color)
            }
        }
    }, [userData, params]);

    const handleTypeChange = (value) => {
        const newValue = value.target.value
        setTypeSelection(newValue);
    }

    const handleFormSubmit = (values) => {
        dispatch(addDate({ values: values, selectedMetric: selectedMetric.id, color: color, type: typeSelection }));
        dispatch(saveFile());
    };

    return (
        <Box ml="20px">
            <Header title={selectedMetric.id} subtitle="" />
            <Box height="67vh">
                <LineChart dataType="metric" measurementType={selectedMetric.type} />
                <Box sx={{
                    "& > .react-colorful": { marginTop: "10px", width: "75%", height: "50px" },
                    ".react-colorful__saturation": { height: "100%", position: "relative", top: "30%" },
                    ".react-colorful__hue": { height: "100%" },
                    ".react-colorful__hue-pointer, .react-colorful__saturation-pointer": { width: "25px", height: "25px" }
                }}>
                    <Formik
                        onSubmit={handleFormSubmit}
                        initialValues={initialValues}
                        validationSchema={userSchema}
                    >
                        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <Box
                                    display="grid"
                                    gap="20px"
                                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                    sx={{
                                        "& > div": { gridColumn: isNonMobile ? undefined : "span 4" }
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
                                    <FormControl fullWidth >
                                        <InputLabel>Select Measurement Type</InputLabel>
                                        <Select
                                            id="type"
                                            name="type"
                                            label="type"
                                            onChange={handleTypeChange}
                                            value={typeSelection}
                                        >
                                              <MenuItem value={"Scale"}>Scale</MenuItem>
                                              <MenuItem value={"Number"}>Number</MenuItem>
                                              <MenuItem value={"Minutes"}>Minutes</MenuItem>
                                              <MenuItem value={"Hours"}>Hours</MenuItem>
                                              <MenuItem value={"Percentage"}>Percentage</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Button type="submit" color="secondary" variant="contained" sx={{ gridColumn: "span 1" }}>
                                        Add Measurement
                                    </Button>

                                </Box>
                            </form>
                        )}
                    </Formik>
                    <HexColorPicker color={color} onChange={setColor} />
                </Box>
            </Box>
        </Box>
    )
}

export default ChartPage;