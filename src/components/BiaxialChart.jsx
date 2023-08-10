import React, { useEffect } from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { ResponsiveLine } from "@nivo/line";

const line1Color = "blue";

export default function BiaxialChart(props) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    let chartData = props.chartData;
    const data = []
    const data2 = []

    useEffect(() => {
        for (let i = 0; i < chartData.length; i++) {
            if (chartData[i].type === "Scale") {
                data.push(chartData[i]);
            } else {
                data2.push(chartData[i]);
            }
        }
    }, [props, chartData])

    const firstGraph = () => {
        console.log("firstGraph")
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
                    type: "linear",
                    min: 0,
                    max: 10,
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
    }

    const graphWrapper = () => {
        console.log("graphWrapper")
        return (
            <firstGraph />
        )
    }





    // const graphWrapper = () => {
    //     console.log("Graph1 Data: ", data, "Graph2 Data: ", data2);
    //     return (
    //         <div className="App">
    //             <div className="wrapper">
    //                 <div className="graphContainer">
    //                     <ResponsiveLine
    //                         data={data}
    //                         colors={[line1Color]}
    //                         layers={["grid", "axes", "lines", "markers", "legends"]}
    //                         axisLeft={{
    //                             legend: "Points Scored",
    //                             legendPosition: "middle",
    //                             legendOffset: -40
    //                         }}
    //                         theme={getColoredAxis(line1Color)}
    //                         margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
    //                     />
    //                 </div>

    //                 <div className="secondGraph">
    //                     <SecondGraph />
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }


    // // I want this to be on top of the other graph
    // const SecondGraph = () => {
    //     const data1And2 = data.concat(data2);
    //     console.log("Graph2 Data: ", data1And2);

    //     return (
    //         <ResponsiveLine
    //             data={data1And2}
    //             colors={["rgba(255, 255, 255, 0)", "red"]} /* Make the first line transparent with 0 opacity */
    //             margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
    //             axisRight={{
    //                 legend: "Wins / Loss",
    //                 legendPosition: "middle",
    //                 legendOffset: 40
    //             }}
    //             axisLeft={null}
    //             axisTop={null}
    //             enableGridY={false}
    //             axisBottom={null}
    //             theme={getColoredAxis("red")}

    //             /* Add this for tooltip */
    //             useMesh={true}
    //             enableSlices="x"
    //             sliceTooltip={({ slice }) => {
    //                 return (
    //                     <div
    //                         style={{
    //                             background: 'white',
    //                             padding: '9px 12px',
    //                             border: '1px solid #ccc',
    //                         }}
    //                     >
    //                         <div>x: {slice.points[0].data.x}</div>
    //                         {slice.points.map(point => (
    //                             <div
    //                                 key={point.id}
    //                                 style={{
    //                                     color: point.serieColor === "rgba(255, 255, 255, 0)" ? line1Color : point.serieColor,
    //                                     padding: '3px 0',
    //                                 }}
    //                             >
    //                                 <strong>{point.serieId}</strong> [{point.data.yFormatted}]
    //                             </div>
    //                         ))}
    //                     </div>
    //                 )
    //             }}
    //         />
    //     );
    // };

    // const getColoredAxis = color => {
    //     return {
    //         axis: {
    //             ticks: {
    //                 line: {
    //                     stroke: color
    //                 },
    //                 text: { fill: color }
    //             },
    //             legend: {
    //                 text: {
    //                     fill: color
    //                 }
    //             }
    //         }
    //     };
    // }
    graphWrapper()
};
