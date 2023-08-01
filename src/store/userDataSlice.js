import { createSlice, current } from "@reduxjs/toolkit";
import { tokens } from "../theme";
import FileSaver from 'file-saver';
import * as moment from "moment";
import Cookies from "universal-cookie";

let currentDate = (new Date())
currentDate = moment(currentDate).format("MM/DD/YYYY");

const initialState = {
    categories: [{
        categoryId: "default category",
        contents: ["Concentration"]
    }],
    metrics: [{
        id: "default data",
        color: tokens("dark").redAccent[100],
        data: [{
            x: `${currentDate}`,
            y: 0
        }], 
        type: "Scale"
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
                state.metrics[i].type = action.payload.type
                if (state.metrics[i].id === action.payload.selectedMetric) {
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
        changeTitle: (state, action) => {
            if (action.payload.isCategory) {
                for (let i = 0; i < state.categories.length; i++) {
                    if (state.categories[i].categoryId === action.payload.selectionId) {
                        state.categories[i].categoryId = action.payload.values
                    }
                }
            } else {
                for (let i = 0; i < state.metrics.length; i++) {
                    if (state.metrics[i].id === action.payload.selectionId) {
                        state.metrics[i].id = action.payload.values
                    }
                }
                for (let i = 0; i < state.categories.length; i++) {
                    const match = current(state.categories[i].contents).find(data => data === action.payload.selectionId);
                    const index = state.categories[i].contents.indexOf(match)
                    if (index != -1) {
                        state.categories[i].contents[index] = action.payload.values;
                    }
                }
            };
        },
        saveFile: (state, action) => {
            const fileContents = JSON.stringify(current(state));
            localStorage.setItem("userData", fileContents)
        },
        loadFile: (state, action) => {
            const userData = JSON.parse(localStorage.getItem("userData"))

            if (userData) {
                state.metrics = userData.metrics;
                state.categories = userData.categories;
            } else {
                console.log("no user data found")
            }
        },
        exportFile: (state, action) => {
            const fileContents = JSON.stringify(current(state));
            const file = new File([fileContents], "userData.txt", { type: "text/plain;charset=utf-8" });
            FileSaver.saveAs(file);
        },
        importFile: (state, action) => {
            const newState = action.payload
            state.metrics = newState.metrics;
            state.categories = newState.categories;
            const fileContents = JSON.stringify(current(state));
            localStorage.setItem("userData", fileContents);
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
        recentActivity: (state, action) => {
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
        },
        deleteMetric: (state, action) => {
            for (let i = 0; i < state.metrics.length; i++) {
                if (state.metrics[i].id === action.payload) {
                    state.metrics.splice(i, 1)
                }
            }
        },
        deleteAll: (state, action) => {
            state = initialState
        },
        addCategory: (state, action) => {
            const newCategory = {
                categoryId: action.payload,
                contents: []
            }
            state.categories.push(newCategory)
        },
        addMetricToCategory: (state, action) => {
            const metricsCopy = [...current(state.metrics)];
            const selectionIds = [...action.payload.selectionValues];
            const categoryId = action.payload.categoryId;
            let categoryCopy = [...current(state.categories[categoryId].contents)];

            selectionIds.forEach(selection => {
                const found = categoryCopy.includes(metricsCopy[selection].id);

                if (found) {
                    const index = categoryCopy.findIndex((element) => (element === metricsCopy[selection].id))
                    categoryCopy.splice(index, 1)
                } else {
                    categoryCopy.push(metricsCopy[selection].id);
                }
                state.categories[categoryId].contents = categoryCopy;
            });
        }
    }
});

export const { addDate, changeTitle, saveFile, loadFile, exportFile, importFile, addMetric, recentActivity, deleteMetric, deleteAll, addCategory, addMetricToCategory } = userDataSlice.actions;

export default userDataSlice