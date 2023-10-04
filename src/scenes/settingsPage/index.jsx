import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { MuiFileInput } from "mui-file-input";
import { confirmAlert } from "react-confirm-alert";
import { useDispatch, useSelector } from "react-redux";

import Header from "../../components/Header";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";

import {
  deleteAll,
  deleteCategory,
  deleteJournal,
  deleteMetric,
  exportFile,
  importFile,
  saveFile,
} from "../../store/userDataSlice";
import { tokens } from "../../theme";

const SettingsPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const userMetrics = useSelector((state) => state.userData.metrics);
  const userCategories = useSelector((state) => state.userData.categories);
  const userJournal = useSelector((state) => state.userData.journal);

  // const handleDeleteMetric = (e) => {
  //   dispatch(deleteMetric(e.id));
  //   dispatch(saveFile());
  // };

  // const handleDeleteCategory = (e) => {
  //   dispatch(deleteCategory(e.categoryId));
  //   dispatch(saveFile());
  // };

  // const handleDeleteJournal = (e) => {
  //   dispatch(deleteJournal(e.x));
  //   dispatch(saveFile());
  // };

  // const handleClearAll = () => {
  //   dispatch(deleteAll());
  //   dispatch(saveFile());
  // };

  const fileLoad = (e) => {
    const file = e;
    const reader = new FileReader();

    if (file.length > 1) {
      alert("Please select a single file to load");
      return;
    }

    reader.addEventListener(
      "load",
      () => {
        const loadedFile = JSON.parse(reader.result);
        dispatch(importFile(loadedFile));
      },
      false
    );
    reader.readAsText(file);
  };

  const submit = (e) => {
    confirmAlert({
      title: "Confirm delete",
      message: "Are you sure you want to delete this item?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            switch (e.target.dataset.type) {
              case "metric":
                dispatch(deleteMetric(e.target.dataset.value));
                dispatch(saveFile());
                break;
              case "category":
                dispatch(deleteCategory(e.target.dataset.value));
                dispatch(saveFile());
                break;
              case "journal":
                dispatch(deleteJournal(e.target.dataset.value));
                dispatch(saveFile());
                break;
              case "all":
                dispatch(deleteAll());
                dispatch(saveFile());
                break;
            }
          },
        },
        {
          label: "No",
          onClick: () => null,
        },
      ],
    });
  };

  const metricsList = userMetrics.map((metric, i) => {
    return (
      <IconButton
        data-type="metric"
        data-value={metric.id}
        key={i}
        onClick={submit}
        sx={{ textAlign: "left" }}
      >
        <DeleteForeverOutlinedIcon sx={{ fontSize: "large" }} />
        DELETE {metric.id.toUpperCase()}
      </IconButton>
    );
  });

  const categoriesList = userCategories.map((category, i) => {
    return (
      <IconButton
        data-type="category"
        data-value={category.categoryId}
        key={i}
        onClick={submit}
        sx={{ textAlign: "left" }}
      >
        <DeleteForeverOutlinedIcon sx={{ fontSize: "large" }} />
        DELETE {category.categoryId.toUpperCase()}
      </IconButton>
    );
  });

  const journalList = userJournal.map((journal, i) => {
    return (
      <IconButton
        data-type="journal"
        data-value={journal.x}
        key={i}
        onClick={submit}
        sx={{ textAlign: "left" }}
      >
        <DeleteForeverOutlinedIcon sx={{ fontSize: "large" }} />
        DELETE {journal.x.toUpperCase()}
      </IconButton>
    );
  });

  return (
    <Box
      sx={{
        margin: "1rem",
        textAlign: "center",
      }}
    >
      <Header permanent title="Settings" />
      <Box
        sx={{
          margin: "1rem",
        }}
      >
        <Typography variant="h4">DELETE DATA</Typography>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              sx={{
                color: colors.greenAccent[500],
              }}
              variant="h5"
            >
              METRICS
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                alignItems: "flex-start",
                display: "flex",
                flexDirection: "column",
                maxHeight: "40vh",
                overflow: "auto",
              }}
            >
              {metricsList}
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              sx={{
                color: colors.greenAccent[500],
              }}
              variant="h5"
            >
              CATEGORIES
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                alignItems: "flex-start",
                display: "flex",
                flexDirection: "column",
                maxHeight: "40vh",
                overflow: "auto",
              }}
            >
              {categoriesList}
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              sx={{
                color: colors.greenAccent[500],
              }}
              variant="h5"
            >
              JOURNAL
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                alignItems: "flex-start",
                display: "flex",
                flexDirection: "column",
                maxHeight: "40vh",
                overflow: "auto",
              }}
            >
              {journalList}
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              sx={{
                color: colors.greenAccent[500],
              }}
              variant="h5"
            >
              ALL
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <IconButton data-type="all" onClick={submit}>
                <DeleteForeverOutlinedIcon
                  sx={{
                    fontSize: "large",
                  }}
                />
                DELETE ALL DATA
              </IconButton>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Box
        sx={{
          margin: "1rem",
        }}
      >
        <Typography variant="h4">IMPORT/EXPORT DATA</Typography>
        <MuiFileInput
          fullWidth
          inputProps={{ accept: ".txt" }}
          onChange={fileLoad}
          placeholder={"IMPORT DATA"}
          size="small"
          sx={{
            backgroundColor: colors.blueAccent[700],
            borderRadius: "8px",
            color: "#fff",
            cursor: "pointer",
            margin: ".5rem 0",
            padding: ".5rem",
            "& .MuiFileInput-placeholder": {
              color: "#fff !important",
              cursor: "pointer !important",
              display: "flex",
              fontSize: 23,
              justifyContent: "center",
            },
            "& .MuiSvgIcon-root": {
              color: "transparent",
            },
          }}
          value={null}
        />
        <Button
          fullWidth
          onClick={() => {
            dispatch(exportFile());
          }}
          sx={{
            backgroundColor: colors.redAccent[700],
            border: `solid 10px ${colors.redAccent[700]}`,
            boxShadow: `inset 0 0 0 1px #777`,
            color: colors.grey[100],
            fontWeight: "700",
            margin: ".5rem 0",
            padding: ".5rem",
          }}
        >
          <Typography variant="h4">EXPORT DATA</Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsPage;
