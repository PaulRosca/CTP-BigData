const CTP_ID = "2";
const BASE_URL = "https://api.tranzy.dev/v1/opendata";
const fetchHelper = async (url: string) => {
    const response = await fetch(BASE_URL + url, {
        headers: {
            Accept: "application/json",
            "X-Agency-Id": CTP_ID,
            "X-API-KEY": process.env["X-API-KEY"] || ""
        }
    });

    if(!response.ok) {
        throw new Error(response.statusText);
    }

    return await response.json();
};

export const fetchVehicles = () => {
    return fetchHelper("/vehicles");
};

export const fetchRoutes = () => {
    return fetchHelper("/routes");
};

export const fetchTrips = () => {
    return fetchHelper("/trips");
};

export const fetchShapes = () => {
    return fetchHelper("/shapes");
};

export const fetchStops = () => {
    return fetchHelper("/stops");
};

export const fetchStopTimes = () => {
    return fetchHelper("/stop_times");
};
