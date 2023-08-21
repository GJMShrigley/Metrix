import { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { ResponsiveLine } from "@nivo/line";

export default function BiaxialChart(props) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const data = props.data1;
    const data2 = props.data2;
    const [maxY, setMaxY] = useState("auto");
    const height = props.dataType === "Dashboard" ? 35 : 65;

    useEffect(() => {
        if (data2.every((val, i, data2) => val.type === "Scale")) {
            setMaxY(10)
        } else {
            let tempY = []
            for (let i = 0; i < data2.length; i++) {
                tempY.push(Math.max(...data2[i].data.map(o => o.y), 0));
            }
            setMaxY(Math.max(...tempY.map(o => o), 0));
        }
    }, [data2])

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
    }

    function customLegend(legendData) {
        console.log(legendData)
    }


    const FirstGraph = () => {
        return (
            <ResponsiveLine
                data={data}
                theme={graphTheme}
                colors={{ datum: "color" }}
                margin={{ top: 10, right: 100, bottom: 80, left: 140 }}
                layers={["grid", "mesh", "points", "axes", "lines", "markers", "legends"]}
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
                legends={[
                    {
                        anchor: "bottom-left",
                        direction: "column",
                        justify: false,
                        translateX: -100,
                        translateY: 0,
                        toggleSerie: true,
                        itemsSpacing: 0,
                        itemDirection: "right-to-left",
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
            />);
    }

    const SecondGraph = () => {
        return (
            <ResponsiveLine
                data={data2}
                colors={(d) => { return d.type === data[0].type ? "transparent" : d.color }}
                margin={{ top: 10, right: 240, bottom: 80, left: 0 }}
                yScale={{
                    type: "linear",
                    min: 0,
                    max: (maxY < 10) ? 10 : maxY,
                    stacked: false,
                    reverse: false,
                }}
                axisRight={{
                    tickValues: 10,
                    tickSize: 1,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "",
                    legendPosition: "middle",
                    legendOffset: 40
                }}
                axisLeft={null}
                axisTop={null}
                enableGridY={false}
                axisBottom={null}
                theme={graphTheme}
                useMesh={true}
                enableSlices="x"
                sliceTooltip={({ slice }) => {
                    return (
                        <div
                            style={{
                                background: colors.blueAccent[800],
                                padding: '9px 12px',
                                border: '1px solid #ccc',
                                fontSize: "1.1rem",
                                borderRadius: "8px"
                            }}
                        >
                            <Box
                                style={{
                                    color: "#fff",
                                    textAlign: "center",
                                    fontWeight: "bold"
                                }}>
                                {slice.points[0].data.x}
                            </Box>
                            {slice.points.map((point) => {
                              const originalColor = data2.find(data => data.id === point.serieId).color;
                              return (
                            <Box
                                key={point.id}
                                style={{
                                    color: point.serieColor === "transparent" ? originalColor : point.serieColor, // use original color for tooltip
                                    padding: '3px 0',
                                    fontSize: "1.1rem",
                                    fontWeight: "bold",
                                    display: "grid",
                                    gridTemplateColumns: "repeat(3, 1fr)",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Typography
                                    fontWeight="bold"
                                    sx={{ fontSize: "1.1rem", mr: "5px" }}>
                                    {point.serieId}&#58;
                                </Typography>
                                <Box display="flex" justifyContent="center">
                                    <Typography
                                        fontWeight="bold"
                                        sx={{ fontSize: "1.1rem", mr: "5px" }}>
                                        {point.data.yFormatted}
                                    </Typography>
                                </Box>
                                <Box display="flex">
                                    <Typography
                                        fontWeight="bold"
                                        sx={{ fontSize: "1.1rem", mr: "5px" }}>
                                        Note&#58;
                                    </Typography>
                                    <Typography
                                        fontWeight="bold"
                                        sx={{ fontSize: "1.1rem", mr: "5px" }}>
                                        {point.data.note}
                                    </Typography>
                                </Box>
                            </Box>)
                            })}
                        </div>
                    )
                }}
                legends={[
                    {
                        anchor: "top-right",
                        direction: "column",
                        justify: false,
                        translateX: 110,
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
                                },
                            },
                        ],
                    },
                ]}
            />
        );
    }

    const Wrapper = () => {
        return (
            <Box sx={{
                height: `${height}vh`,
                width: "auto",
                minWidth: "80vw",
                maxWidth: "90vw"
            }}>
                <Box sx={{
                    height: `${height}vh`,
                    position: "relative",
                    top: "0px",
                    right: "20px",
                    width: `auto`,
                }}>
                    <FirstGraph />
                </Box>
                <Box sx={{
                    height: `${height}vh`,
                    position: "relative",
                    top: `-${height}vh`,
                    left: "120px",
                    width: `auto`,
                }}>
                    <SecondGraph />
                </Box>
            </Box>

        )
    }

    return (
        <Wrapper />
    )
};
