import { useEffect, useState } from "react";

import { Box, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useSelector } from "react-redux";

import AddData from "../../components/AddData";
import BiaxialChart from "../../components/BiaxialChart";
import LineChart from "../../components/LineChart";
import QuickUpdate from "../../components/QuickUpdate";
import RecentActivity from "../../components/RecentActivity";

import { tokens } from "../../theme";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("max-width: 800px");
  const isLandscape = useMediaQuery("(orientation: landscape)");
  const userData = useSelector((state) => state.userData.metrics);
  const userCategories = useSelector((state) => state.userData.categories);
  const [selectedCategory, setSelectedCategory] = useState(userCategories[0]);
  const [chartData, setChartData] = useState({
    categoryId: "",
    contents: [
      {
        id: "",
        color: "#ffff",
        data: [
          {
            x: "07/20/2023",
            y: "0",
          },
        ],
        type: "Scale",
      },
    ],
  });
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);

  //Find the 'Dashboard' category.
  useEffect(() => {
    for (let i = 0; i < userCategories.length; i++) {
      if (userCategories[i].categoryId === "Dashboard") {
        setSelectedCategory(userCategories[i]);
      }
    }
  }, [userData]);

  //Find the metrics contained in the 'Dashboard' category and create the chart data.
  useEffect(() => {
    let metricsData = [];
    for (let i = 0; i < selectedCategory.contents.length; i++) {
      const metricsMatch = userData.find(
        (data) => data.id === selectedCategory.contents[i]
      );
      metricsData.push(metricsMatch);
    }
    const categoryData = Object.assign(
      {},
      { categoryId: selectedCategory.categoryId, contents: metricsData }
    );
    setChartData(categoryData);
  }, [selectedCategory]);

  //Split the chart data into 'number' or 'scale' data types. If both types exist, push them to separate state arrays.
  useEffect(() => {
    let tempData1 = [];
    let tempData2 = [];
    for (let i = 0; i < chartData.contents.length; i++) {
      if (chartData.contents[i].type === chartData.contents[0].type) {
        tempData1.push(chartData.contents[i]);
      } else {
        tempData2.push(chartData.contents[i]);
      }
    }
    if (tempData2.length) {
      setData1(tempData1);
      setData2(tempData1.concat(tempData2));
    } else {
      setData1([]);
      setData2([]);
    }
  }, [chartData, userCategories, selectedCategory]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          padding: "1rem",
          width: "100vw",
        }}
      >
        {data2.length > 0 ? (
          <BiaxialChart dataType="Dashboard" data1={data1} data2={data2} />
        ) : (
          <LineChart dataType="category" chartData={chartData.contents} />
        )}
      </Box>
      <QuickUpdate userData={userData} />
      <Box
        sx={{
          display: "flex",
          flexDirection: isLandscape ? "row" : "column",
          position: "relative",
        }}
      >
        <RecentActivity userData={userData} />
        <AddData />
      </Box>
    </Box>
  );
};

export default Dashboard;
