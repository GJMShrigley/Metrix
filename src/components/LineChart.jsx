import { ResponsiveLine } from "@nivo/line";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const LineChart = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  let chartData = props.chartData;
  let maxY = "auto";

  if (chartData.every((val, i, chartData) => val.type === "Scale")) {
    maxY = 10
  } else {
    let tempY = []
    for (let i = 0; i < chartData.length; i++) {
      tempY.push(Math.max(...chartData[i].data.map(o => o.y), 0));
    }
    maxY = Math.max(...tempY.map(o => o), 0);
  }

  return (
    <ResponsiveLine
      data={chartData}
      tooltip={({ point }) => {
        return (
          <Box
            style={{
              background: 'white',
              padding: '5px 5px',
              border: '1px solid #ccc',
              color: "#000"
            }}>
            <Typography
              fontWeight="bold"
              sx={{ mr: "5px" }}>
              {point.serieId}
            </Typography>
            <Box display="flex">
              <Typography
                fontWeight="bold"
                sx={{ mr: "5px" }}>
                Date:
              </Typography>
              {point.data.x}
            </Box>
            <Box display="flex">
              <Typography
                fontWeight="bold"
                sx={{ mr: "5px" }}>
                Value:
              </Typography>
              {point.data.y}
            </Box>
            <Box display="flex">
              <Typography
                fontWeight="bold"
                sx={{ mr: "5px" }}>
                Note:
              </Typography>
              {point.data.note}
            </Box>
          </Box>
        )
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
      margin={{ top: 10, right: 150, bottom: 80, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "symlog",
        min: 0,
        max: maxY,
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
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          toggleSerie: true,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              }
            },
          ],
        },
      ]}
    />
  );
};

export default LineChart;