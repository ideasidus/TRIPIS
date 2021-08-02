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
                // console.log('recommend', res.results);
                resolve( { status : 'success', data: res.results} )
            },
            onFailure: (res) => {
                // console.log('recommend fail', res);
                resolve( { status: 'fail' } )
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
                resolve( { status : 'success', data: res.results} )
            },
            onFailure: (res) => {
                // console.log('notRecommend fail', res);
                resolve( { status: 'fail' } )
            }
        })
    })
    
    
    

    return Promise.all([recommend, notRecommend]).then((results) => {
        // console.log('promise all results', results)
        return results
    })

}

const getAttraction = () => {
    
}

const getEvent = () => {
    
}

const testExport = () => {
    console.log('test');
}

export { getRestaurant, getAttraction, getEvent, testExport }