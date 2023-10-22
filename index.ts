import dotenv from "dotenv";
import fs from "fs";
import { fetchRoutes, fetchSchedule, fetchShapes, fetchStopTimes, fetchStops, fetchTrips, fetchVehicles } from "./request";

type Route = {
    "agency_id": number,
    "route_id": number,
    "route_short_name": string,
    "route_long_name": string,
    "route_color": string,
    "route_type": number
};

dotenv.config();

const getTranzyData = () => {
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
            new Promise((resolve, reject) => {
                task.fn().then((data) => {
                    return fs.writeFile(`./data/tranzy/${task.name}.json`, JSON.stringify(data, null, 2), () => {
                        console.log("DONE FETCHING " + task.name);
                        resolve();
                    });
                }).catch((error) => {
                    console.log(`ERROR RUNNING TASK "${task.name}"`, error);
                    reject();
                });
            })
        );
    }
    return Promise.all(promises);
};

const getRoutesSchedules = async () => {
    const routes: Route[] = JSON.parse(fs.readFileSync("./data/tranzy/routes.json", "utf8"));
    const routePromises: Promise<void>[] = [];
    for(const route of routes) {
        routePromises.push(
            new Promise((resolve) => {
                fetchSchedule(route.route_short_name).then((data) => {
                    Promise.all([
                        fs.promises.writeFile(`./data/ctp/${route.route_short_name}_lv.csv`, data.lv),
                        fs.promises.writeFile(`./data/ctp/${route.route_short_name}_s.csv`, data.lv),
                        fs.promises.writeFile(`./data/ctp/${route.route_short_name}_d.csv`, data.lv)
                    ]).then(() => resolve());
                }).catch(() => console.log("Schedule not found for route: ", route.route_short_name));
            })
        );
    }
    return Promise.all(routePromises);
};

getTranzyData().then(() => {
    getRoutesSchedules().then(() => {
        console.log("DONE");
    });
});

