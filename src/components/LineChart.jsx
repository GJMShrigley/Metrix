import { ResponsiveLine } from "@nivo/line";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useEffect, useState } from "react";
import DateSlice from "../components/DateSlice";
import moment from "moment";

const LineChart = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const originalData = props.chartData;
  const [chartData, setChartData] = useState(props.chartData);
  const [maxY, setMaxY] = useState("auto");
  const height = props.dataType === "Dashboard" ? 50 : 50;

  useEffect(() => {
    if (chartData.every((val, i, chartData) => val.type === "Scale")) {
      setMaxY(10);
    } else {
      let tempY = [];
      for (let i = 0; i < chartData.length; i++) {
        tempY.push(Math.max(...chartData[i].data.map((o) => o.y), 0));
      }
      setMaxY(Math.max(...tempY.map((o) => o), 0));
    }
  }, [chartData]);

  const sliceDate = (startDate, endDate) => {
    startDate = moment(startDate).subtract(1, "days").format("MM/DD/YYYY");
    endDate = moment(endDate).add(1, "days").format("MM/DD/YYYY");
    let dateData = [];
    let metricData = [];
    for (let i = 0; i < originalData.length; i++) {
      for (let j = 0; j < originalData[i].data.length; j++) {
        if (
          moment(originalData[i].data[j].x).isAfter(startDate) &&
          moment(originalData[i].data[j].x).isBefore(endDate)
        ) {
          metricData.push(originalData[i].data[j]);
        }
      }
      dateData.push({ ...originalData[i], data: metricData });
      metricData = [];
    }

    setChartData(dateData);
  };

  useEffect(() => {
    setChartData(props.chartData);
    const currentDate = new Date().toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const lastWeek = moment(currentDate)
      .subtract(6, "days")
      .format("MM/DD/YYYY");

    sliceDate(lastWeek, currentDate);
  }, [props]);

  return (
    <Box
      sx={{
        height: `${height}vh`,
        width: "100vw",
      }}
    >
      <DateSlice sliceDate={sliceDate} />
      <ResponsiveLine
        data={chartData}
        tooltip={({ point }) => {
          return (
            <Box
              style={{
                background: "white",
                padding: "5px 5px",
                border: "1px solid #ccc",
                color: "#000",
              }}
            >
              <Typography fontWeight="bold" sx={{ mr: "5px" }}>
                {point.serieId}
              </Typography>
              <Box display="flex">
                <Typography fontWeight="bold" sx={{ mr: "5px" }}>
                  Date:
                </Typography>
                {point.data.x}
              </Box>
              <Box display="flex">
                <Typography fontWeight="bold" sx={{ mr: "5px" }}>
                  Value:
                </Typography>
                {point.data.y}
              </Box>
              <Box display="flex">
                <Typography fontWeight="bold" sx={{ mr: "5px" }}>
                  Note:
                </Typography>
                {point.data.note}
              </Box>
            </Box>
          );
        }}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: colors.grey[100],
              },
            },
            legend: {
              text: {
                fill: colors.grey[100],
              },
            },
            ticks: {
              line: {
                stroke: colors.grey[100],
                strokeWidth: 1,
              },
              text: {
                fill: colors.grey[100],
              },
            },
          },
          legends: {
            text: {
              fill: colors.grey[100],
            },
          },
          tooltip: {
            container: {
              color: colors.primary[500],
            },
          },
        }}
        colors={{ datum: "color" }} // added
        margin={{ top: 10, right: 80, bottom: 90, left: 40 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: 0,
          max: maxY < 10 ? 10 : maxY,
          stacked: false,
          reverse: false,
        }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: "bottom",
          tickSize: 0,
          tickPadding: 5,
          tickRotation: 90,
          legend: "Date", // added
          legendOffset: 76,
          legendPosition: "middle",
        }}
        axisLeft={{
          orient: "left",
          tickValues: maxY > 10 ? 5 : maxY, // added
          tickSize: 1,
          tickPadding: 5,
          tickRotation: 0,
          legend: "", // added
          legendOffset: -40,
          legendPosition: "middle",
        }}
        pointSize={6}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
      />
    </Box>
  );
};

export default LineChart;
