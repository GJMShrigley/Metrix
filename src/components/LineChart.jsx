import { useEffect, useState } from "react";

import * as moment from "moment";
import { Box, Typography, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ResponsiveLine } from "@nivo/line";

import DateSlice from "../components/DateSlice";

import { tokens } from "../theme";

const currentDate = new Date().toLocaleDateString("en-US", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const LineChart = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width: 992px)");
  const isLandscape = useMediaQuery("(orientation: landscape)");
  const originalData = props.chartData;
  const [chartData, setChartData] = useState([
    {
      id: "",
      color: "#ffff",
      data: [
        {
          x: currentDate,
          y: "0",
        },
      ],
      type: "Scale",
    },
  ]);
  const [maxY, setMaxY] = useState("auto");
  let height;

  if (isNonMobile) {
    height = 60;
  } else if (!isNonMobile && isLandscape) {
    height = 90;
  } else if (!isNonMobile && !isLandscape) {
     height = 50;
  }

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

  useEffect(() => {
    props.handleDate(chartData[0].data[0].x, chartData[0].data.at(-1).x)
  },[chartData])

  const graphTheme = {
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
  };

  return (
    <Box
      sx={{
        height: `${height}vh`,
        width: "100%",
      }}
    >
      <ResponsiveLine
        data={chartData}
        tooltip={({ point }) => {
          return (
            <Box
              style={{
                background: "white",
                padding: ".2rem",
                border: "1px solid #ccc",
                color: "#000",
              }}
            >
              <Typography sx={{ fontWeight: "bold", marginRight: ".2rem" }}>
                {point.serieId}
              </Typography>
              <Box display="flex">
                <Typography sx={{ fontWeight: "bold", marginRight: ".2rem" }}>
                  Date:
                </Typography>
                {point.data.x}
              </Box>
              <Box display="flex">
                <Typography sx={{ fontWeight: "bold", marginRight: ".2rem" }}>
                  Value:
                </Typography>
                {point.data.y}
              </Box>
              <Box display="flex">
                <Typography sx={{ fontWeight: "bold", marginRight: ".2rem" }}>
                  Note:
                </Typography>
                {point.data.note}
              </Box>
            </Box>
          );
        }}
        theme={graphTheme}
        colors={{ datum: "color" }} // added
        margin={{ top: 10, right: 20, bottom: 90, left: 20 }}
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
        enableSlices="x"
        sliceTooltip={({ slice }) => {
          return (
            <Box
              sx={{
                background: colors.blueAccent[800],
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontSize: "1.1rem",
                padding: ".5rem",
              }}
            >
              <Box
                sx={{
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {slice.points[0].data.x}
              </Box>
              {slice.points.map((point) => {
                return (
                  <Box
                    key={point.id}
                    sx={{
                      color: point.serieColor,
                      display: "grid",
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      justifyContent: "space-between",
                      maxWidth: "80vw",
                      padding: ".2rem 0",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        marginRight: ".2rem",
                      }}
                    >
                      {point.serieId}&#58;
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Typography
                        sx={{
                          fontSize: "1.1rem",
                          fontWeight: "bold",
                          marginRight: ".2rem",
                        }}
                      >
                        {point.data.yFormatted}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex" }}>
                      <Typography
                        sx={{
                          fontSize: "1.1rem",
                          fontWeight: "bold",
                          marginRight: ".2rem",
                        }}
                      >
                        Note&#58;
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "1.1rem",
                          fontWeight: "bold",
                          marginRight: ".2rem",
                          maxWidth: "50vw",
                          wordBreak: "break-all"
                        }}
                      >
                        {point.data.note}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          );
        }}
      />
      <DateSlice sliceDate={sliceDate} />
    </Box>
  );
};

export default LineChart;
