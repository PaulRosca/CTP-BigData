export const routeType = (route: string) => {
    if(route.startsWith("M")) {
        return "linii-metropolitane";
    }
    else if(route.includes("E")) {
        return "linie-expres";
    }
    else if(route.endsWith("N")) {
        return "transport-noapte";
    }
    else {
        return "linii-urbane";
    }
};
