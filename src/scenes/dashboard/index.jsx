import { useEffect, useState, useRef } from "react";

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
  const [position, setPosition] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    for (let i = 0; i < userCategories.length; i++) {
      if (userCategories[i].categoryId === "Dashboard") {
        setSelectedCategory(userCategories[i]);
      }
    }
  });

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

  function handleHeight(height) {
    if (position === 0) {
      setPosition(containerRef.current.clientTop + height);
    }
  }

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gap="10px"
      width="95vw"
    >
      {/* ROW 1 */}
      {data2.length > 0 ? (
        <BiaxialChart
          dataType="Dashboard"
          data1={data1}
          data2={data2}
          handleHeight={handleHeight}
        />
      ) : (
        <LineChart dataType="category" chartData={chartData.contents} />
      )}
      <Box
        position="relative"
        top={position}
        display="flex"
        flexDirection="column"
        alignContent="flex-end"
        gridColumn="span 12"
      >
        {/* ROW 2 */}
        <QuickUpdate userData={userData} />
        {/* ROW 3 */}
        <RecentActivity userData={userData} />
        {/* ROW 4 */}
        <AddData />
      </Box>
    </Box>
  );
};

export default Dashboard;
