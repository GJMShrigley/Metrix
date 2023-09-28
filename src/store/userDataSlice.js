import FileSaver from "file-saver";
import * as moment from "moment";
import { createSlice, current } from "@reduxjs/toolkit";

import { tokens } from "../theme";

let currentDate = new Date();

currentDate = moment(currentDate).format("MM/DD/YYYY");

const initialState = {
  categories: [
    {
      categoryId: "Dashboard",
      contents: ["Default Data"],
    },
  ],
  journal: [
    {
      x: `${currentDate}`,
      journal: "",
      display: true,
    },
  ],
  metrics: [
    {
      id: "Default Data",
      color: tokens("dark").redAccent[500],
      data: [
        {
          x: `${currentDate}`,
          y: 0,
        },
      ],
      type: "Scale",
      goal: "",
    },
  ],
  status: "idle",
  error: null,
};

const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    addCategory: (state, action) => {
      const newCategory = {
        categoryId: action.payload,
        contents: [],
      };
      state.categories.push(newCategory);
    },
    addDate: (state, action) => {
      //Find the most recent date listed, increment it by one day until the latest date matches the current date.
      for (let i = 0; i < state.metrics.length; i++) {
        function incrementDate() {
          let lastDate = state.metrics[i].data.at(-1).x;
          if (lastDate !== currentDate) {
            state.metrics[i].data.push({
              x: moment(lastDate).add(1, "days").format("MM/DD/YYYY"),
              y: 0,
            });
            lastDate = state.metrics[i].data.at(-1).x;
            incrementDate();
          }
        }
        incrementDate();
      }
    },
    addGoal: (state, action) => {
      //Find the metric with an id matching the payload id, set the goal according to the payload value.
      for (let i = 0; i < state.metrics.length; i++) {
        if (state.metrics[i].id === action.payload.chartId) {
          state.metrics[i].goal = action.payload.goal;
        }
      }
    },
    addJournal: (state, action) => {
      //Find the date of the most recent journal entry. If the payload date is later, add the payload entry to the end of a copy of the journal array.
      //If the payload date is before the first date in the journal array, add the payload entry to the start of a copy of the journal array.
      //If the payload date is between the first and last dates in the journal array, find the relevant date. If it exists, overwrite the previous entry in a copy of the journal array with the payload entry.
      //If the payload date does not match an existing date in the journal array, find the indexes of the dates before and after the payload date and insert it into a copy of the journal array between those indexes.
      let dataCopy = [...current(state.journal)];
      const lastDate = dataCopy.at(-1);
      if (moment(action.payload.x).isAfter(lastDate.x)) {
        dataCopy.push(action.payload);
      } else if (moment(action.payload.x).isBefore(dataCopy[0].x)) {
        dataCopy.unshift(action.payload);
      } else {
        for (let i = 0; i < dataCopy.length; i++) {
          const next = dataCopy[i + 1];
          if (dataCopy.at(i).x === action.payload.x) {
            dataCopy[i] = action.payload;
          } else if (
            moment(action.payload.x).isAfter(dataCopy.at(i).x) &&
            moment(action.payload.x).isBefore(next.x)
          ) {
            dataCopy.splice([i + 1], 0, action.payload);
          }
        }
      }
      state.journal = dataCopy;
    },
    addMetric: (state, action) => {
      const firstDate = state.metrics[0].data[0].x;
      //If the payload date is in the future, do not update.
      const futureDate = moment(action.payload.values.x).isAfter(currentDate);

      if (futureDate) {
        return;
      }

      //Add a new metric to the state with data beginning from the earliest recorded date.
      const newMetric = {
        id: action.payload.values.metric,
        color: action.payload.color,
        data: [
          {
            x: `${firstDate}`,
            y: 0,
          },
        ],
        type: `${action.payload.typeSelection}`,
      };

      //Add subsequent dates until data has reached the current day.
      function incrementDate() {
        let lastDate = newMetric.data.at(-1).x;
        if (lastDate !== currentDate) {
          newMetric.data.push({
            x: moment(lastDate).add(1, "days").format("MM/DD/YYYY"),
            y: 0,
          });
          lastDate = newMetric.data.at(-1).x;
          incrementDate();
        }
      }
      incrementDate();

      //Update the data with the values entered by the user.
      function addCurrentDate() {
        const dateMatch = newMetric.data.find(
          (data) => data.x === action.payload.values.x
        );
        const index = newMetric.data.indexOf(dateMatch);
        newMetric.data.splice(index, 1, {
          x: `${action.payload.values.x}`,
          y: `${action.payload.values.y}`,
        });
      }
      addCurrentDate();
      //Add the completed new metric to the state.
      state.metrics.push(newMetric);
    },
    addMetricToCategory: (state, action) => {
      const metricsCopy = [...current(state.metrics)];
      const selectionIds = [...action.payload.selectionValues];
      const categoryId = action.payload.categoryId;
      let categoryCopy = [...current(state.categories[categoryId].contents)];

      //For each selected metric, check the selected category. If the metric is already included in the category, remove it. Otherwise, add it to the category.
      selectionIds.forEach((selection) => {
        const found = categoryCopy.includes(metricsCopy[selection].id);

        if (found) {
          const index = categoryCopy.findIndex(
            (element) => element === metricsCopy[selection].id
          );
          categoryCopy.splice(index, 1);
        } else {
          categoryCopy.push(metricsCopy[selection].id);
        }
        state.categories[categoryId].contents = categoryCopy;
      });
    },
    addNote: (state, action) => {
      //Find the metric matching the payload id. Find the date within that metric matching the payload date. Replace the existing note with the payload note.
      for (let i = 0; i < state.metrics.length; i++) {
        if (state.metrics[i].id === action.payload.chartId) {
          for (let e = 0; e < state.metrics[i].data.length; e++) {
            if (state.metrics[i].data[e].x === action.payload.x) {
              state.metrics[i].data[e].note = action.payload.note;
            }
          }
        }
      }
    },
    changeTitle: (state, action) => {
      //If the payload refers to a category, find the relevant category and replace the existing categoryId with the payload value.
      //If the payload refers to a metric, find the relevant metric and replace the existing id with the payload value. The find any categories containing the metric and replace all references to the original id.
      if (action.payload.isCategory) {
        for (let i = 0; i < state.categories.length; i++) {
          if (state.categories[i].categoryId === action.payload.selectionId) {
            state.categories[i].categoryId = action.payload.values;
          }
        }
      } else {
        for (let i = 0; i < state.metrics.length; i++) {
          if (state.metrics[i].id === action.payload.selectionId) {
            state.metrics[i].id = action.payload.values;
          }
        }
        for (let i = 0; i < state.categories.length; i++) {
          const match = current(state.categories[i].contents).find(
            (data) => data === action.payload.selectionId
          );
          const index = state.categories[i].contents.indexOf(match);
          if (index !== -1) {
            state.categories[i].contents[index] = action.payload.values;
          }
        }
      }
    },
    deleteAll: (state, action) => {
      //Return all state values to their initial state.
      state.metrics = initialState.metrics;
      state.categories = initialState.categories;
      state.journal = initialState.journal;
    },
    deleteCategory: (state, action) => {
      //Find the category matching the payload categoryId and remove it from the state. Do not allow for deletion of the 'Dashboard' category.
      for (let i = 0; i < state.categories.length; i++) {
        if (
          state.categories[i].categoryId === action.payload &&
          action.payload !== "Dashboard"
        ) {
          state.categories.splice(i, 1);
        }
      }
    },
    deleteJournal: (state, action) => {
      //If the payload date matches a date in the journal state, remove that date from the journal state.
      for (let i = 0; i < state.journal.length; i++) {
        if (state.journal[i].x === action.payload) {
          state.journal.splice(i, 1);
        }
      }
    },
    deleteMetric: (state, action) => {
      //If the payload id matches an existing id in the state, remove the relevant metric from the state. Ensure 1 or more metrics remain in state and are not deleted.
      if (state.metrics.length > 1) {
        for (let i = 0; i < state.metrics.length; i++) {
          if (state.metrics[i].id === action.payload) {
            state.metrics.splice(i, 1);
          }
        }
        //Find any references to metrics matching the payload id contained within the categories in state. Remove the metric from the category.
        for (let i = 0; i < state.categories.length; i++) {
          const match = current(state.categories[i].contents).find(
            (data) => data === action.payload
          );
          const index = state.categories[i].contents.indexOf(match);
          if (index !== -1) {
            state.categories[i].contents.splice(index, 1);
          }
        }
      }
    },
    exportFile: (state, action) => {
      //Convert the state to JSON and write it to a 'userData.txt' external file.
      const fileContents = JSON.stringify(current(state));
      const file = new File([fileContents], "userData.txt", {
        type: "text/plain;charset=utf-8",
      });
      FileSaver.saveAs(file);
    },
    importFile: (state, action) => {
      //Replace the metrics, categories, and journal data with the contents of the payload.
      //Set 'userData' in localStorage with the contents of the payload.
      const newState = action.payload;
      state.metrics = newState.metrics;
      state.categories = newState.categories;
      state.journal = newState.journal;
      const fileContents = JSON.stringify(current(state));
      localStorage.setItem("userData", fileContents);
    },
    loadFile: (state, action) => {
      //Retrieve 'userData' from the localStorage. If 'userData' exists, replace the metrics, categories, and journal data with the contents of 'userData'. If 'userData' does not exist, display a console message.
      const userData = JSON.parse(localStorage.getItem("userData"));

      if (userData) {
        state.metrics = userData.metrics;
        state.categories = userData.categories;
        state.journal = userData.journal;
      } else {
        console.log("no user data found");
      }
    },
    saveFile: (state, action) => {
      //Set or replace the 'userData' in localStorage with JSON containing the current state.
      const fileContents = JSON.stringify(current(state));
      localStorage.setItem("userData", fileContents);
    },
    updateValue: (state, action) => {
      //Find the metric with an id matching the payload 'selectedMetric'.
      //Replace the 'type' value of the metric with the payload type and color.
      //If the specified date is between the date of the first recorded date and the current day (inclusive), find the data entry with the matching date, and replace it with the payload values.
      for (let i = 0; i < state.metrics.length; i++) {
        if (state.metrics[i].id === action.payload.selectedMetric) {
          state.metrics[i].type = action.payload.type;
          state.metrics[i].color = action.payload.color;
          let dataCopy = [...current(state.metrics[i].data)];
          const firstDate = dataCopy.at(0).x;
          const futureDate = moment(action.payload.values.x).isAfter(
            currentDate
          );
          const pastDate = moment(action.payload.values.x).isBefore(firstDate);

          if (futureDate || pastDate) {
            return;
          }

          function addCurrentDate() {
            const dateMatch = dataCopy.find(
              (data) => data.x === action.payload.values.x
            );
            const index = dataCopy.indexOf(dateMatch);
            state.metrics[i].data.splice(index, 1, action.payload.values);
          }
          addCurrentDate();
        }
      }
    },
  },
});

export const {
  addCategory,
  addDate,
  addGoal,
  addJournal,
  addMetric,
  addMetricToCategory,
  addNote,
  changeTitle,
  deleteAll,
  deleteCategory,
  deleteJournal,
  deleteMetric,
  exportFile,
  importFile,
  loadFile,
  saveFile,
  updateValue,
} = userDataSlice.actions;

export default userDataSlice;
