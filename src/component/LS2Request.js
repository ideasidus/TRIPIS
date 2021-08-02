import LS2Request from "@enact/webos/LS2Request";

const getRestaurant = () => {
    new LS2Request().send({
        service: 'com.webos.service.db',
        method: 'putKind',
        parameters: {
            "id": "com.trip.info:1",
            "owner": "com.tripis.app",
            "schema": {
                "type": "object",
                "properties": {
                    "PlaceID": { "type": "string" },
                    "Name": { "type": "string" },
                    "Latitude": { "type": "number" },
                    "Longitude": { "type": "number" },
                    "Address": { "type": "string" },
                    "Distance": { "type": "number" },
                    "DistanceRate": { "type": "number" },
                    "NumberOfRate": { "type": "number" },
                    "PhoneNumber": { "type": "string" },
                    "TasteRate": { "type": "number" },
                    "TotalRate": { "type": "number" },
                    "AveragePrice": { "type": "number" },
                    "NumberOFCustomer": { "type": "number" },
                    "HostRecommendation": { "type": "boolean" }
                }
            },
            "indexes": [
                {
                    "name": "indexPlaceID",
                    "props": [{ "name": "PlaceID" }]
                },
                {
                    "name": "indexName",
                    "props": [{ "name": "Name" }]
                },
                {
                    "name": "indexDistance",
                    "props": [{ "name": "Distance" }]
                },
                {
                    "name": "indexDistanceRate",
                    "props": [{ "name": "DistanceRate" }]
                },
                {
                    "name": "indexNumberOfRate",
                    "props": [{ "name": "NumberOfRate" }]
                },
                {
                    "name": "indexTasteRate",
                    "props": [{ "name": "TasteRate" }]
                },
                {
                    "name": "indexTotalRate",
                    "props": [{ "name": "TotalRate" }]
                },
                {
                    "name": "indexAveragePrice",
                    "props": [{ "name": "AveragePrice" }]
                },
                {
                    "name": "indexNumberOfCustomer",
                    "props": [{ "name": "NumberOFCustomer" }]
                },
                {
                    "name": "indexHostRecommendation",
                    "props": [{ "name": "HostRecommendation" }]
                }
            ]
        },
        onSuccess: (res) => {
            console.log('\t', res.results);
            return res.results;
        },
        onFailure: (res) => {
            console.log('\t', res);
        }
    })
}

const getAttraction = () => {
    new LS2Request().send({
        service: 'com.webos.service.db',
        method: 'putKind',
        parameters: {
            "id": "com.trip.info:2",
            "owner": "com.tripis.app",
            "schema": {
                "type": "object",
                "properties": {
                    "PlaceID": { "type": "string" },
                    "Name": { "type": "string" },
                    "Latitude": { "type": "number" },
                    "Longitude": { "type": "number" },
                    "Address": { "type": "string" },
                    "Distance": { "type": "number" },
                    "DistanceRate": { "type": "number" },
                    "NumberOfRate": { "type": "number" },
                    "PhoneNumber": { "type": "string" },
                    "ReservationRequired": { "type": "boolean" },
                    "SatisfactionRate": { "type": "number" },
                    "TotalRate": { "type": "number" },
                    "Fees": { "type": "boolean" },
                    "HostRecommendation": { "type": "boolean" }
                }
            },
            "indexes": [
                {
                    "name": "indexPlaceID",
                    "props": [{ "name": "PlaceID" }]
                },
                {
                    "name": "indexName",
                    "props": [{ "name": "Name" }]
                },
                {
                    "name": "indexDistance",
                    "props": [{ "name": "Distance" }]
                },
                {
                    "name": "indexDistanceRate",
                    "props": [{ "name": "DistanceRate" }]
                },
                {
                    "name": "indexNumberOfRate",
                    "props": [{ "name": "NumberOfRate" }]
                },
                {
                    "name": "indexReservationRequired",
                    "props": [{ "name": "ReservationRequired" }]
                },
                {
                    "name": "indexSatisfactionRate",
                    "props": [{ "name": "SatisfactionRate" }]
                },
                {
                    "name": "indexTotalRate",
                    "props": [{ "name": "TotalRate" }]
                },
                {
                    "name": "indexFees",
                    "props": [{ "name": "Fees" }]
                },
                {
                    "name": "indexHostRecommendation",
                    "props": [{ "name": "HostRecommendation" }]
                }
            ]
        },
        onSuccess: (res) => {
            console.log('\t', res.results);
            return res.results;
        },
        onFailure: (res) => {
            console.log('\t', res);
        }
    })
}

const getEvent = () => {
    new LS2Request().send({
        service: 'com.webos.service.db',
        method: 'putKind',
        parameters: {
            "id": "com.trip.info:3",
            "owner": "com.tripis.app",
            "schema": {
                "type": "object",
                "properties": {
                    "PlaceID": { "type": "string" },
                    "Name": { "type": "string" },
                    "Latitude": { "type": "number" },
                    "Longitude": { "type": "number" },
                    "Address": { "type": "string" },
                    "Distance": { "type": "number" },
                    "UserName": { "type": "string" },
                    "Password": { "type": "string" },
                    "DistanceRate": { "type": "number" },
                    "ReservationRequired": { "type": "boolean" },
                    "SatisfactionRate": { "type": "number" },
                    "TotalRate": { "type": "number" },
                    "Fees": { "type": "boolean" },
                    "HostRecommendation": { "type": "boolean" }
                }
            },
            "indexes": [
                {
                    "name": "indexPlaceID",
                    "props": [{ "name": "PlaceID" }]
                },
                {
                    "name": "indexName",
                    "props": [{ "name": "Name" }]
                },
                {
                    "name": "indexDistance",
                    "props": [{ "name": "Distance" }]
                },
                {
                    "name": "indexDistanceRate",
                    "props": [{ "name": "DistanceRate" }]
                },
                {
                    "name": "indexReservationRequired",
                    "props": [{ "name": "ReservationRequired" }]
                },
                {
                    "name": "indexSatisfactionRate",
                    "props": [{ "name": "SatisfactionRate" }]
                },
                {
                    "name": "indexTotalRate",
                    "props": [{ "name": "TotalRate" }]
                },
                {
                    "name": "indexFees",
                    "props": [{ "name": "Fees" }]
                },
                {
                    "name": "indexHostRecommendation",
                    "props": [{ "name": "HostRecommendation" }]
                }
            ]
        },
        onSuccess: (res) => {
            console.log('\t', res.results);
            return res.results;
        },
        onFailure: (res) => {
            console.log('\t', res);
        }
    })
}

const testExport = () => {
    console.log('test');
}

export { getRestaurant, getAttraction, getEvent, testExport }