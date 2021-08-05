import React, { useState, useEffect } from "react";
import { Button, ButtonGroup, Divider, Grid, List, ListItem, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, TableSortLabel } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { Rating } from '@material-ui/lab'
import haversine from 'haversine-distance'

import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import { findRestaurant as LS2getRestaurant, findRestaurantReview, findAttractionReview} from "../LS2Request/Find";
import { putRestaurantReview, putAttractionReview } from "../LS2Request/Put";
import { mergeRestaurant } from "../LS2Request/Merge";

// import GoogleMapReact from "google-map-react";
// import axios from "axios";

// import { Loader } from 'google-maps';

// import SearchInput from "./searchInput";

/* eslint-disable no-undef */

const center = { lat: 40.7483475, lng: -73.9864422 };

const useStyles = makeStyles((theme) => ({
    // root: {
    //     display: 'flex',
    //     flexDirection: 'column',
    //     alignItems: 'center',
    //     '& > *': {
    //         margin: theme.spacing(1),
    //     },
    // },
    root: {
        display: 'flex',
        background: 'white',
    },

    leftMenu: {
        width: '25vw',
        minWidth: 400,
        height: '100vh',
        overflowY: 'auto' 
    },

    buttonGroup: {
        color: 'green',
    },
    
    mapOpened: {
        height: '100vh',
        width: '51vw',
    },

    mapNotOpened: {
        height: '100vh',
        width: '72vw',
    },

    detailItemOpened: {
        height: '100vh',
        width: '20vw',
        minWidth: 400,
        display: '',
    },

    detailItemNotOpened: {
        height: '100vh',
        width: '20vw',
        minWidth: 400,
        display: 'none',
    },

    tableSelected: {
        backgroundColor: '#808080',
    },

    tableNotSelected: {
        backgroundColor: '#ffffff',
    },

    rateDialog: {
        justifyContent: 'center',
    },

    tableTextAlign: {
        textAlign: 'center'
    }
}));


