import LS2Request from "@enact/webos/LS2Request";

const getRestaurant = () => {
    // find restaurant recommended by host
    let recommend = new Promise((resolve, reject) => {
        new LS2Request().send({
            service: 'com.webos.service.db',
            method: 'find',
            parameters: {
                "query": {
                    "from": "com.trip.info:1",
                    "where": [{
                        "prop": "HostRecommendation",
                        "op": "=",
                        "val": true
                    }]
                },
            },
            onSuccess: (res) => {
                resolve({ status: 'success', data: res.results })
            },
            onFailure: (res) => {
                resolve({ status: 'fail', data: [] })
            }
        })
    })




    // find restaurant not recommended by host
    let notRecommend = new Promise((resolve, reject) => {
        new LS2Request().send({
            service: 'com.webos.service.db',
            method: 'find',
            parameters: {
                "query": {
                    "from": "com.trip.info:1",
                    "where": [{
                        "prop": "HostRecommendation",
                        "op": "!=",
                        "val": true
                    }]
                },
            },
            onSuccess: (res) => {
                // console.log('notRecommend', res.results);
                resolve({ status: 'success', data: res.results })
            },
            onFailure: (res) => {
                // console.log('notRecommend fail', res);
                resolve({ status: 'fail', data: [] })
            }
        })
    })




    return Promise.all([recommend, notRecommend]).then((results) => {
        // console.log('promise all results', results)
        // for test
        return [{status: 'success', data: [{
            Address: 'Test Address', AveragePrice: 100, Distance: 1500, 
            DistanceRate:2, HostRecommendation: true, Latitude: 40.759,
            Longitude: -73.996, Name: 'Test Name', NumberOFCustomer: 8,
            NumberOfRate: 3, PhoneNumber: "None", PlaceID: 'ChIJc87lok1YwokRJzddYNyu9Ys',
            TasterRate:3.5, TotalRate:3.2
        }, {
            Address: 'Test Address2', AveragePrice: 100, Distance: 1500, 
            DistanceRate:2, HostRecommendation: true, Latitude: 40.762,
            Longitude: -73.99658, Name: 'Test Name', NumberOFCustomer: 8,
            NumberOfRate: 3, PhoneNumber: "None", PlaceID: 'ChIJc87lok1YwokRJzddYNyu9Ys',
            TasterRate:3.5, TotalRate:3.2
        }]}, []]
        return results
    })

}

const getAttraction = () => {

}

const getEvent = () => {

}

const putRestaurant = (obj) => {
    let response = new Promise((resolve, reject) => {
        new LS2Request().send({
            service: 'com.webos.service.db',
            method: 'put',
            parameters: {
                "objects": [
                    {
                        "_kind": "com.trip.info:1",
                        "PlaceID": obj.PlaceID,
                        "Name": obj.Name,
                        "Latitude": obj.Latitude,
                        "Longitude": obj.Longitude,
                        "Address": obj.Address,
                        "Distance": obj.Distance,
                        "DistanceRate": 0,
                        "NumberOfRate": 0,
                        "PhoneNumber": obj.PhoneNumber,
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


const testExport = () => {
    console.log('test');
}

export { getRestaurant, getAttraction, getEvent, testExport, putRestaurant }