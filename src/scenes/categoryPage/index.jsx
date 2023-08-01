import { Box, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import { useState } from "react";
import { addMetricToCategory, saveFile, loadFile } from "../../store/userDataSlice";

const Category = () => {
    const params = useParams();
    const categoryId = parseInt(params.id);
    const userData = useSelector((state) => state.userData);
    const selectedCategory = userData.categories[categoryId];
    const dispatch = useDispatch();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [selection, setSelection] = useState([]);

    const selectionItems = userData.metrics.map((metric, i) => {
        return (
            <MenuItem key={metric.id} value={i}>{metric.id}</MenuItem>
        )
    })

    const handleChange = (value) => {
        setSelection(value.target.value)
    }

    const handleSubmit = () => {
        dispatch(addMetricToCategory({ selectionValues: selection, categoryId: categoryId }));
        setSelection([])
        dispatch(saveFile())
    }

    return (
        <Box ml="20px">
            <Header title={selectedCategory.categoryId} subtitle="" isCategory={true} />
            <Box height="67vh">
                <LineChart dataType="category" />
                <Box width="50%" display="flex">
                    <FormControl fullWidth >
                        <InputLabel>Add/Remove Metric</InputLabel>
                        <Select
                            label="Metrics"
                            onChange={handleChange}
                            value={selection}
                            multiple
                        >
                            {selectionItems}
                        </Select>
                    </FormControl>
                    <Button type="submit" color="secondary" variant="contained" onClick={handleSubmit} sx={{ gridColumn: "span 1" }}>
                        Add/Remove
                    </Button>
                </Box>
            </Box>
        </Box >
    )
}

export default Category