const Map = (props) => {

    let map, service, location, infowindow;
    //   const CONFIGURATION = { "capabilities": { "input": true, "autocomplete": true, "directions": true, "distanceMatrix": true, "details": true }, "locations": [{ "title": "정식당", "address1": "대한민국 대구광역시 대현동 대현동 189-7번지 1층 북구 대구광역시 KR", "coords": { "lat": 35.8848305071286, "lng": 128.60908605889546 }, "placeId": "ChIJ7YddJXjhZTURMYEra6JJVGA" }], "mapOptions": {}, "mapsApiKey": "AIzaSyCrT38oSig-WBhPCJyBRuJzO_dkR_hZdFo" };

    //   const [searchLocation, setSearchLocation] = useState(null);
    //   const [selectedLocationIdx, setSelectedLocationIdx] = useState(null);
    //   const [searchLocationMarker, setSearchLocationMarker] = useState(null);
    //   const [userCountry, setUserCountry] = useState(null);

    //   const [results, setResults] = useState([]);

    //   const locations = CONFIGURATION.locations || []
    //   const mapOptions = CONFIGURATION.mapOptions;

    //   const mapEl = document.getElementById('map');
    const classes = useStyles();
    const request_type = props.type

    const [results, setResults] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [mapState, setMapState] = useState(null);
    const [openDetail, setOpenDetail] = useState(false);

    const [dialog, setDialog] = useState(false);
    const [tasteRating, setTasteRating] = useState(5);
    const [distanceRating, setDistanceRating] = useState(5);
    const [overallRating, setOverallRating] = useState(5);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [numberOfCustomer, setNumberOfCustomer] = useState(0);
    const [reviews, setReviews] = useState([]);

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('index');

    const [selectedIndex, setSelectedIndex] = useState(0);

    const createMarkerDumi = (place, index) => {
        if (!place.geometry || !place.geometry.location) return;
        const marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            label: numToSSColumn(index + 1),
        });

        google.maps.event.addListener(marker, "click", () => {
            infowindow.setContent(place.name || "");
            infowindow.open(map);
        });


        marker.addListener('click', () => {
            // clickHandler(index, place)
            setMapState((prev) => map)
            map.panTo(place.geometry.location)
            setResults((prev) => prev !== null && prev.map((v, i) => ({
                ...v, selected: (i === index ? true : false)
            })))
            setOpenDetail(true)
        })

        if (index == 0) {
            google.maps.event.trigger(marker, 'click');
        }

        return marker;
    }

    const createMarker = (place, index) => {
        
        console.log('in createMarker',place, index)
        const marker = new google.maps.Marker({
            map: map,
            position: {lat: place.Latitude, lng: place.Longitude},
            label: numToSSColumn(index + 1),
        });

        google.maps.event.addListener(marker, "click", () => {
            infowindow.setContent(place.name || "");
            infowindow.open(map);
        });

        marker.addListener('click', () => {
            // clickHandler(index, place)
            setMapState((prev) => map)
            map.panTo({lat: place.Latitude, lng: place.Longitude})
            setResults((prev) => prev !== null && prev.map((v, i) => ({
                ...v, selected: (i === index ? true : false)
            })))
            setOpenDetail(true)
        })

        if (index == 0) {
            google.maps.event.trigger(marker, 'click');
        }

        return marker;
    }

    const getDumiRestaurant = (request_type) => {
        const request = {
            location: location,
            radius: 2000,
            type: request_type,
            language: 'en'
        };

        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                let tAllMarkers = [];
                for (let i = 0; i < results.length; i++) {
                    var marker = createMarkerDumi(results[i], i);
                    tAllMarkers.push(marker);
                }

                console.log('in nearBy', tAllMarkers)
                setMarkers((prev) => tAllMarkers);


                if (results[0].geometry != null && results[0].geometry.location != null) {
                    map.setCenter(results[0].geometry.location);
                }

            }

            setResults((prev) => results.map((item) => (
                item.rating
                    ? Object.assign(item, { selected: false, distance: Math.round(haversine([item.geometry.location.lng(), item.geometry.location.lat()], [center.lng, center.lat])) })
                    : Object.assign(item, { selected: false, rating: 0, distance: Math.round(haversine([item.geometry.location.lng(), item.geometry.location.lat()], [center.lng, center.lat])) })
            )));
        })
    }

    const clickHandler = (index, place) => {

        mapState.panTo({lat: place.Latitude, lng: place.Longitude})
        // setResults((prev) => prev.map((v, i) => ({
        //     ...v, selected: (v.place_id === place.place_id ? true : false)
        // })))
        setResults((prev) => prev.map((v, i) => {
            if (v.PlaceID === place.PlaceID) {
                setSelectedIndex(i)
                return {
                    ...v, selected : true
                }
            } else {
                return {
                    ...v, selected : false
                }
            }
        }))
    }

    function numToSSColumn(num) {
        let s = '', t;

        while (num > 0) {
            t = (num - 1) % 26;
            s = String.fromCharCode(65 + t) + s;
            num = (num - t) / 26 | 0;
        }
        return s || undefined;
    }

    const dialogOpen = () => {
        setDialog(() => true)
    }

    const dialogClose = () => {
        setDialog(() => false)
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    }

    const stableSort = (array, comparator) => {
        // const originIndex = [];
        const stabilizedThis = array.map((el, index) => {
            // originIndex.push(index)
            return [el, index]
        });

        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el, index) => {

            markers[el[1]].setLabel(numToSSColumn(index + 1))
            return el[0]
        })
    }

    const getComparator = (order, orderBy) => {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    const descendingComparator = (a, b, orderBy) => {
        if(orderBy == 'index'){
            if (b['HostRecommendation'] < a['HostRecommendation']) {
                return 1;
            }
            if (b['HostRecommendation'] > a['HostRecommendation']) {
                return -1;
            }
        }
        else {
            if (b[orderBy] < a[orderBy]) {
                return -1;
            }
            if (b[orderBy] > a[orderBy]) {
                return 1;
            }
        }
        return 0;
    }


    useEffect(() => {
        const initRestaurant = () => {
            LS2getRestaurant().then(async (db_results) => {
                console.log('getLS2Restaurant results',db_results)

                const recommend = (db_results[0].status && db_results[0].status === 'success') ? db_results[0].data.map((item) => Object.assign({}, item, {selected: false})) : [] 
                const notRecommend = (db_results[1].status && db_results[1].status === 'success') ? db_results[1].data.map((item) => Object.assign({}, item, {selected: false})) : []
                
                console.log('rec',recommend)
                console.log('not',notRecommend)
                return await recommend.concat(notRecommend);
            }).then((totalRestaurant) => {
                console.log('totalRestaurant', totalRestaurant)

                let tAllMarkers = [];
                for (let i = 0; i < totalRestaurant.length; i++) {
                    var marker = createMarker(totalRestaurant[i], i);
                    tAllMarkers.push(marker);
                }

                console.log('in initRestaurant', tAllMarkers)
                setMarkers((prev) => tAllMarkers);
                setResults((prev) => totalRestaurant);

                if (totalRestaurant[0].Latitude != null && totalRestaurant[0].Longitube != null) {
                    map.setCenter({lat: totalRestaurant[0].Latitude, lng: totalRestaurant[0].Longitube});
                }

                return;
            })
            // .then(() => {
            //     let tAllMarkers = [];
            //     for (let i = 0; i < results.length; i++) {
            //         var marker = createMarker(results[i], i);
            //         tAllMarkers.push(marker);
            //     }

            //     console.log('in initRestaurant', tAllMarkers)
            //     setMarkers((prev) => tAllMarkers);


            //     if (results[0].Latitude != null && results[0].Longitube != null) {
            //         map.setCenter({lat: results[0].Latitude, lng: results[0].Longitube});
            //     }

            // })
        }

        const initRestaurantReview = () => {
            findRestaurantReview().then(async (db_results) => {
                console.log('getRestaurantReview results',db_results)
                let tempReviews = []
                db_results[0].data.map((item, index) => {
                    tempReviews.push({
                        index: item["PlaceID"],
                        username: item["UserName"],
                        tasteRating: item["TasteRate"],
                        distanceRating: item["DistanceRate"],
                        overallRating: item["TotalRate"]
                    });
                })
                setReviews(reviews.concat(tempReviews))
                console.log('review : ', reviews)
            })
        }

        const initAttractionReview = () => {
            findAttractionReview().then(async (db_results) => {
                console.log('getAttractionReview results',db_results)
                let tempReviews = []
                db_results[0].data.map((item, index) => {
                    tempReviews.push({
                        index: item["PlaceID"],
                        username: item["UserName"],
                        tasteRating: item["TasteRate"],
                        distanceRating: item["DistanceRate"],
                        overallRating: item["TotalRate"]
                    });
                })
                setReviews(reviews.concat(tempReviews))
                console.log('review : ', reviews)
            })
        }

        const initMap = () => {
            map = new google.maps.Map(document.getElementById("map"), {
                center: { lat: center.lat, lng: center.lng },
                zoom: 15,
            })

            service = new google.maps.places.PlacesService(map);
            location = new google.maps.LatLng(center.lat, center.lng)
            infowindow = new google.maps.InfoWindow();

            const svgMarker = {
                path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
                fillColor: "blue",
                fillOpacity: 0.8,
                strokeWeight: 0,
                rotation: 0,
                scale: 3,
                anchor: new google.maps.Point(15, 30),
            };
            new google.maps.Marker({
                position: { lat: center.lat, lng: center.lng },
                icon: svgMarker,
                map: map,
            });

            initRestaurant();
            // getDumiRestaurant(request_type)
            if (request_type == 'restaurant')
                initRestaurantReview();
            if (request_type == 'tourist_attraction')
                initAttractionReview();

        }
        initMap()
        // setMapState((prev) => map)

        // setMapState(map)



        // initLocator(CONFIGURATION)

    }, [])

    useEffect(() => {
        console.log('results change : ', results)
    }, [results])

    const addReviews = () => {
        const reviewData = {
            "PlaceID": results[selectedIndex].PlaceID,
            "UserName": userName,
            "Password": password,
            "TasteRate": tasteRating,
            "DistanceRate": distanceRating,
            "TotalRate": overallRating,
            "TotalPrice": parseInt(totalPrice),  // DummyData
            "NumberOfCustomer": parseInt(numberOfCustomer)  // DummyData
        }
        if (request_type == 'restaurant') {
            putRestaurantReview(reviewData)  // add to Database
            setResults((prev) => prev.map((v, i) => {
                if (v.PlaceID === results[selectedIndex].PlaceID) {
                    const prevNOC = v.NumberOFCustomer
                    const prevNOR = v.NumberOfRate
                    const newNOC = v.NumberOFCustomer + parseInt(numberOfCustomer)
                    const newNOR = v.NumberOfRate + 1
                    const newData = {
                        PlaceID: v.PlaceID,
                        newNOC: newNOC,
                        newNOR: newNOR,
                        newPrice: parseInt(((v.AveragePrice * prevNOC + parseInt(totalPrice)) / newNOC).toFixed(0)),
                        newTaste: parseFloat(((v.TasteRate * prevNOR + tasteRating) / newNOR).toFixed(1)),
                        newDist: parseFloat(((v.DistanceRate * prevNOR + distanceRating) / newNOR).toFixed(1)),
                        newTotal: parseFloat(((v.TotalRate * prevNOR + overallRating) / newNOR).toFixed(1))
                    }
                    console.log("newData : ", newData)
                    mergeRestaurant(newData)  // merge DB1
                    return {
                        ...v,
                        NumberOFCustomer: newData.newNOC,
                        NumberOfRate: newData.newNOR,
                        AveragePrice: newData.newPrice,
                        TasteRate: newData.newTaste,
                        DistanceRate: newData.newDist,
                        TotalRate: newData.newTotal
                    }
                } else {
                    return {
                        ...v
                    }
                }
            }))
        }
        else if (request_type == 'tourist_attraction') {
            putAttractionReview(reviewData)
        }
        setReviews(reviews.concat([{
            index: results[selectedIndex].PlaceID,
            username: userName,
            password: password,
            tasteRating: tasteRating,
            distanceRating: distanceRating,
            overallRating: overallRating,
            totalPrice: totalPrice,
            numberOfCustomer: numberOfCustomer
        }]));
        setUserName('')
        setPassword('')
    }

    return (
        // <div style={{ display: 'flex' }}>
        <div className={classes.root}>

            <div className={classes.leftMenu}>
                {/* <ButtonGroup variant="contained" color="inherit" aria-label="contained primary button group" className={classes.buttonGroup}>
                    <Button color="inherit" onClick={getRestaurant}>Restaurant</Button>
                    <Button color="inherit">Attraction</Button>
                    <Button color="inherit">Event</Button>
                </ButtonGroup> */}
                <Divider />
                {/* <List>
                    {results !== null && results.map((item, index) => {
                        return <><LocationItem
                            key={index}
                            click={(e) => clickHandler(index, item)}
                            {...item}
                            index={numToSSColumn(index + 1)}
                        // name={item.name}
                        // vicinity={item.vicinity}
                        // rating={item.rating}
                        // selected={item.selected}
                        /><Divider /></>
                    })}
                </List> */}
                <TableContainer>
                    <Table>
                        <SortTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {results !== null && stableSort(results, getComparator(order, orderBy)).map((item, index) => {
                                return <LocationItem
                                    key={index}
                                    click={(e) => clickHandler(index, item)}
                                    {...item}
                                    index={numToSSColumn(index + 1)}
                                    name={item.Name}
                                    vicinity={item.Address}
                                    rating={item.TotalRate ? item.TotalRate : 0}
                                    distance={item.Distance}
                                    selected={item.selected}
                                />
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                <div class="results">
                </div>
            </div>
            <div id="map" className={openDetail ? classes.mapOpened : classes.mapNotOpened}>
                test
            </div>

            <div className={openDetail ? classes.detailItemOpened : classes.detailItemNotOpened}>
                {/* <DetailItem
                    name="피자에땅 경대점"
                    address="Daeheyon 1(il)-dong, Buk-gu, Daegu, South Korea"
                    phone_number="053-939-2277"
                    distance="598m"
                    total_rate={4.2}
                    distance_rate={5}
                    taste_rate={3.4}
                    clickRate={() => dialogOpen()}
                /> */}
                {(results !== null && <DetailItem
                    // name={results[selectedIndex].name}
                    // address={results[selectedIndex].vicinity}
                    // phone_number={results[selectedIndex].PhoneNumber} _NEW
                    // distance={results[selectedIndex].distance}
                    // total_rate={results[selectedIndex].rating ? results[selectedIndex].rating : 0}
                    // distance_rate={results[selectedIndex].DistanceRate} _NEW
                    // taste_rate={results[selectedIndex].TasteRate} _NEW
                    {...results[selectedIndex]}
                    clickBtn={() => dialogOpen()}
                    reviews = {reviews}
                    selectedIndex = {selectedIndex}
                    selectedID = {selectedIndex}
                    btnName="Rate!"
                />)}
            </div>

            <Dialog
                open={dialog}
                onClose={dialogClose}
            >
                <DialogTitle>
                    Rate
                </DialogTitle>

                <DialogContent>
                    <TableContainer>
                        <Table>
                            <TableRow>
                                <TableCell>Name : </TableCell>
                                <TableCell>
                                    <input type="text" value={userName} onChange={(e) => { setUserName(e.target.value) }}/>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>password : </TableCell>
                                <TableCell>
                                    <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }}/>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Taste : </TableCell>
                                <TableCell>
                                    <Rating name="tasteRating" value={tasteRating} onChange={(e, newValue) => { setTasteRating(newValue) }} />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Distance : </TableCell>
                                <TableCell>
                                    <Rating name="distaceRating" value={distanceRating} onChange={(e, newValue) => { setDistanceRating(newValue) }} />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Overall : </TableCell>
                                <TableCell>
                                    <Rating name="overallRating" value={overallRating} onChange={(e, newValue) => { setOverallRating(newValue) }} />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Total Price : </TableCell>
                                <TableCell>
                                    <input type="number" value={totalPrice} onChange={(e) => { setTotalPrice(e.target.value) }}/>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Number of Customer : </TableCell>
                                <TableCell>
                                    <input type="number" value={numberOfCustomer} onChange={(e) => { setNumberOfCustomer(e.target.value) }}/>
                                </TableCell>
                            </TableRow>
                        </Table>
                    </TableContainer>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => {addReviews(); dialogClose();}}>Submit</Button>
                    <Button onClick={() => {dialogClose();}}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>


    );
};

