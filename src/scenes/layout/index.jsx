import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { activity, loadFile } from "../../store/userDataSlice";

function LayoutPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadFile())
    dispatch(activity())
  }, [])

  return (
    <div className="App">
      <Outlet />
    </div>
  );
}

export default LayoutPage;