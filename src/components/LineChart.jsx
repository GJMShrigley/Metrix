import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const LineChart = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const params = useParams();
  const chartId = parseInt(params.id);
  const location = useLocation().state
  const userData = useSelector((state) => state.userData);
  const metricsArray = userData.metrics;
  const categoryArray = userData.categories[chartId];
  let chartData = props.chartData;
  let maxY = "auto";
 
  if (props.chartData.type === "Scale") {
    maxY = 10;
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
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}

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
        tickRotation: 0,
        legend: "Date", // added
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: maxY > 10 ? 5 : maxY , // added
        tickSize: 1,
        tickPadding: 5,
        tickRotation: 0,
        legend: "", // added
        legendOffset: -40,
        legendPosition: "middle",
      }}
      pointSize={8}
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