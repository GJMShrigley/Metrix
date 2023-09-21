import { useEffect, useState } from "react";

import { Box, IconButton, Typography, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Header from "../../components/Header";

import { tokens } from "../../theme";

const Journal = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const journalData = useSelector((state) => state.userData.journal);
  const [page, setPage] = useState(1);
  const [displayedEntries, setDisplayedEntries] = useState([
    { x: "", journal: "" },
  ]);
  const [entriesOnPage, setEntriesOnPage] = useState([]);
  const [pages, setPages] = useState([1]);
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState(journalData);
  let pageContent;

  //Set displayed entries with full journal data.
  useEffect(() => {
    setDisplayedEntries(journalData);
  }, [journalData]);

  //Filter journal data for search results and set displayed entries with results.
  useEffect(() => {
    let journalCopy = [];
    for (let i = 0; i < searchResult.length; i++) {
      if (searchResult[i].display) {
        journalCopy.push(searchResult[i]);
      }
    }
    setDisplayedEntries(journalCopy);
  }, [searchResult]);

  //Display the displayed entries to entries corresponding to the selected page.
  useEffect(() => {
    const visibleEntries = displayedEntries.slice(page * 7 - 7, page * 7);
    setEntriesOnPage(visibleEntries);
  }, [displayedEntries, page]);

  //Set the number of pages according to the number of displayed entries.
  useEffect(() => {
    let pagesArray = [];
    const pageLimit = Math.ceil(displayedEntries.length / 7);

    for (let i = 1; i < pageLimit + 1; i++) {
      pagesArray.push(i);
    }
    setPages(pagesArray);
  }, [entriesOnPage]);

  pageContent = entriesOnPage.map((entry, i) => {
    return (
      <Box
        key={i}
        sx={{
          alignContent: "center",
          display: "flex",
          flexDirection: "column",
          minHeight: "5rem",
          minWidth: "90vw",
        }}
      >
        <Typography
          component={Link}
          state={{ startDate: entry.x }}
          sx={{
            color: "#fff",
            display: "flex",
            fontWeight: "bold",
            justifyContent: "center",
            textDecoration: "none",
          }}
          to={`/activity/0`}
          variant="h4"
        >
          {entry.x}
        </Typography>
        <Box>
          <Typography
            sx={{
              backgroundColor: colors.blueAccent[800],
              borderRadius: "8px",
              display: "flex",
              minHeight: "5rem",
              minWidth: "90vw",
              padding: ".5rem",
            }}
            variant="h4"
          >
            {entry.journal}
          </Typography>
        </Box>
      </Box>
    );
  });

  const pageNumbers = pages.map((page, i) => {
    return (
      <Typography
        key={i}
        sx={{
          backgroundColor: colors.blueAccent[800],
          borderRadius: "8px",
          cursor: "pointer",
          display: "flex",
          padding: ".5rem",
        }}
        onClick={(e) => {
          setPage(parseInt(e.target.textContent));
        }}
        variant="h4"
      >
        {page}
      </Typography>
    );
  });

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
      result = searchTerm.test(currentEntry.journal);
      if (result) {
        journalCopy[i].display = true;
      } else {
        journalCopy[i].display = false;
      }
    }
    setSearchResult(journalCopy);
  }

  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <Header permanent={true} title="JOURNAL" />
      <Box
        sx={{
          backgroundColor: colors.primary[400],
          borderRadius: "8px",
          display: "flex",
        }}
      >
        <InputBase
          onChange={setText}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              search();
            }
          }}
          placeholder="Search"
          sx={{ marginLeft: 2 }}
        />
        <IconButton
          onClick={() => {
            search();
          }}
          type="button"
        >
          <SearchIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          height: "auto",
          width: "90vw",
        }}
      >
        {pageContent}
      </Box>
      <Box sx={{ display: "flex", gap: ".5rem" }}>{pageNumbers}</Box>
    </Box>
  );
};

export default Journal;
