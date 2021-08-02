import React, { useState, useEffect } from "react";
import { Button, ButtonGroup, Divider, Grid, List, ListItem, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, TableSortLabel } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { Rating } from '@material-ui/lab'
import haversine from 'haversine-distance'

import { getRestaurant as LS2getRestaurant } from "./LS2Request";
import LS2Request from "@enact/webos/LS2Request";

import GoogleMapReact from "google-map-react";
import axios from "axios";

import { Loader } from 'google-maps';

import SearchInput from "./searchInput";

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
    const [reviews, setReviews] = useState([]);

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('index');

    const [selectedIndex, setSelectedIndex] = useState(0);

    const createMarker = (place, index) => {
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

    const getRestaurant = (request_type) => {
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
                    var marker = createMarker(results[i], i);
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

        mapState.panTo(place.geometry.location)
        // setResults((prev) => prev.map((v, i) => ({
        //     ...v, selected: (v.place_id === place.place_id ? true : false)
        // })))
        setResults((prev) => prev.map((v, i) => {
            if (v.place_id === place.place_id) {
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
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }



    useEffect(() => {
        const initRestaurant = () => {
            LS2getRestaurant().then(results => {
                console.log('getLS2Restaurant results',results)

                const [recommend, notRecommend] = results;

                if ( recommend.status && recommend.status === 'success') {
                    setResults((prev) => recommend.data.map((item) => (
                            Object.assign(item, { selected: false, distance: Math.round(haversine([item.geometry.location.lng(), item.geometry.location.lat()], [center.lng, center.lat])) })
                    )));
                }
                if (notRecommend.status && notRecommend.status === 'success') {
                    setResults((prev) => prev.concat(notRecommend.data.map((item) => (
                        Object.assign(item, { selected: false, distance: Math.round(haversine([item.geometry.location.lng(), item.geometry.location.lat()], [center.lng, center.lat])) })
                    ))) );
                }
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

            getRestaurant(request_type)
        }


        initRestaurant()
        initMap()
        // setMapState((prev) => map)

        // setMapState(map)



        // initLocator(CONFIGURATION)

    }, [])

    useEffect(() => {
        console.log('results change : ', results)
    }, [results])

    const addReviews = () => {
        setReviews(reviews.concat([{
            index: selectedIndex,
            username: userName,
            tasteRating: tasteRating,
            distanceRating: distanceRating,
            overallRating: overallRating
        }]));
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
                                    name={item.name}
                                    vicinity={item.vicinity}
                                    rating={item.rating ? item.rating : 0}
                                    distance={item.distance}
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
                    phone_number='now on test'
                    // distance={results[selectedIndex].distance}
                    // total_rate={results[selectedIndex].rating ? results[selectedIndex].rating : 0}
                    distance_rate='now on test'
                    taste_rate='now on test'
                    {...results[selectedIndex]}
                    clickBtn={() => dialogOpen()}
                    reviews = {reviews}
                    selectedIndex = {selectedIndex}
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
        { id: 'index', label: 'index', sort: false },
        { id: 'name', label: 'name', sort: false },
        { id: 'rating', label: 'rating', sort: true },
        { id: 'distance', label: 'distance', sort: true },
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
                                {props.name}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                ADDRESS
                            </TableCell>
                            <TableCell>
                                {/* {props.address} */}
                                {props.vicinity}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                PHONE<br />NUMBER
                            </TableCell>
                            <TableCell>
                                {props.phone_number}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                DISTANCE
                            </TableCell>
                            <TableCell>
                                {props.distance >= 1000 ? Math.round((props.distance) / 100) / 10 + 'km' : props.distance + 'm'}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                TOTAL<br />RATE
                            </TableCell>
                            <TableCell>
                                {/* {props.total_rate} */}
                                {props.rating}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                ACCESSIBILITY<br />RATE
                            </TableCell>
                            <TableCell>
                                {props.distance_rate}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                TASTE<br />RATE
                            </TableCell>
                            <TableCell>
                                {props.taste_rate}
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
                            if (item.index == props.selectedIndex) {
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