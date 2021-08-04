import LS2Request from "@enact/webos/LS2Request";

export const findCenter = () => {
    return new Promise((resolve, reject) => {
        new LS2Request().send({
            service: 'com.webos.service.db',
            method: 'find',
            parameters: {
                "query":{
                    "from":"com.trip.info:6"
                        }
            },
            onSuccess: (res) => {
                resolve({ status: 'success', data: res.results })
            },
            onFailure: (res) => {
                //for test
                // resolve( { status: 'success', data: {
                //     Latitude: 35.8692386, Longitude: 128.5919156, 
                //     PlaceID:'testPlaceID', 
                //     Name:'test', Address:'testAddress', 
                //     PhoneNumber:'TestPhoneNumber' }})

                resolve({ status: 'fail', data: [] })
            }
        })
    })
}

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
                resolve({ status: 'success', data: res.results })
            },
            onFailure: (res) => {
                resolve({ status: 'fail', data: [] })
            }
        })
    })




    return Promise.all([recommend, notRecommend]).then((results) => {

        // for test
        // return [{
        //     status: 'success', data: [{
        //         Address: 'Test Address', AveragePrice: 100, Distance: 1000,
        //         DistanceRate: 2, HostRecommendation: true, Latitude: 35.8709543,
        //         Longitude: 128.598092, Name: 'Novotel Ambassador Daegu', NumberOFCustomer: 8,
        //         NumberOfRate: 3, PhoneNumber: "None", PlaceID: 'ChIJyychK8XjZTURs6UKGVhF1-s',
        //         TasterRate: 3.5, TotalRate: 4
        //     }, {
        //         Address: 'Test Address2', AveragePrice: 100, Distance: 1500,
        //         DistanceRate: 2, HostRecommendation: true, Latitude: 35.8674918,
        //         Longitude: 128.5966119, Name: '배스킨라빈스 대구동인', NumberOFCustomer: 8,
        //         NumberOfRate: 3, PhoneNumber: "None", PlaceID: 'ChIJgd5ZPcTjZTURhIDk2qKpq5A',
        //         TasterRate: 3.5, TotalRate: 3.2
        //     }]
        // }, []]

        return results
    })

}

export const findAttraction = () => {
    let recommend = new Promise((resolve, reject) => {
        new LS2Request().send({
            service: 'com.webos.service.db',
            method: 'find',
            parameters: {
                "query": {
                    "from": "com.trip.info:2",
                    "where": [{
                        "prop": "HostRecommendation",
                        "op": "=",
                        "val": true
                    }]
                }
            },
            onSuccess: (res) => {
                resolve({ status: 'success', data: res.results })
            },
            onFailure: (res) => {
                resolve({ status: 'fail', data: [] })
            }
        })
    })

    let notRecommend = new Promise((resolve, reject) => {
        new LS2Request().send({
            service: 'com.webos.service.db',
            method: 'find',
            parameters: {
                "query": {
                    "from": "com.trip.info:2",
                    "where": [{
                        "prop": "HostRecommendation",
                        "op": "!=",
                        "val": true
                    }]
                }
            },
            onSuccess: (res) => {
                resolve({ status: 'success', data: res.results })
            },
            onFailure: (res) => {
                resolve({ status: 'fail', data: [] })
            }
        })
    })

    return Promise.all([recommend, notRecommend]).then((results) => {
        //for test
        // return [{
        //     status: 'success', data: [{
        //         Address: 'Test Address', AveragePrice: 100, Distance: 1000,
        //         DistanceRate: 2, HostRecommendation: true, Latitude: 35.86926,
        //         Longitude: 128.6050364, Name: 'National Bond Compensation Movement Memorial Park', NumberOFCustomer: 8,
        //         NumberOfRate: 3, PhoneNumber: "None", PlaceID: 'ChIJzaeJxonhZTURTBQJ3QyYmjw',
        //         TasterRate: 3.5, TotalRate: 4
        //     }, {
        //         Address: 'Test Address2', AveragePrice: 100, Distance: 1500,
        //         DistanceRate: 2, HostRecommendation: true, Latitude: 35.8596038,
        //         Longitude: 128.596001, Name: '대구향교', NumberOFCustomer: 8,
        //         NumberOfRate: 3, PhoneNumber: "None", PlaceID: 'ChIJ1_tDJbnjZTURL7vyjp7UY0o',
        //         TasterRate: 3.5, TotalRate: 3.2
        //     }]
        // }, []]

        return results;
    })

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
        //     "PlaceID": "ChIJyychK8XjZTURs6UKGVhF1-s",
        //     "UserName": "asdf",
        //     "TasteRate": "5",
        //     "DistanceRate": "4",
        //     "TotalRate": "3"
        // },{
        //     "PlaceID": "ChIJyychK8XjZTURs6UKGVhF1-s",
        //     "UserName": "zxcv",
        //     "TasteRate": "3",
        //     "DistanceRate": "4",
        //     "TotalRate": "5"
        // },{
        //     "PlaceID": "ChIJgd5ZPcTjZTURhIDk2qKpq5A",
        //     "UserName": "qwerty",
        //     "TasteRate": "1",
        //     "DistanceRate": "1",
        //     "TotalRate": "1"
        // }]}, []]
        console.log(results)
        return results
    })
}

export const findAttractionReview = () => {
    let reviewData = new Promise((resolve, reject) => {
        new LS2Request().send({
            service: 'com.webos.service.db',
            method: 'find',
            parameters: {
                "query": {
                    "from": "com.trip.info:5"
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
        console.log(results)
        return results
    })
}