import { routeType } from "./utils";

const CTP_ID = "2";
const TRANZY_BASE_URL = "https://api.tranzy.dev/v1/opendata";
const CTP_BASE_URL = "https://ctpcj.ro/orare/csv";

type Header = {
    [index: string]: string
};

type Schedule = {
    lv: string,
    s: string,
    d: string
};

const fetchHelper = async (url: string, headers?: Header, returnType: "json" | "text" = "json") => {
    const response = await fetch(url, { headers });

    if (!response.ok) {
        throw new Error(response.statusText);
    }
    if (returnType === "json") {
        return await response.json();
    } else {
        return await response.text();
    }
};

const tranzyFetchHelper = (url: string) => {
    return fetchHelper(TRANZY_BASE_URL + url, {
        Accept: "application/json",
        "X-Agency-Id": CTP_ID,
        "X-API-KEY": process.env["X-API-KEY"] || ""
    });
};

const ctpFetchHelper = (route: string) => {
    return fetchHelper(CTP_BASE_URL + `/orar_${route}_lv.csv`, {
        Referer: `https://ctpcj.ro/index.php/ro/orare-linii/${routeType(route)}/linia${route}`
    }, "text");
};

export const fetchVehicles = () => {
    return tranzyFetchHelper("/vehicles");
};

export const fetchRoutes = () => {
    return tranzyFetchHelper("/routes");
};

export const fetchTrips = () => {
    return tranzyFetchHelper("/trips");
};

export const fetchShapes = () => {
    return tranzyFetchHelper("/shapes");
};

export const fetchStops = () => {
    return tranzyFetchHelper("/stops");
};

export const fetchStopTimes = () => {
    return tranzyFetchHelper("/stop_times");
};

export const fetchSchedule = async (route: string): Promise<Schedule> => {
    return {
        lv: (await ctpFetchHelper(route)) as string,
        s: (await ctpFetchHelper(route)) as string,
        d: (await ctpFetchHelper(route)) as string,
    };
};
