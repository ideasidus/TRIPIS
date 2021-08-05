import LS2Request from "@enact/webos/LS2Request";

export const mergeRestaurant = (obj) => {
    console.log("mergeData : ", obj)
    let response = new Promise((resolve, reject) => {
        new LS2Request().send({
            service: 'com.webos.service.db',
            method: 'merge',
            parameters: {
                "query": {
                    "from": "com.trip.info:1",
                    "where": [{
                        "prop": "PlaceID",
                        "op": "=",
                        "val": obj.PlaceID
                    }]
                },
                "props":{
                    "NumberOFCustomer":obj.newNOC,
                    "NumberOfRate": obj.newNOR,
                    "AveragePrice": obj.newPrice,
                    "TasteRate": obj.newTaste,
                    "DistanceRate": obj.newDist,
                    "TotalRate": obj.newTotal
                }
            },
            onSuccess: (res) => {
                console.log("success", res)
                resolve({ status: 'success' })
            },
            onFailure: (res) => {
                console.log("fail", res)
                resolve({ status: 'fail' })
            }
        })
    })

    return response;
}