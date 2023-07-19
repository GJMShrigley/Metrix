import { createSlice, current } from "@reduxjs/toolkit";
import { tokens } from "../theme";
import FileSaver from 'file-saver';
import * as moment from "moment";
import Cookies from 'universal-cookie';

let currentDate = (new Date())
currentDate = moment(currentDate).format("MM/DD/YYYY");

const initialState = {
    metrics: [{
        id: "default data",
        color: tokens("dark").redAccent[100],
        data: [{
            x: `${currentDate}`,
            y: 0
        }]
    }],
    dates: [],
    status: "idle",
    error: null,
};

const userDataSlice = createSlice({
    name: "userData",
    initialState,
    reducers: {
        addDate: (state, action) => {
            for (let i = 0; i < state.metrics.length; i++) {
                if (state.metrics[i].id === action.payload.selectionId.id) {
                    let dataCopy = [...current(state.metrics[i].data)];
                    const lastDate = dataCopy.at(-1).x;
                    const firstDate = dataCopy.at(0).x;

                    const yesterdayDate = moment(currentDate).subtract(1, "days").format("MM/DD/YYYY");
                    const futureDate = moment(action.payload.values.x).isAfter(currentDate);
                    const pastDate = moment(action.payload.values.x).isBefore(firstDate);

                    if (futureDate || pastDate) {
                        return
                    }

                    function plusDate(lastDate) {
                        let plusDay = moment(lastDate).add(1, "days").format("MM/DD/YYYY");
                        dataCopy.push({ x: plusDay, y: 0 });
                        lastDate = dataCopy.at(-1).x;
                        if (yesterdayDate.toString() !== lastDate.toString()) {
                            plusDate(lastDate)
                        } else {
                            state.metrics[i].data = dataCopy;
                        }
                    }

                    function addCurrentDate() {
                        const dateMatch = dataCopy.find(data => data.x === action.payload.values.x);

                        if (!dateMatch) {
                            dataCopy.push(action.payload.values)
                            state.metrics[i].data = dataCopy;
                        } else {
                            const index = dataCopy.indexOf(dateMatch);
                            state.metrics[i].data.splice(index, 1, action.payload.values);
                        }
                    }

                    if ((yesterdayDate.toString() !== lastDate.toString()) && (currentDate.toString() !== lastDate.toString())) {
                        plusDate(lastDate);
                        addCurrentDate();
                    } else {
                        addCurrentDate();
                    }
                    state.metrics[i].color = action.payload.color;
                }
            }
        },
        saveFile: (state, action) => {
            const fileContents = JSON.stringify(current(state.metrics));
            const cookies = new Cookies();
            cookies.set("userData", fileContents, { path: '/' });
        },
        loadFile: (state, action) => {
            const cookies = new Cookies();
            const userData = cookies.get("userData");

            if (userData) {
                state.metrics = userData;
            } else {
                console.log("no user data found")
            }
        },
        exportFile: (state, action) => {
            const fileContents = JSON.stringify(current(state.metrics));
            const file = new File([fileContents], "userData.txt", { type: "text/plain;charset=utf-8" });
            FileSaver.saveAs(file);
        },
        importFile: (state, action) => {
            state.metrics = action.payload;

        },
        addMetric: (state, action) => {
            let currentDate = (new Date())
            currentDate = moment(currentDate).format("MM/DD/YYYY");
            const futureDate = moment(action.payload.x).isAfter(currentDate);

            if (futureDate) {
                return
            }

            const newMetric = {
                id: action.payload.metric,
                color: tokens("dark").redAccent[100],
                data: [{
                    x: `${action.payload.x}`,
                    y: `${action.payload.y}`
                }]
            }
            state.metrics.push(newMetric)
        },
        activity: (state, action) => {
            const dataCopy = [...current(state.metrics)];
            const startDate = moment(currentDate).subtract(6, "days").format("MM/DD/YYYY");
            const endDate = currentDate;
            let activityDate = startDate;
            let activityData = [];
            let activityObj = {};

            function combineDates() {
                for (let i = 0; i < dataCopy.length; i++) {
                    const metricCopy = [dataCopy[i].data];
                    metricCopy[0].filter(obj => {
                        if (obj.x === activityDate) {
                            const newObj = {
                                y: obj.y,
                                id: dataCopy[i].id
                            }
                            activityData.push(newObj)
                        }
                    });
                };
                activityObj = { x: activityDate, ...activityData };
                state.dates.push(activityObj)
                activityData = []
            }

            while (state.dates.length < 7) {
                combineDates();
                activityDate = moment(activityDate).add(1, "days").format("MM/DD/YYYY");
            }
            state.dates.reverse();
        }
    }
});

export const { addDate, saveFile, loadFile, exportFile, importFile, addMetric, activity } = userDataSlice.actions;


export default userDataSlice