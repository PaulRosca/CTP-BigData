import dotenv from "dotenv";
import fs from "fs";
import { fetchRoutes, fetchShapes, fetchStopTimes, fetchStops, fetchTrips, fetchVehicles } from "./request";

dotenv.config();

const promises: Promise<void>[] = [];
const tasks = [
    {
        name: "vehicles",
        fn: fetchVehicles
    },
    {
        name: "routes",
        fn: fetchRoutes
    },
    {
        name: "trips",
        fn: fetchTrips
    },
    {
        name: "shapes",
        fn: fetchShapes
    },
    {
        name: "stops",
        fn: fetchStops
    },
    {
        name: "stop_times",
        fn: fetchStopTimes
    }
];
for(const task of tasks) {
    promises.push(
        new Promise((resolve) => {
            task.fn().then((data) => {
                return fs.writeFile(`./data/${task.name}.json`, JSON.stringify(data, null, 2), () => {
                    console.log("DONE FETCHING " + task.name);
                    resolve();
                });
            });
        })
    );
}
Promise.all(promises).then(() => console.log("DONE"));
