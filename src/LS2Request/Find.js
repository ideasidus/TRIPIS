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
        // return [{status: 'success', data: [{
        //     Address: 'Test Address', AveragePrice: 100, Distance: 1000, 
        //     DistanceRate:2, HostRecommendation: true, Latitude: 35.8709543,
        //     Longitude: 128.598092, Name: 'Novotel Ambassador Daegu', NumberOFCustomer: 8,
        //     NumberOfRate: 3, PhoneNumber: "None", PlaceID: 'ChIJyychK8XjZTURs6UKGVhF1-s',
        //     TasterRate:3.5, TotalRate:4
        // }, {
        //     Address: 'Test Address2', AveragePrice: 100, Distance: 1500, 
        //     DistanceRate:2, HostRecommendation: true, Latitude: 35.8674918,
        //     Longitude: 128.5966119, Name: '배스킨라빈스 대구동인', NumberOFCustomer: 8,
        //     NumberOfRate: 3, PhoneNumber: "None", PlaceID: 'ChIJgd5ZPcTjZTURhIDk2qKpq5A',
        //     TasterRate:3.5, TotalRate:3.2
        // }]}, []]

        return results
    })

}

export const findAttraction = () => {
}

export const findEvent = () => {
}

export const findRestaurantReview = () => {
    // find restaurant recommended by host
    let reviewData = new Promise((resolve, reject) => {
        new LS2Request().send({
            service: 'com.webos.service.db',
            method: 'find',
            parameters: {
                "query": {
                    "from": "com.trip.info:4"
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

    return Promise.all([reviewData]).then((results) => {
        // return [{status: 'success', data: [{
        //     "PlaceID": "0",
        //     "UserName": "asdf",
        //     "TasteRate": "5",
        //     "DistanceRate": "4",
        //     "TotalRate": "3"
        // },{
        //     "PlaceID": "0",
        //     "UserName": "zxcv",
        //     "TasteRate": "3",
        //     "DistanceRate": "4",
        //     "TotalRate": "5"
        // },{
        //     "PlaceID": "1",
        //     "UserName": "qwerty",
        //     "TasteRate": "1",
        //     "DistanceRate": "1",
        //     "TotalRate": "1"
        // }]}, []]
        console.log(results)
        return results
    })
}