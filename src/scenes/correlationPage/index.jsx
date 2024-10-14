import { useState, useEffect } from "react";

import calculateCorrelation from "calculate-correlation";
import { Box, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Header from "../../components/Header";

import { tokens } from "../../theme";

const Correlation = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width: 992px)");
    const isLandscape = useMediaQuery("(orientation: landscape)");
    const metricsArray = useSelector((state) => state.userData.metrics);
    const [rowData, setRowData] = useState([]);
    const [columnData, setColumnData] = useState([]);

    useEffect(() => {
        const columns = metricsArray.map((metric, i) => {
            const column = Object.assign(
                {},
                {
                    field: `${i}`, headerName: `${metric.id}`, id: i, renderHeader: (params) => (
                        <Link
                            style={{
                                color: '#fff',
                                fontWeight: '700',
                                textDecoration: 'none'
                            }}
                            to={`/chart/${metric.id}`}>
                            {`${metric.id}`},
                        </Link>
                    ),
                }
            )
            return column;
        });

        const rows = metricsArray.map((metric, i) => {

            let correlationScores = [];

            let metric1 = [];
            let metric2 = [];

            for (let i = 0; i < metric.data.length; i++) {
                metric1.push(parseInt(metric.data[i].y));
            }

            for (let i = 0; i < metricsArray.length; i++) {
                for (let j = 0; j < metricsArray[i].data.length; j++) {
                    metric2.push(parseInt(metricsArray[i].data[j].y));
                }
                const correlation = calculateCorrelation(metric1, metric2);
                correlationScores.push(correlation.toFixed(2));
                metric2 = [];
            }

            const row = Object.assign(
                {},
                {
                    id: metric.id, ...correlationScores,
                }
            );
            return row;
        });
        setRowData(rows)
        setColumnData([{
            field: "id",
            headerName: "",
            cellClassName: "metric-name-column--cell",
            renderCell: (params) => (
                <Link
                    style={{
                        color: '#fff',
                        fontWeight: '700',
                        textDecoration: 'none'
                    }}
                    to={`/chart/${params.id}`}>
                    {`${params.id}`}
                </Link>
            )
        }, ...columns])
    }, [metricsArray])

    return (
        <Box m="20px">
            <Header title="CORRELATIONS" />
            <Box
                m="40px 0 0 0"
                height="75vh"
                sx={{
                    [`.${gridClasses.cell}.high`]: {
                        backgroundColor: '#050',
                        color: '#fff',
                    },
                    [`.${gridClasses.cell}.med`]: {
                        backgroundColor: '#005',
                        color: '#fff',
                    },
                    [`.${gridClasses.cell}.low`]: {
                        backgroundColor: '#aa0',
                        color: '#fff',
                    },
                    [`.${gridClasses.cell}.vlow`]: {
                        backgroundColor: '#f70',
                        color: '#fff',
                    },
                    [`.${gridClasses.cell}.neg`]: {
                        backgroundColor: '#500',
                        color: '#fff',
                    },
                    "& .MuiDataGrid-root": {
                        border: "none",
                        color: "#fff",
                        textAlign: "center",
                    },
                    "& .MuiDataGrid-cell": {
                        border: "solid 1px",

                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[800],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                }}
            >
                <DataGrid
                    rows={rowData}
                    columns={columnData}
                    getCellClassName={(params) => {
                        if (params.field === 'id' || params.value == null || params.value == 0) {
                            return '';
                        }

                        if (params.value <= 0) {
                            return 'neg'
                        } else if (params.value > 0 && params.value <= 0.25) {
                            return 'vlow'
                        } else if (params.value > 0.25 && params.value <= 0.5) {
                            return 'low'
                        } else if (params.value > 0.5 && params.value <= 0.75) {
                            return 'med'
                        } else if (params.value > 0.75) {
                            return 'high'
                        }

                    }}
                    autosizeOptions={{
                        includeOutliers: true,
                        includeHeaders: true,
                    }}
                />
            </Box>
        </Box>
    );
};

export default Correlation;