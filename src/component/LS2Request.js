import LS2Request from "@enact/webos/LS2Request";

const getRestaurant = async () => {
    // find restaurant recommended by host
    let recommend = new LS2Request().send({
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
            onSuccess: (res) => {
                console.log('\t', res.results);
                // setProduct(res.results);
                return { status : 'success', data: res.results}
            },
            onFailure: (res) => {
                console.log('\t', res);
                return { status: 'fail' }
            }
        }
    })

    // find restaurant not recommended by host
    let notRecommend = new LS2Request().send({
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
            onSuccess: (res) => {
                console.log('\t', res.results);
                return { status : 'success', data: res.results}
            },
            onFailure: (res) => {
                console.log('\t', res);
                return { status: 'fail' }
            }
        }
    })

    return [recommend, notRecommend];


}

const getAttraction = () => {
    
}

const getEvent = () => {
    
}

const testExport = () => {
    console.log('test');
}

export { getRestaurant, getAttraction, getEvent, testExport }