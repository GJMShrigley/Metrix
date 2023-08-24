import { Box, useTheme, Typography, IconButton } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";

const Journal = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const journalData = useSelector((state) => state.userData.journal);
    const [page, setPage] = useState(1)
    const [displayedEntries, setDisplayedEntries] = useState(journalData)
    const [entriesOnPage, setEntriesOnPage] = useState([{}, {}, {}, {}, {}, {}, {}]);
    const [pages, setPages] = useState([1]);
    const [searchText, setSearchText] = useState("");
    const [searchResult, setSearchResult] = useState(journalData);
    let pageContent;

    useEffect(() => {
        let journalCopy = [];
        for (let i = 0; i < searchResult.length; i++) {
            if (searchResult[i].display) {
                journalCopy.push(searchResult[i]);
            }
        }
        setDisplayedEntries(journalCopy)
    }, [journalData, searchResult])

    useEffect(() => {
        const visibleEntries = displayedEntries.slice(
            page * 7 - 7, page * 7
        );
        setEntriesOnPage(visibleEntries);
    }, [displayedEntries, page])

    useEffect(() => {
        let pagesArray = [];
        const pageLimit = Math.ceil(displayedEntries.length / 7);

        for (let i = 1; i < (pageLimit + 1); i++) {
            pagesArray.push(i);
        }
        setPages(pagesArray);
    }, [entriesOnPage])

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
                    backgroundColor: colors.blueAccent[800],
                    cursor: "pointer"
                }}
                onClick={(e) => {
                    setPage(parseInt(e.target.textContent))
                }}
            >
                {page}
            </Typography>
        )
    })

    function setText(e) {
        setSearchText(e.target.value);
    }

    function search() {
        let inputText = searchText;
        const journalCopy = JSON.parse(JSON.stringify([...journalData]));
        const searchTerm = new RegExp(inputText, "i");
        let result = "";

        for (let i = 0; i < journalCopy.length; i++) {
            const currentEntry = journalCopy[i];
            result = searchTerm.test(currentEntry.note);
            if (result) {
                journalCopy[i].display = true;
            } else {
                journalCopy[i].display = false;
            }
        }
        setSearchResult(journalCopy);
    }

    return <Box
        m="20px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="20px">
        <Header
            title="JOURNAL"
            permanent={true} />
        <Box
            display="flex"
            backgroundColor={colors.primary[400]}
            borderRadius="3px"
        >
            <InputBase
                sx={{ ml: 2, flex: 1 }}
                placeholder="Search"
                onChange={setText}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        search()
                    }
                }} />
            <IconButton
                type="button"
                sx={{ p: 1 }}
                onClick={() => {
                    search();
                }}>
                <SearchIcon />
            </IconButton>
        </Box>
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
            display="flex"
            gap="10px">
            {pageNumbers}
        </Box>
    </Box>
}

export default Journal;