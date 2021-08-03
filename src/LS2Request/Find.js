import LS2Request from "@enact/webos/LS2Request";


export const findRestaurant = () => {
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

        // for test
        return [{status: 'success', data: [{
            Address: 'Test Address', AveragePrice: 100, Distance: 1000, 
            DistanceRate:2, HostRecommendation: true, Latitude: 40.759,
            Longitude: -73.996, Name: 'Test Name', NumberOFCustomer: 8,
            NumberOfRate: 3, PhoneNumber: "None", PlaceID: 'ChIJc87lok1YwokRJzddYNyu9Ys',
            TasterRate:3.5, TotalRate:4
        }, {
            Address: 'Test Address2', AveragePrice: 100, Distance: 1500, 
            DistanceRate:2, HostRecommendation: true, Latitude: 40.762,
            Longitude: -73.99658, Name: 'Test Name2', NumberOFCustomer: 8,
            NumberOfRate: 3, PhoneNumber: "None", PlaceID: 'ChIJc87lok1YwokRJzddYNyu9Ys2',
            TasterRate:3.5, TotalRate:3.2
        }]}, []]

        return results
    })

}

export const findAttraction = () => {
}

export const findEvent = () => {
}
