import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { recentActivity, loadFile } from "../../store/userDataSlice";
import { Box } from "@mui/material"

function LayoutPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadFile())
    dispatch(recentActivity())
  }, [])

  return (
    <Box component={Outlet} />
  );
}

export default LayoutPage;