import LS2Request from "@enact/webos/LS2Request";

export const putRestaurant = (obj) => {
    let response = new Promise((resolve, reject) => {
        new LS2Request().send({
            service: 'com.webos.service.db',
            method: 'put',
            parameters: {
                "objects": [
                    {
                        "_kind": "com.trip.info:1",
                        "PlaceID": obj.place_id,
                        "Name": obj.name,
                        "Latitude": obj.geometry.location.lat(),
                        "Longitude": obj.geometry.location.lng(),
                        "Address": obj.address,
                        "Distance": obj.distance,
                        "DistanceRate": 0,
                        "NumberOfRate": 0,
                        "PhoneNumber": obj.phone,
                        "TasteRate": 0,
                        "AveragePrice": 0,
                        "NumberOFCustomer": 0,
                        "TotalRate": 0,
                        "HostRecommendation": false,
                        "_kind": "com.trip.info:1"
                    }
                ]
            },
            onSuccess: (res) => {
                resolve({ status: 'success' })
            },
            onFailure: (res) => {
                resolve({ status: 'fail' })
            }
        })
    })

    return response;
}

export const putRestaurantReview = (obj) => {
    let response = new Promise((resolve, reject) => {
        console.log(obj)
        new LS2Request().send({
            service: 'com.webos.service.db',
            method: 'put',
            parameters: {
                "objects": [
                    {
                        "PlaceID": obj.PlaceID,
                        "DistanceRate": obj.DistanceRate,
                        "UserName": obj.UserName,
                        "Password": obj.Password,
                        "TasteRate": obj.TasteRate,
                        "TotalRate": obj.TotalRate,
                        "TotalPrice": obj.TotalPrice,
                        "NumberOfCustomer": obj.NumberOfCustomer,
                        "_kind": "com.trip.info:4"
                    }
                ]
            },
            onSuccess: (res) => {
                console.log('\t', res.results);
                resolve({ status: 'success' })
            },
            onFailure: (res) => {
                console.log('\t', res);
                resolve({ status: 'fail' })
            }
        })
    })

    return response;
}

/************ Attraction ***********/
export const putAttraction = (obj) => {
    
    let response = new Promise((resolve, reject) => {
        new LS2Request().send({
            service: 'com.webos.service.db',
            method: 'put',
            parameters: {
                "objects": [
                    {
                        "PlaceID": obj.place_id,
                        "Name": obj.name,
                        "Latitude": obj.geometry.location.lat(),
                        "Longitude": obj.geometry.location.lng(),
                        "Address": obj.address,
                        "Distance": obj.distance,
                        "DistanceRate": 0,
                        "NumberOfRate": 0,
                        "PhoneNumber": obj.phone,
                        "ReservationRequired": false,
                        "SatisfactionRate": 0,
                        "TotalRate": 0,
                        "Fees": false,
                        "HostRecommendation": false,
                        "_kind": "com.trip.info:2"
                    }
                ]
            },
            onSuccess: (res) => {
                resolve({ status: 'success' })
            },
            onFailure: (res) => {
                resolve({ status: 'fail' })
            }
        })
    })

    return response;
}