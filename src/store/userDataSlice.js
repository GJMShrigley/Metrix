import { createSlice, current } from "@reduxjs/toolkit";
import { tokens } from "../theme";
import FileSaver from 'file-saver';
import * as moment from "moment";

let currentDate = (new Date())
currentDate = moment(currentDate).format("MM/DD/YYYY");

const initialState = {
    categories: [{
        categoryId: "Dashboard",
        contents: ["Default Data"]
    }],
    journal: [{
        x: `${currentDate}`,
        note: "",
        display: true
    },
    ],
    metrics: [{
        id: "Default Data",
        color: tokens("dark").redAccent[500],
        data: [{
            x: `${currentDate}`,
            y: 0
        }],
        type: "Scale",
        goal: ""
    }],
    dates: [],
    status: "idle",
    error: null,
};

const userDataSlice = createSlice({
    name: "userData",
    initialState,
    reducers: {
        updateValue: (state, action) => {
            for (let i = 0; i < state.metrics.length; i++) {
                if (state.metrics[i].id === action.payload.selectedMetric) {
                    state.metrics[i].type = action.payload.type
                    let dataCopy = [...current(state.metrics[i].data)];
                    const firstDate = dataCopy.at(0).x;
                    const futureDate = moment(action.payload.values.x).isAfter(currentDate);
                    const pastDate = moment(action.payload.values.x).isBefore(firstDate);

                    if (futureDate || pastDate) {
                        return
                    }

                    function addCurrentDate() {
                        const dateMatch = dataCopy.find(data => data.x === action.payload.values.x);
                        const index = dataCopy.indexOf(dateMatch);
                        state.metrics[i].data.splice(index, 1, action.payload.values);
                    }
                    addCurrentDate();
                    state.metrics[i].color = action.payload.color;
                }
            }
        },
        addDate: (state, action) => {
            for (let i = 0; i < state.metrics.length; i++) {
                let lastDate = state.metrics[i].data.at(-1).x;
                if (lastDate != currentDate) {
                    let plusDay = moment(lastDate).add(1, "days").format("MM/DD/YYYY");
                    state.metrics[i].data.push({ x: plusDay, y: 0 });
                    lastDate = state.metrics[i].data.at(-1).x;
                };
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
            localStorage.setItem("userData", fileContents);
        },
        loadFile: (state, action) => {
            const userData = JSON.parse(localStorage.getItem("userData"))

            if (userData) {
                state.metrics = userData.metrics;
                state.categories = userData.categories;
                state.journal = userData.journal;
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
            state.journal = newState.journal;
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
            if (state.metrics.length > 1) {
                for (let i = 0; i < state.metrics.length; i++) {
                    if (state.metrics[i].id === action.payload) {
                        state.metrics.splice(i, 1)
                    }
                }
                for (let i = 0; i < state.categories.length; i++) {  
                    const match = current(state.categories[i].contents).find(data => data === action.payload);
                    const index = state.categories[i].contents.indexOf(match)
                    if (index != -1) {
                        state.categories[i].contents.splice(index, 1)
                    }
                }
            }
        },
        deleteCategory: (state, action) => {
            for (let i = 0; i < state.categories.length; i++) {
                if ((state.categories[i].categoryId === action.payload) && (action.payload != "Dashboard")) {
                    state.categories.splice(i, 1)
                }
            }
        },
        deleteJournal: (state, action) => {
            for (let i = 0; i < state.journal.length; i++) {
                if (state.journal[i].x === action.payload) {
                    state.journal.splice(i, 1)
                }
            }

        },
        deleteAll: (state, action) => {
            state.metrics = initialState.metrics;
            state.categories = initialState.categories;
            state.journal = initialState.journal;
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
        },
        addGoal: (state, action) => {
            for (let i = 0; i < state.metrics.length; i++) {
                if (state.metrics[i].id === action.payload.chartId) {
                    state.metrics[i].goal = action.payload.goal;
                }
            }
        },
        addNote: (state, action) => {
            for (let i = 0; i < state.metrics.length; i++) {
                if (state.metrics[i].id === action.payload.chartId) {
                    for (let e = 0; e < state.metrics[i].data.length; e++) {
                        if (state.metrics[i].data[e].x === action.payload.x) {
                            state.metrics[i].data[e].note = action.payload.note
                        }
                    }
                }
            }
        },
        addJournal: (state, action) => {
            let dataCopy = [...current(state.journal)];
            const lastDate = dataCopy.at(-1);

            if ((moment(action.payload.x).isAfter(lastDate.x))) {
                dataCopy.push(action.payload)
            } else {
                for (let i = 0; i < dataCopy.length; i++) {
                    const next = dataCopy[i + 1]
                    if (dataCopy.at(i).x === action.payload.x) {
                        dataCopy[i] = action.payload
                    } else if ((moment(action.payload.x).isAfter(dataCopy.at(i).x)) && (moment(action.payload.x).isBefore(next.x))) {
                        dataCopy.splice([i + 1], 0, action.payload)
                    }
                }
            }
            state.journal = dataCopy;
        }
    }
});

export const { addDate, updateValue, changeTitle, saveFile, loadFile, exportFile, importFile, addMetric, recentActivity, deleteMetric, deleteCategory, deleteJournal, deleteAll, addCategory, addMetricToCategory, addGoal, addNote, addJournal } = userDataSlice.actions;

export default userDataSlice