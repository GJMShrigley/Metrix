import { useEffect, useState } from "react";

import * as moment from "moment";
import { Box, Typography, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ResponsiveLine } from "@nivo/line";

import DateSlice from "../components/DateSlice";

import { tokens } from "../theme";

const date = new Date();

const currentDate = moment(date).format("MM/DD/YYYY");

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

  //Set the height variable to the relevant value for desktop, landscape, and portrait viewports.
  if (isNonMobile) {
    height = 60;
  } else if (!isNonMobile && isLandscape) {
    height = 90;
  } else if (!isNonMobile && !isLandscape) {
    height = 50;
  }

  //If all data types are of type 'Scale', set the maxY variable to '10'. Otherwise, set the maxY variable to the highest value of the dataset.
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

  //If no start date is specified, set the chart data to the week ending on the current date.
  //If a start date is specified but not an end date, set the chart data to the day prior to and following the start date.
  //If both a start date and end date are specified, set the chart data to display the data within those dates.
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

  //Set the chart data and reset the time to display the past week whenever new data is passed to the component.
  useEffect(() => {
    setChartData(props.chartData);
    sliceDate(props.startDate, props.endDate);
  }, [props]);

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
        display: "flex",
        flexDirection: "column",
        height: `${height + 20}vh`,
      }}
    >
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
                sx={{
                  background: "white",
                  padding: ".2rem",
                  border: "1px solid #ccc",
                  color: "#000",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                    marginRight: ".2rem",
                  }}
                >
                  {point.serieId}
                </Typography>
                <Box display="flex">
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      marginRight: ".2rem",
                    }}
                  >
                    Date:
                  </Typography>
                  {point.data.x}
                </Box>
                <Box display="flex">
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      marginRight: ".2rem",
                    }}
                  >
                    Value:
                  </Typography>
                  {point.data.y}
                </Box>
                <Box display="flex">
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      marginRight: ".2rem",
                    }}
                  >
                    Note:
                  </Typography>
                  {point.data.note}
                </Box>
              </Box>
            );
          }}
          theme={graphTheme}
          colors={{ datum: "color" }} // added
          margin={{ top: 10, right: 25, bottom: 90, left: 25 }}
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
          animate={false}
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
                            wordBreak: "break-all",
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
        <DateSlice sliceDate={sliceDate} handleDate={props.handleDate} />
      </Box>
    </Box>
  );
};

export default LineChart;
