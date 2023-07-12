import { tokens } from "../theme";
import * as moment from "moment"

export const mockUserData = 

[{"id":"Words Written","color":"#f8dcdb","data":
[{"x":"06/20/2023","y":1000},
{"x":"06/21/2023","y":203},
{"x":"06/22/2023","y":1200},
{"x":"06/23/2023","y":1},
{"x":"06/24/2023","y":1490},
{"x":"06/25/2023","y":587},
{"x":"06/26/2023","y":960},
{"x":"06/27/2023","y":100},
{"x":"06/28/2023","y":0},
{"x":"06/29/2023","y":10},
{"x":"06/30/2023","y":10}]}]

//     {
//         id: "Words Written",
//         color: tokens("dark").redAccent[100],
//         data: [
//             {
//                 x: "06/20/2023",
//                 y: 1000,
//             },
//             {
//                 x: "06/21/2023",
//                 y: 203,
//             },
//             {
//                 x: "06/22/2023",
//                 y: 1200,
//             },
//             {
//                 x: "06/23/2023",
//                 y: 1,
//             },
//             {
//                 x: "06/24/2023",
//                 y: 1490,
//             },
//             {
//                 x: "06/25/2023",
//                 y: 587,
//             },
//             {
//                 x: "06/26/2023",
//                 y: 960,
//             },
//             {
//                 x: "06/27/2023",
//                 y: 100,
//             },
//         ],
//     },
//     {
//         id: "Minutes Exercised",
//         color: tokens("dark").blueAccent[100],
//         data: [
//             {
//                 x: "06/20/2023",
//                 y: 30,
//             },
//             {
//                 x: "06/21/2023",
//                 y: 200,
//             },
//             {
//                 x: "06/22/2023",
//                 y: 10,
//             },
//             {
//                 x: "06/23/2023",
//                 y: 40,
//             },
//             {
//                 x: "06/24/2023",
//                 y: 0,
//             },
//             {
//                 x: "06/25/2023",
//                 y: 5,
//             },
//             {
//                 x: "06/26/2023",
//                 y: 90,
//             },
//             {
//                 x: "06/27/2023",
//                 y: 10,
//             },
//         ]
//     }
// ];

let lastDate = mockUserData[0].data.at(-1);

const currentDate = (new Date());

const yesterdayDate = moment(currentDate).subtract(1,"days").format("MM/DD/YYYY");

const addDate = (lastDate) => {
    let lastDateArray = lastDate.x.split("/")
    const year = lastDateArray.pop();
    lastDateArray.unshift(year);

    let plusOne = moment(lastDateArray).add(1, "days").subtract(1, "months").format("MM/DD/YYYY");
    mockUserData[0].data.push({ x: plusOne, y: 0 });
    lastDate = mockUserData[0].data.at(-1);

    if (yesterdayDate.toString() !== lastDate.x.toString()) {
        addDate(lastDate);
    }
};

if (yesterdayDate.toString() !== lastDate.x.toString()) {
    // addDate(lastDate);
    console.log(mockUserData)
}
