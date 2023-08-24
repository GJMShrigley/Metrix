import { Box, useTheme, IconButton, Typography, Button } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";
import { useDispatch, useSelector } from "react-redux"
import { deleteMetric, deleteCategory, deleteJournal, deleteAll, saveFile, exportFile, importFile } from "../../store/userDataSlice";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import { MuiFileInput } from 'mui-file-input'

const SettingsPage = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const userMetrics = useSelector((state) => state.userData.metrics);
    const userCategories = useSelector((state) => state.userData.categories)
    const userJournal = useSelector((state) => state.userData.journal);

    const handleDeleteMetric = (e) => {
        dispatch(deleteMetric(e.id));
        dispatch(saveFile());
    }

    const handleDeleteCategory = (e) => {
        dispatch(deleteCategory(e.categoryId));
        dispatch(saveFile());
    }

    const handleDeleteJournal = (e) => {
        dispatch(deleteJournal(e.x));
        dispatch(saveFile());
    }

    const handleClearAll = () => {
        dispatch(deleteAll());
        dispatch(saveFile());
    }

    const fileLoad = (e) => {
        const file = e;
        const reader = new FileReader();

        if (file.length > 1) {
            alert("Please select a single file to load");
            return;
        }

        reader.addEventListener("load", () => {
            const loadedFile = JSON.parse(reader.result);
            dispatch(importFile(loadedFile));
        }, false);
        reader.readAsText(file);
    }

    const metricsList = userMetrics.map((metric, i) => {
        return (
            <Typography key={i}>
                <IconButton onClick={() => {
                    handleDeleteMetric(metric);
                }} >
                    <DeleteForeverOutlinedIcon fontSize="large" />DELETE {metric.id.toUpperCase()} DATA
                </IconButton>
            </Typography >
        )
    })

    const categoriesList = userCategories.map((category, i) => {
        return (
            <Typography key={i}>
                <IconButton onClick={() => {
                    handleDeleteCategory(category);
                }} >
                    <DeleteForeverOutlinedIcon fontSize="large" />DELETE {category.categoryId.toUpperCase()} DATA
                </IconButton>
            </Typography>
        )
    })

    const journalList = userJournal.map((journal, i) => {
        return (
            <Typography key={i}>
                <IconButton onClick={() => {
                    handleDeleteJournal(journal);
                }} >
                    <DeleteForeverOutlinedIcon fontSize="large" />DELETE {journal.x.toUpperCase()}
                </IconButton>
            </Typography>
        )
    })

    return <Box m="20px">
        <Header title="Settings" permanent />
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                DELETE DATA
            </AccordionSummary>
            <AccordionDetails>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography color={colors.greenAccent[500]} variant="h5">
                            METRICS
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box maxHeight="40vh" overflow="auto">
                            {metricsList}
                        </Box>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography color={colors.greenAccent[500]} variant="h5">
                            CATEGORIES
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box maxHeight="40vh" overflow="auto">
                            {categoriesList}
                        </Box>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography color={colors.greenAccent[500]} variant="h5">
                            JOURNAL
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            <Box maxHeight="40vh" overflow="auto">
                                {journalList}
                            </Box>
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography color={colors.greenAccent[500]} variant="h5">
                            ALL
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            <IconButton onClick={handleClearAll} >
                                <DeleteForeverOutlinedIcon fontSize="large" />DELETE ALL DATA
                            </IconButton>
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </AccordionDetails>
        </Accordion>
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                IMPORT/EXPORT DATA
            </AccordionSummary>
            <AccordionDetails>
                <MuiFileInput
                    fullWidth
                    size="small"
                    sx={{
                        borderRadius: "5px",
                        backgroundColor: colors.blueAccent[700],
                        color: colors.grey[100],
                        margin: "5px 0",
                        padding: "6px",
                    }}
                    onChange={fileLoad}
                    inputProps={{ accept: '.txt' }} />
                <Button
                    fullWidth
                    sx={{
                        backgroundColor: colors.blueAccent[700],
                        color: colors.grey[100],
                        fontSize: "14px",
                        fontWeight: "bold",
                        margin: "5px 0",
                        padding: "10px 78px",
                    }}
                    onClick={() => {
                        dispatch(exportFile());
                    }}
                >
                    <DownloadOutlinedIcon sx={{ mr: "10px" }} />
                    Export User Data
                </Button>
            </AccordionDetails>
        </Accordion>
    </Box>
}

export default SettingsPage;