import { Box, useTheme, Typography } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Journal = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const journalData = useSelector((state) => state.userData.journal);
    const [page, setPage] = useState(1)
    const [entriesOnPage, setEntriesOnPage] = useState([{},{},{},{},{},{},{}]);
    const [pages, setPages] = useState([]);
    let pageContent;

    useEffect(() => {
        const visibleEntries = journalData.slice(
            page * 7 - 7, page * 7
        );
        setEntriesOnPage(visibleEntries);
    }, [journalData, page])

    useEffect(() => {
        let pagesArray = []

        for (let i = 0; i < (Math.ceil(journalData.length / entriesOnPage.length)); i++) {
            pagesArray.push(i + 1);
        }
        setPages(pagesArray);
    }, [])

    pageContent = entriesOnPage.map((entry, i) => {
        return (
            <Box
                key={i}
                sx={{
                    minWidth: "70vw",
                    width: "auto",
                    minHeight: "100px",
                    display: "flex",
                    flexDirection: "column",
                    alignContent: "center"
                }}>
                <Typography
                    variant="h4"
                    display="flex"
                    justifyContent="center"
                    fontWeight="bold"
                    component={Link}
                    to={`/activity/0`}
                    state={{ startDate: entry.x }}
                    style={{ textDecoration: 'none', color: "#fff" }}
                >
                    {entry.x}
                </Typography>
                <Box>
                    <Typography
                        variant="h4"
                        display="flex"
                        sx={{
                            borderRadius: "8px",
                            minWidth: "200px",
                            minHeight: "100px",
                            padding: "10px",
                            backgroundColor: colors.blueAccent[800]
                        }}
                    >
                        {entry.note}
                    </Typography>
                </Box>
            </Box>
        )
    })

    const pageNumbers = pages.map((page, i) => {
        return (
            <Typography
                variant="h4"
                display="flex"
                sx={{
                    borderRadius: "8px",
                    padding: "10px",
                    backgroundColor: colors.blueAccent[800]
                }}
                onClick={(e) => {
                    setPage(parseInt(e.target.textContent))
                }}
            >
                {page}
            </Typography>
        )
    })

    return <Box
        m="20px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="20px">
        <Header
            title="JOURNAL"
            permanent={true} />
        <Box sx={{
            width: "auto",
            height: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px"
        }}>
            {pageContent}
        </Box>
        <Box
            display="flex" gap="10px">
            {pageNumbers}
        </Box>
    </Box>
}

export default Journal;