const SortTableHead = (props) => {

    const { orderBy, order, onRequestSort } = props;
    const classes = useStyles();

    const headCells = [
        { id: 'index', label: 'index', sort: true },
        { id: 'name', label: 'name', sort: false },
        { id: 'TotalRate', label: 'rating', sort: true },
        { id: 'Distance', label: 'distance', sort: true },
    ]

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property)
    }

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    (headCell.sort ? <TableCell sortDirection={orderBy === headCell.id ? order : false} className={classes.tableTextAlign}>
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                            IconComponent={headCell.id !== 'index' ? ArrowDownwardIcon : order === 'asc' ? StarIcon : StarBorderIcon }
                        >
                            {headCell.label}
                            {/* {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null} */}
                        </TableSortLabel>
                    </TableCell> : <TableCell className={classes.tableTextAlign}> { headCell.label }</TableCell>)
                ))}

            </TableRow>
        </TableHead>
    )

}

const LocationItem = (props) => {
    const classes = useStyles();
    return (
        // <ListItem onClick={props.click} style={{ backgroundColor: props.selected ? '#808080' : '#ffffff' }}>
        //     <div style={{ width: '100%' }}>
        //         {props.index}
        //         {props.name}
        //         {props.type}
        //     </div>
        //     <div>
        //         {props.rating} <Rating name="read-only" value={props.rating} readOnly />
        //     </div>
        //     <div>
        //         {props.vicinity}
        //     </div>
        // </ListItem>
        // <TableRow onClick={props.click} style={{backgroundColor: props.selected ? '#808080' : '#ffffff'}}>
        <TableRow onClick={props.click} className={props.selected ? classes.tableSelected : classes.tableNotSelected}>
            <TableCell className={classes.tableTextAlign} >
                {props.index}
            </TableCell>
            <TableCell>
                {props.name}
            </TableCell>
            <TableCell className={classes.tableTextAlign} >
                {props.rating != 0 ? props.rating : 'Not Rated Yet'} <Rating name="read-only" value={props.rating} readOnly />
            </TableCell>
            <TableCell className={classes.tableTextAlign} >
                {props.distance >= 1000 ? Math.round((props.distance) / 100) / 10 + 'km' : props.distance + 'm'}
            </TableCell>
        </TableRow>
    )
}


