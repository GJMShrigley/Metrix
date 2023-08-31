import { useEffect } from "react";

import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";

import { addDate, loadFile } from "../../store/userDataSlice";

function LayoutPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadFile());
    dispatch(addDate());
  }, []);

  return (
    <Box component={Outlet} />
  );
}

export default LayoutPage;