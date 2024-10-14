import { useEffect } from "react";

import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";

import { useStorage } from "../../hooks/useStorage";
import { addDate } from "../../store/userDataSlice";

function LayoutPage() {
  const dispatch = useDispatch();
  const { loadState } = useStorage();

  useEffect(() => {
    loadState();
    dispatch(addDate());
  }, []); 

  return (
    <Box component={Outlet} />
  );
}

export default LayoutPage;