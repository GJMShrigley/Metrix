import { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { ResponsiveLine } from "@nivo/line";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as moment from "moment";
import DateSlice from "../components/DateSlice";

export default function BiaxialChart(props) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width: 800px)");
  const originalData1 = props.data1;
  const originalData2 = props.data2;
  const [data1, setData1] = useState(props.data1);
  const [data2, setData2] = useState(props.data2);
  const [maxY, setMaxY] = useState("auto");
  const height = props.dataType === "Dashboard" ? 50 : 50;

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

      sliceDate(startDate, endDate, originalData1, originalData2);
    } else if (props.startDate && !props.endDate) {
      const startDate = moment(props.startDate)
        .subtract(1, "days")
        .format("MM/DD/YYYY");

      const endDate = moment(props.startDate)
        .add(1, "days")
        .format("MM/DD/YYYY");

      sliceDate(startDate, endDate, originalData1, originalData2);
    } else if (props.startDate && props.endDate) {
      sliceDate(props.startDate, props.endDate, originalData1, originalData2);
    }
  }, [props.startDate, props.endDate]);

  function sliceDate(
    startDate,
    endDate,
    colorData1 = data1,
    colorData2 = data2
  ) {
    let newData = [];
    let newData2 = [];

    if (startDate === endDate) {
      endDate = moment(startDate).add(1, "days").format("MM/DD/YYYY");
      startDate = moment(startDate).subtract(1, "days").format("MM/DD/YYYY");
    }

    for (let i = 0; i < originalData1.length; i++) {
      let dateArray = [];
      for (let e = 0; e < originalData1[i].data.length; e++) {
        if (
          moment(originalData1[i].data[e].x).isBetween(
            startDate,
            endDate,
            "day",
            "[]"
          )
        ) {
          dateArray.push(originalData1[i].data[e]);
        }
      }
      newData.push({
        ...originalData1[i],
        color: colorData1[i].color,
        data: dateArray,
      });
    }

    for (let i = 0; i < originalData2.length; i++) {
      let dateArray = [];
      for (let e = 0; e < originalData2[i].data.length; e++) {
        if (
          moment(originalData2[i].data[e].x).isBetween(
            startDate,
            endDate,
            "day",
            "[]"
          )
        ) {
          dateArray.push(originalData2[i].data[e]);
        }
      }
      newData2.push({
        ...originalData2[i],
        color: colorData2[i].color,
        data: dateArray,
      });
    }
    setData1(newData);
    setData2(newData2);
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

  function handleClick(e) {
    const data1Copy = [...data1];
    const data2Copy = [...data2];
    const i = e.target.dataset.key;
    const startDate = data1Copy[0].data[0].x;
    const endDate = data1Copy[0].data.at(-1).x;
    if (i <= data1Copy.length - 1) {
      data1Copy[i].color === "transparent"
        ? (data1Copy[i] = { ...originalData1[i] })
        : (data1Copy[i] = { ...data1[i], color: "transparent" });
    }
    data2Copy[i].color === "transparent"
      ? (data2Copy[i] = { ...originalData2[i] })
      : (data2Copy[i] = { ...data2[i], color: "transparent" });
    sliceDate(startDate, endDate, data1Copy, data2Copy);
  }

  function customLegend(legendData) {
    const legendItems = legendData.map((item, i) => {
      return (
        <Box
          display="flex"
          alignItems="center"
          height="1rem"
          width="auto"
          gap="5px"
          onClick={handleClick}
          data-key={i}
          key={i}
          sx={{
            backgroundColor: colors.grey[800],
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          <Box
            borderRadius="8px"
            width="10px"
            height="10px"
            sx={{ backgroundColor: item.color }}
            data-key={i}
          ></Box>
          {item.id}
        </Box>
      );
    });

    return (
      <Box
        display="flex"
        gap="10px"
        sx={{
          margin: "0 1rem",
          height: "2.5rem",
          overflowX: "auto",
          overflowY: "hidden",
        }}
      >
        {legendItems}
      </Box>
    );
  }

  const FirstGraph = () => {
    return (
      <ResponsiveLine
        data={data1}
        theme={graphTheme}
        colors={{ datum: "color" }}
        margin={{ top: 10, right: 40, bottom: 90, left: 40 }}
        layers={["grid", "mesh", "points", "axes", "lines", "markers"]}
        xScale={{ type: "point" }}
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
          legend: "Date", // added
          legendOffset: 76,
          legendPosition: "middle",
        }}
        axisLeft={{
          orient: "left",
          tickValues: 10, // added
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
        animate={false}
      />
    );
  };

  const SecondGraph = () => {
    return (
      <ResponsiveLine
        data={data2}
        colors={(d) => {
          return d.type === data1[0].type ? "transparent" : d.color;
        }}
        margin={{ top: 10, right: 40, bottom: 90, left: 40 }}
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
          tickPadding: 5,
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
              style={{
                background: colors.blueAccent[800],
                padding: "9px 12px",
                border: "1px solid #ccc",
                fontSize: "1.1rem",
                borderRadius: "8px",
              }}
            >
              <Box
                style={{
                  color: "#fff",
                  textAlign: "center",
                  fontWeight: "bold",
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
                    style={{
                      color:
                        point.serieColor === "transparent"
                          ? originalColor
                          : point.serieColor, // use original color for tooltip
                      padding: "3px 0",
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      fontWeight="bold"
                      sx={{ fontSize: "1.1rem", mr: "5px" }}
                    >
                      {point.serieId}&#58;
                    </Typography>
                    <Box display="flex" justifyContent="center">
                      <Typography
                        fontWeight="bold"
                        sx={{ fontSize: "1.1rem", mr: "5px" }}
                      >
                        {point.data.yFormatted}
                      </Typography>
                    </Box>
                    <Box display="flex">
                      <Typography
                        fontWeight="bold"
                        sx={{ fontSize: "1.1rem", mr: "5px" }}
                      >
                        Note&#58;
                      </Typography>
                      <Typography
                        fontWeight="bold"
                        sx={{ fontSize: "1.1rem", mr: "5px" }}
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
    );
  };

  const Wrapper = () => {
    return (
      <Box backgroundColor={colors.primary[400]}>
        <DateSlice sliceDate={sliceDate} changeDate={props.changeDate} />
        <Box
          sx={{
            height: `${height + 10}vh`,
            width: "100vw",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              width: "95vw",
              height: `${height}vh`,
              minHeight: `${height}vh`,
              position: "relative",
            }}
          >
            <FirstGraph />
          </Box>
          <Box
            sx={{
              width: "95vw",
              height: `${height}vh`,
              minHeight: `${height}vh`,
              position: "relative",
              top: `-${height}vh`,
            }}
          >
            <SecondGraph />
          </Box>
          <Box
            sx={{
              position: "relative",
              top: `-${height}vh`,
              width: "100vw",
              height: "5vh",
            }}
          >
            {customLegend(data2)}
          </Box>
        </Box>
      </Box>
    );
  };

  return <Wrapper />;
}
