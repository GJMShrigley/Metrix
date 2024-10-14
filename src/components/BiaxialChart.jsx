import { useEffect, useState } from "react";

import * as moment from "moment";
import { Box, Typography, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ResponsiveLine } from "@nivo/line";

import DateSlice from "../components/DateSlice";

import { tokens } from "../theme";

export default function BiaxialChart(props) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width: 992px)");
  const isLandscape = useMediaQuery("(orientation: landscape)");
  const originalData1 = props.data1;
  const originalData2 = props.data2;
  const [data1, setData1] = useState(props.data1);
  const [data2, setData2] = useState(props.data2);
  // const [maxX, setMaxX] = useState(24)
  // const [minX, setMinX] = useState(0)
  const [maxY, setMaxY] = useState("auto");
  const [startDateState, setStartDateState] = useState(props.startDate);
  const [endDateState, setEndDateState] = useState(props.endDate);

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
    if (data2.every((val, i, data2) => val.type === "Scale")) {
      setMaxY(10);
    } else {
      let tempY = [];
      for (let i = 0; i < data2.length; i++) {
        tempY.push(Math.max(...data2[i].data.map((o) => o.y), 0));
      }
      setMaxY(Math.max(...tempY.map((o) => o), 0));
    }
  }, [data1, data2]);

  //If no start date is specified, set the chart data to the week ending on the current date.
  //If a start date is specified but not an end date, set the chart data to the day prior to and following the start date.
  //If both a start date and end date are specified, set the chart data to display the data within those dates.
  useEffect(() => {
    if (!props.startDate) {
      const endDate = new Date().toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const startDate = moment(endDate)
        .subtract(6, "days")
        .format("MM/DD/YYYY");

      setStartDateState(startDate);
      setEndDateState(endDate);
      sliceDate(startDateState, endDateState, originalData1, originalData2);
    } else if (props.startDate && !props.endDate) {
      sliceDate(props.startDate, props.startDate, originalData1, originalData2);
    } else if (props.startDate && props.endDate) {
      sliceDate(props.startDate, props.endDate, originalData1, originalData2);

    }
  }, [props, startDateState, endDateState]);

  //Take a start date, and end date for setting the chart data, and two data sets to recover color data for transparent data.
  function sliceDate(
    startDate,
    endDate,
    colorData1 = data1,
    colorData2 = data2
  ) {
    let newData1 = [];
    let newData2 = [];
    //If the start date and end date are the same, find the times for each metric on that day and display them.
    //Find the times for the metrics in the 'originalData1' variable and push them to the 'newData1' variable for use in the chart. 
    if (props.startDate && props.endDate === undefined || startDateState && endDateState == startDateState) {
      let metricData = [];
      for (let i = 0; i < originalData1.length; i++) {
        const dateMatch = originalData1[i].data.find(
          data => data.x === startDate);

        if (dateMatch) {
          if (dateMatch.times !== undefined) {
            const indexOfDate = originalData1[i].data.indexOf(dateMatch);
            metricData = originalData1[i].data[indexOfDate].times;

            newData1.push({
              ...originalData1[i],
              color: colorData1[i].color,
              data: metricData
            });
          }
        }
      }
      //Find the times for the metrics in the 'originalData2' variable and push them to the 'newData2' variable for use in the chart. 
      for (let i = 0; i < originalData2.length; i++) {
        const dateMatch = originalData2[i].data.find(
          data => data.x === startDate);

        if (dateMatch) {
          if (dateMatch.times !== undefined) {
            const indexOfDate = originalData2[i].data.indexOf(dateMatch);
            metricData = originalData2[i].data[indexOfDate].times;

            newData2.push({
              ...originalData2[i],
              color: colorData2[i].color,
              data: metricData
            });
          }
        }
      }
      //Find each individual time listed in either 'newData1' or 'newData2' variables.
      let times = [];
      for (let i = 0; i < newData2.length; i++) {
        for (let j = 0; j < newData2[i].data.length; j++) {
          times.push(moment(newData2[i].data[j].x, 'kk:mm'))
        }
      }
      //Find the unique times in the 'times' array and sort them.
      const sortedTimes = [...new Set(times.sort((a, b) => a - b))];
      const uniqueTimes = sortedTimes.map((timeObj) => {
        return moment(timeObj).format('kk:mm');
      });
      // setMinX(moment(sortedTimes[0]).format('kk:mm'))
      // setMaxX(moment(sortedTimes[sortedTimes.length - 1]).format('kk:mm'))
      let data1Copy = []
      //Loop through the metrics contained in the 'newData1' and 'newData2' variables. If they are missing times contained within 'uniqueTimes' array, insert the missing time with 'null' as their 'y' value. 
      for (let i = 0; i < newData1.length; i++) {
        let metricCopy = []
        for (let k = 0; k < uniqueTimes.length; k++) {
          const timeMatch = newData1[i].data.find(data => data.x === uniqueTimes[k])
          if (timeMatch) {
            metricCopy.push(timeMatch)
          }
          if (!timeMatch) {
            metricCopy.push({ x: uniqueTimes[k], y: "" })
          }
        }
        const finalData = Object.assign(
          {},
          { ...newData1[i], data: metricCopy }
        );
        metricCopy = [];
        data1Copy.push(finalData);
      }
      newData1 = data1Copy;

      let data2Copy = [];
      for (let i = 0; i < newData2.length; i++) {
        let metricCopy = []
        for (let k = 0; k < uniqueTimes.length; k++) {
          const timeMatch = newData2[i].data.find(data => data.x === uniqueTimes[k])
          if (timeMatch) {
            metricCopy.push(timeMatch)
          }
          if (!timeMatch) {
            metricCopy.push({ x: uniqueTimes[k], y: "" })
          }
        }
        const finalData = Object.assign(
          {},
          { ...newData2[i], data: metricCopy }
        );
        metricCopy = [];
        data2Copy.push(finalData)

      }
      newData2 = data2Copy;
    } else {
      //Find all dates in 'originalData1' between the assigned start and end dates and assign them to the 'newData1' array.
      for (let i = 0; i < originalData1.length; i++) {
        let dateArray = [];
        for (let j = 0; j < originalData1[i].data.length; j++) {
          if (
            moment(originalData1[i].data[j].x).isBetween(
              startDate,
              endDate,
              "day",
              "[]"
            )
          ) {
            dateArray.push(originalData1[i].data[j]);
          }
        }
        newData1.push({
          ...originalData1[i],
          color: colorData1[i].color,
          data: dateArray,
        });
      }
      //Find all dates in 'originalData2' between the assigned start and end dates and assign them to the 'newData2' array.
      for (let i = 0; i < originalData2.length; i++) {
        let dateArray = [];
        for (let j = 0; j < originalData2[i].data.length; j++) {
          if (
            moment(originalData2[i].data[j].x).isBetween(
              startDate,
              endDate,
              "day",
              "[]"
            )
          ) {
            dateArray.push(originalData2[i].data[j]);
          }
        }
        newData2.push({
          ...originalData2[i],
          color: colorData2[i].color,
          data: dateArray,
        });
      }
    }
    //Set the 'data1' and 'data2' states with the relevant arrays containing the new dates.
    setData1(newData1);
    setData2(newData2);
    if (startDate !== undefined) {
      setStartDateState(startDate)
    }
  }

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

  //Toggle the display of chart data by setting line colors to/from transparent.
  function handleClick(e) {
    const data1Copy = [...data1];
    const data2Copy = [...data2];
    const i = e.target.dataset.key;


    if (i <= data1Copy.length - 1) {
      data1Copy[i].color === "transparent"
        ? (data1Copy[i] = { ...originalData1[i] })
        : (data1Copy[i] = { ...data1[i], color: "transparent" });
    }
    data2Copy[i].color === "transparent"
      ? (data2Copy[i] = { ...originalData2[i] })
      : (data2Copy[i] = { ...data2[i], color: "transparent" });
    sliceDate(startDateState, endDateState, data1Copy, data2Copy);
  }

  //Create a custom legend for the charts to allow for styling and onClick functionality.
  function customLegend(legendData) {
    const legendItems = legendData.map((item, i) => {
      return (
        <Box
          onClick={handleClick}
          data-key={i}
          key={i}
          sx={{
            alignItems: "center",
            cursor: "pointer",
            display: "flex",
            gap: ".2rem",
            height: "1rem",
            whiteSpace: "nowrap",
            width: "auto",
          }}
        >
          <Box
            sx={{
              backgroundColor: item.color,
              borderRadius: "8px",
              height: ".5rem",
              width: ".5rem",
            }}
            data-key={i}
          ></Box>
          {item.id}
        </Box>
      );
    });

    return (
      <Box
        sx={{
          display: "flex",
          gap: "10px",
          height: "2.5rem",
          margin: "0 1rem",
          overflowX: "auto",
          overflowY: "hidden",
        }}
      >
        {legendItems}
      </Box>
    );
  }

  //Create the first responsive line graph.
  const FirstGraph = () => {
    return (
      <ResponsiveLine
        data={data1}
        theme={graphTheme}
        colors={{ datum: "color" }}
        margin={{ top: 10, right: 40, bottom: 90, left: 25 }}
        layers={["grid", "mesh", "points", "axes", "lines", "markers"]}
        // xScale={{
        //   type: props.endDate && (props.endDate === props.startDate) ? "time" : "point",
        //   min: 0,
        //   max: "auto"
        // }}
        xFormat={function (value) {
          return `time:${moment(value).format("HH:MM")}`
        }}
        yScale={{
          type: "linear",
          min: 0,
          max: 10,
          stacked: false,
          reverse: false,
        }}
        axisBottom={{
          orient: "bottom",
          tickSize: 0,
          tickPadding: 5,
          tickRotation: 90,
          // tickValues: "time scale, every 15 minutes",
          legend: "Date", // added
          legendOffset: 76,
          legendPosition: "middle",
        }
        }
        axisLeft={{
          orient: "left",
          tickValues: 10, // added
          tickSize: 1,
          tickPadding: 0,
          tickRotation: 0,
          legend: "", // added
          legendOffset: -40,
          legendPosition: "middle",
        }}
        pointSize={6}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={- 12}
        useMesh={true}
        animate={false}
      />
    );
  };

  //Create the second responsive line graph.
  const SecondGraph = () => {
    return (
      <ResponsiveLine
        data={data2}
        colors={(d) => {
          return d.type === data1[0].type ? "transparent" : d.color;
        }}
        margin={{ top: 10, right: 40, bottom: 90, left: 25 }}
        // xScale={{
        //   type: props.endDate && (props.endDate === props.startDate) ? "linear" : "point",
        //   min: 0,
        //   max: "auto"
        // }}
        xFormat={function (value) {
          return `time:${moment(value).format("HH:MM")}`
        }}
        yScale={{
          type: "linear",
          min: 0,
          max: maxY < 10 ? 10 : maxY,
          stacked: false,
          reverse: false,
        }}
        axisRight={{
          tickValues: 10,
          tickSize: 1,
          tickPadding: 2,
        }}
        axisLeft={null}
        axisTop={null}
        enableGridY={false}
        axisBottom={null}
        theme={graphTheme}
        useMesh={true}
        animate={false}
        enableSlices="x"
        sliceTooltip={({ slice }) => {
          return (
            <Box
              sx={{
                background: colors.blueAccent[800],
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontSize: "1.1rem",
                maxWidth: "60vw",
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
                const originalColor = data2.find(
                  (data) => data.id === point.serieId
                ).color;
                return (
                  <Box
                    key={point.id}
                    sx={{
                      color:
                        point.serieColor === "transparent"
                          ? originalColor
                          : point.serieColor, // use original color for tooltip
                      display: "grid",
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      gridTemplateColumns: "repeat(2, auto)",
                      gridTemplateRows: point.data.note
                        ? "repeat(2, 1fr)"
                        : "1",
                      justifyContent: "space-between",
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
                      {point.serieId}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
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
                    {point.data.note ? (
                      <Box
                        sx={{
                          display: "flex",
                        }}
                      >
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
                          }}
                        >
                          {point.data.note}
                        </Typography>
                      </Box>
                    ) : null}
                  </Box>
                );
              })}
            </Box>
          );
        }}
      />
    );
  };
  //Create the wrapper and position the two graphs to overlap with the second graph on top.
  const Wrapper = () => {
    return (
      <Box
        sx={{
          width: "100%"
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: `${height + 10}vh`,
          }}
        >
          <Box
            sx={{
              height: `${height}vh`,
              minHeight: `${height}vh`,
              position: "relative",
              width: "97%",
            }}
          >
            <FirstGraph />
          </Box>
          <Box
            sx={{
              height: `${height}vh`,
              minHeight: `${height}vh`,
              position: "relative",
              top: `-${height}vh`,
              width: "97%",
            }}
          >
            <SecondGraph />
          </Box>
          <Box
            sx={{
              height: "5vh",
              position: "relative",
              top: `-${height}vh`,
              width: "97%",
            }}
          >
            {customLegend(data2)}
          </Box>
        </Box>
        <DateSlice handleDate={props.handleDate} sliceDate={sliceDate} />
      </Box>
    );
  };

  return <Wrapper />;
}
