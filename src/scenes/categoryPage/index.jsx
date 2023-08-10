import { Box, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import BiaxialChart from "../../components/BiaxialChart";
import { useState, useEffect } from "react";
import { addMetricToCategory, saveFile, loadFile } from "../../store/userDataSlice";

const Category = () => {
    const params = useParams();
    const id = parseInt(params.id);
    const categoryArray = useSelector((state) => state.userData.categories);
    const metricsArray = useSelector((state) => state.userData.metrics);
    const dispatch = useDispatch();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [selection, setSelection] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(categoryArray[0]);
    const [chartData, setChartData] = useState({
        categoryId: "",
        contents: [{
            "id": "",
            "color": "#ffff",
            "data": [
                {
                    "x": "07/20/2023",
                    "y": "0"
                }
            ],
            "type": "Scale"
        }]
    });

    useEffect(() => {
        setSelectedCategory(categoryArray[id])
    })
    
    useEffect(() => {
        setSelectedCategory(categoryArray[id])
        let metricsData = []
        for (let i = 0; i < selectedCategory.contents.length; i++) { 
            const metricsMatch = metricsArray.find(data => data.id === selectedCategory.contents[i]);
            metricsData.push(metricsMatch);
        }
        const categoryData = Object.assign({}, { categoryId: selectedCategory.categoryId, contents: metricsData })
        setChartData(categoryData)
    }, [categoryArray, params, selectedCategory]);
   

    const selectionItems = metricsArray.map((metric, i) => {
        return (
            <MenuItem key={metric.id} value={i}>{metric.id}</MenuItem>
        )
    })

    const handleChange = (value) => {
        setSelection(value.target.value)
    }

    const handleSubmit = () => {
        dispatch(addMetricToCategory({ selectionValues: selection, categoryId: id }));
        setSelection([])
        dispatch(saveFile())
    }

    return (
        <Box ml="20px">
            <Header title={chartData.categoryId} subtitle="" isCategory={true} />
            <Box height="67vh">
                <BiaxialChart dataType="category" chartData={chartData.contents}/>
                {/* <LineChart dataType="category" chartData={chartData.contents} /> */}
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