const DetailItem = (props) => {
    const classes = useStyles();
    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{width: 130}}>
                                Kind
                            </TableCell>
                            <TableCell>
                                Value
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                NAME
                            </TableCell>
                            <TableCell>
                                {props.Name}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                ADDRESS
                            </TableCell>
                            <TableCell>
                                {/* {props.address} */}
                                {props.Address}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                PHONE<br />NUMBER
                            </TableCell>
                            <TableCell>
                                {props.PhoneNumber}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                DISTANCE
                            </TableCell>
                            <TableCell>
                                {props.Distance >= 1000 ? Math.round((props.Distance) / 100) / 10 + 'km' : props.Distance + 'm'}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                TOTAL<br />RATE
                            </TableCell>
                            <TableCell>
                                {props.TotalRate}
                                {/* {props.rating} */}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                ACCESSIBILITY<br />RATE
                            </TableCell>
                            <TableCell>
                                {props.DistanceRate}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                TASTE<br />RATE
                            </TableCell>
                            <TableCell>
                                {props.TasteRate}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <br/>
                💎Reviews
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                NickName
                            </TableCell>
                            <TableCell>
                                Taste
                            </TableCell>
                            <TableCell>
                                Distance
                            </TableCell>
                            <TableCell>
                                Overall
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.reviews !== [] && props.reviews.map((item, index) => {
                            if (item.index == props.PlaceID) {
                                return <ReviewItem
                                username = {item.username}
                                tasteRating = {item.tasteRating}
                                distanceRating = {item.distanceRating}
                                overallRating = {item.overallRating}
                            />
                            }
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button onClick={() => props.clickBtn()}>
                {props.btnName}
            </Button>
        </>

    )
}

const ReviewItem = (props) => {
    const classes = useStyles();
    return (
        <TableRow>
            <TableCell className={classes.tableTextAlign} >
                {props.username}
            </TableCell>
            <TableCell className={classes.tableTextAlign}>
                {props.tasteRating}
            </TableCell>
            <TableCell className={classes.tableTextAlign} >
                {props.distanceRating}
            </TableCell>
            <TableCell className={classes.tableTextAlign} >
                {props.overallRating}
            </TableCell>
        </TableRow>
    )
}

export default Map;
export {DetailItem}