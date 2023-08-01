import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { recentActivity, loadFile } from "../../store/userDataSlice";

function LayoutPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadFile())
    dispatch(recentActivity())
  }, [])

  return (
    <div className="App">
      <Outlet />
    </div>
  );
}

export default LayoutPage;