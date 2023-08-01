import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const LineChart = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const params = useParams();
  const chartId = parseInt(params.id);
  const userData = useSelector((state) => state.userData);
  const metricsArray = userData.metrics;
  const categoryArray = userData.categories[chartId];
  const activityDate = userData.dates[chartId];
  let chartData = [];
  let maxY;

  switch (props.dataType) {
    case "dashboard":
      chartData.push(...metricsArray);
      break;
    case "category":
      for (let i = 0; i < categoryArray.contents.length; i++) {
        const metricsMatch = metricsArray.find(data => data.id === categoryArray.contents[i]);
        chartData.push(metricsMatch)
      }
      break;
    case "metric":
      chartData.push(metricsArray[params.id])
      break;
    case "date":
      let dateArray = [];
      metricsArray.map((metric, i) => {
        for (let i = 0; i < metric.data.length; i++) {
          if (metric.data[i].x === activityDate.x) {
            let tempArray = [];
            tempArray.push(metric.data.slice(i - 1, i + 2))
            const temp = tempArray.reduce((temp, data) => ({ ...metricsArray, data: temp }))
            dateArray.push({ ...metric, data: [...temp] })
          }
        }
      })
      chartData = dateArray
      break;
  }

  switch (props.measurementType) {
    case "Scale":
      maxY = 10;
      break;
    case "Number":
      maxY = Math.max(...chartData[0].data.map(o => o.y), 0);
      break;
    case "Percentage":
      maxY = 100;
      break;
    case "Minutes":
      maxY = 60;
      break;
    case "Hours":
      maxY = 24;
      break;
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
      colors={props.dataType ? { datum: "color" } : { datum: "color" }} // added
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}

      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
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
        tickValues: 5, // added
        tickSize: 3,
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