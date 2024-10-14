import * as moment from "moment";
import {
  createSlice,
  current
} from "@reduxjs/toolkit";
import {
  Encoding,
  Filesystem,
  Directory
} from '@capacitor/filesystem';

import {
  tokens
} from "../theme";

let currentDate = new Date();

currentDate = moment(currentDate).format("MM/DD/YYYY");

const initialState = {
  categories: [{
    categoryId: "Dashboard",
    contents: [
      "Default Data"
    ],
  }, ],
  journal: [{
    x: `${currentDate
      }`,
    journal: "",
    display: true,
  }, ],
  metrics: [{
    id: "Default Data",
    color: tokens("dark").redAccent[
      500
    ],
    data: [{
      x: `${currentDate
          }`,
      y: 0,
      times: [],
      goal: 0,
      goalType: "High"
    }, ],
    type: "Scale",
  }, ]
};

const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    addCategory: (state, action) => {
      //If a category with the payload title exists, do not update.
      const titleMatch = state.categories.find(
        (category) => category.categoryId === action.payload
      );

      if (titleMatch) {
        alert("A category with that name already exists.");
        return;
      }

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
              x: moment(lastDate).add(1,
                "days").format("MM/DD/YYYY"),
              y: 0,
              times: [],
              goal: state.metrics[i].data.at(-1).goal,
              goalType: state.metrics[i].data.at(-1).goalType
            });
            lastDate = state.metrics[i].data.at(-1).x;
            incrementDate();
          }
        }
        incrementDate();
      }
    },
    addGoal: (state, action) => {
      
      //Find the metric with an id matching the payload id, find the day matching the payload date value, set the goal according to the payload goal value.
       for (let i = 0; i < state.metrics.length; i++) {
         if (state.metrics[i].id === action.payload.chartId) {
            const metric = state.metrics[i].data
           const dateMatch = metric.find(
              data => data.x === action.payload.x
          )
           const index = state.metrics[i].data.indexOf(dateMatch);
          state.metrics[i].data[index].goal = action.payload.goal;
          state.metrics[i].data[index].goalType = action.payload.goalType;
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
      } else if (moment(action.payload.x).isBefore(dataCopy[
          0
        ].x)) {
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
            dataCopy.splice([i + 1],
              0, action.payload);
          }
        }
      }
      state.journal = dataCopy;
    },
    addMetric: (state, action) => {
      const firstDate = state.metrics[
        0
      ].data[
        0
      ].x;
      //If the payload date is in the future, or a metric with the payload title exists, do not update.
      const futureDate = moment(action.payload.values.x).isAfter(currentDate);
      const titleMatch = state.metrics.find(
        (metric) => metric.id === action.payload.values.metric
      );

      if (futureDate) {
        return;
      }

      if (titleMatch) {
        alert("A metric with that name already exists.");
        return;
      }
      //Add a new metric to the state with data beginning from the earliest recorded date.
      const newMetric = {
        id: action.payload.values.metric,
        color: action.payload.color,
        data: [{
          x: `${firstDate
              }`,
          y: 0,
          times: [],
          goal: 0,
          goalType: "High"
        }, ],
        type: `${action.payload.typeSelection}`,
        total: action.payload.typeSelection === "Number" ? `${action.payload.totalSelection}` : "Average"
      };

      //Add subsequent dates until data has reached the current day.
      function incrementDate() {
        let lastDate = newMetric.data.at(-1).x;
        if (lastDate !== currentDate) {
          newMetric.data.push({
            x: moment(lastDate).add(1,
              "days").format("MM/DD/YYYY"),
            y: 0,
            times: [],
            goal: lastDate.goal,
            goalType: lastDate.goalType
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
        const time = moment(new Date()).format("kk:mm");
        let lastDate = newMetric.data.at(-1);
        newMetric.data.splice(index,
          1, {
            x: `${action.payload.values.x
          }`,
            y: `${action.payload.values.y
          }`,
            times: [{
                   x: time,
                   y: action.payload.values.y
                 }],
                  goal: lastDate.goal,
                  goalType: lastDate.goalType
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
          categoryCopy.splice(index,
            1);
        } else {
          categoryCopy.push(metricsCopy[selection].id);
        }
        state.categories[categoryId].contents = categoryCopy;
      });
    },
    changeTitle: (state, action) => {
      //If the payload refers to a category, find the relevant category and replace the existing categoryId with the payload value.
      //If the payload refers to a metric, find the relevant metric and replace the existing id with the payload value. The find any categories containing the metric and replace all references to the original id.
      if (action.payload.isCategory) {
        const titleMatch = state.categories.find(
          (category) => category.categoryId === action.payload.values
        );
        if (!titleMatch) {
          for (let i = 0; i < state.categories.length; i++) {
            if (state.categories[i].categoryId === action.payload.selectionId) {
              state.categories[i].categoryId = action.payload.values;
            }
          }
        } else {
          alert("A category with that name already exists.");
          return;
        }
      } else {
        const titleMatch = state.metrics.find(
          (metric) => metric.id === action.payload.values
        );
        if (titleMatch) {
          alert("A metric with that name already exists.");
          return;
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
          state.categories.splice(i,
            1);
        }
      }
    },
    deleteJournal: (state, action) => {
      //If the payload date matches a date in the journal state, remove that date from the journal state.
      for (let i = 0; i < state.journal.length; i++) {
        if (state.journal[i].x === action.payload) {
          state.journal.splice(i,
            1);
        }
      }
    },
    deleteMetric: (state, action) => {
      //If the payload id matches an existing id in the state, remove the relevant metric from the state. Ensure 1 or more metrics remain in state and are not deleted.
      if (state.metrics.length > 1) {
        for (let i = 0; i < state.metrics.length; i++) {
          if (state.metrics[i].id === action.payload) {
            state.metrics.splice(i,
              1);
          }
        }
        //Find any references to metrics matching the payload id contained within the categories in state. Remove the metric from the category.
        for (let i = 0; i < state.categories.length; i++) {
          const match = current(state.categories[i].contents).find(
            (data) => data === action.payload
          );
          const index = state.categories[i].contents.indexOf(match);
          if (index !== -1) {
            state.categories[i].contents.splice(index,
              1);
          }
        }
      }
    },
    exportFile: (state, action) => {
      //Convert the state to JSON and write it to a 'userData.txt' external file in the user's device storage.
      const fileContents = JSON.stringify(current(state));

      const saveFile = async (fileContents) => {
        await Filesystem.writeFile({
          path: '/MetrixData.txt',
          data: fileContents,
          directory: Directory.Documents,
          encoding: Encoding.UTF8,
        });
      };
      saveFile(fileContents)
    },
    importFile: (state, action) => {
      //Replace the metrics, categories, and journal data with the contents of the payload.
      //Set 'userData' in localStorage with the contents of the payload.
      const newState = JSON.parse(action.payload.data)
  
      state.metrics = [...newState.metrics];
      state.categories = [...newState.categories];
      state.journal = [...newState.journal];
    },
    loadFile: (state, action) => {
      //Retrieve 'userData' from the Ionic Storage. If 'userData' exists, replace the metrics, categories, and journal data with the contents of 'userData'.
      const userData = action.payload;

      if (userData) {
        state.metrics = userData.metrics;
        state.categories = userData.categories;
        state.journal = userData.journal;
      }
    },
    updateValue: (state, action) => {
      //Find the metric with an id matching the payload 'selectedMetric'.
      //Replace the 'type' value of the metric with the payload type and color.
      //If the specified date is between the date of the first recorded date and the current day (inclusive), find the data entry with the matching date, and replace it with the payload values.

      for (let i = 0; i < state.metrics.length; i++) {
        if (state.metrics[i].id === action.payload.selectedMetric) {
          state.metrics[i].type = action.payload.type;
          if (state.metrics[i].type === "Number") {
            state.metrics[i].total = action.payload.total;
          } else {
            state.metrics[i].total = "Average";
          }
          
          state.metrics[i].color = action.payload.color;
          let dataCopy = [...current(state.metrics[i].data)];
          const firstDate = dataCopy.at(0).x;
          const currentDateTime = moment(currentDate).local().format("MM/DD/YYYY kk:mm");;
          const futureDate = moment(action.payload.values.x).isAfter(
            currentDateTime
          );
          const pastDate = moment(action.payload.values.x).isBefore(firstDate);

          if (futureDate || pastDate) {
            return;
          }

          function averageValue(arr) {
            if (state.metrics[i].total === "Average") {
                let mean = arr.reduce((tot, cur) => {
              return tot + parseInt(cur.y)
            }, 0);
            return Math.round(mean / arr.length);
            } else {
              let total = arr.reduce((tot, cur) => {
                return tot + parseInt(cur.y);
              }, 0)
              return total;
            } 
          
          }

          function newValues(index, payload) {
            
            const loggedTime = moment(payload.x).format("kk:mm");
            const oldValues = {...state.metrics[i].data[index]}
            const timeMatch = oldValues.times.find(
              (timestamp) => timestamp.x === loggedTime
            )
      
            if (oldValues.times === undefined ) {
              oldValues.times.push({
                x: loggedTime,
                y: payload.y
              })
            }
            else if (oldValues.times.length > 0 && !timeMatch) {
              const oldTimes = [...current(state.metrics[i].data[index].times)]
              const lastValue = oldTimes.at(-1);
              const firstValue = oldTimes[0];
              const lastTime = moment(lastValue.x, "kk:mm");
              const firstTime = moment(firstValue.x, "kk:mm");
              if (moment(loggedTime, "kk:mm").isAfter(lastTime)) {
                oldValues.times.push({
                  x: loggedTime,
                  y: payload.y,
                  note: payload.note
                })
              } else if (moment(loggedTime, "kk:mm").isBefore(firstTime)) {
                  oldValues.times.unshift({
                    x: loggedTime,
                    y: payload.y,
                    note: payload.note
                  });
              } else {
                for (let i = 0; i <  oldValues.times.length; i++) {
                  const next =  oldValues.times[i + 1];
                  if ( oldValues.times.at(i).x === loggedTime) {
                     oldValues.times[i] = {
                      x: loggedTime,
                      y: payload.y,
                      note: payload.note
                    };
                  } else if (
                    moment(loggedTime, "kk:mm").isAfter( oldValues.times.at(i).x) &&
                    moment(loggedTime, "kk:mm").isBefore(next.x)
                  ) {
                     oldValues.times.splice([i + 1],
                      0, action.payload);
                  }
                }
              }
            } else {
              const index = oldValues.times.indexOf(timeMatch)
              oldValues.times.splice(index, 1, {
                x: loggedTime,
                y: payload.y,
                note: payload.note
              })
            }
            state.metrics[i].data[index].y = averageValue(oldValues.times);
            
          }

          function addCurrentDate() {
            const dateMatch = dataCopy.find(
              (data) => data.x === moment(action.payload.values.x).format("MM/DD/YYYY")
            );
            const index = dataCopy.indexOf(dateMatch);
            newValues(index, action.payload.values)
          }
          addCurrentDate();
        }
      }
    },
  }
});

export const {
  addCategory,
  addDate,
  addGoal,
  addJournal,
  addMetric,
  addMetricToCategory,
  changeTitle,
  deleteAll,
  deleteCategory,
  deleteJournal,
  deleteMetric,
  exportFile,
  importFile,
  loadFile,
  updateValue,
} = userDataSlice.actions;

export default userDataSlice;