import React, { useState, useEffect } from "react";
import { Button, ButtonGroup, Divider, Grid, List, ListItem, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableBody, TableRow, TableCell, TableContainer } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { Rating } from '@material-ui/lab'

import GoogleMapReact from "google-map-react";
import axios from "axios";

import { Loader } from 'google-maps';

import SearchInput from "./searchInput";

/* eslint-disable no-undef */

const center = { lat: 35.886058, lng: 128.611335 };

const useStyles = makeStyles((theme) => ({
    // root: {
    //     display: 'flex',
    //     flexDirection: 'column',
    //     alignItems: 'center',
    //     '& > *': {
    //         margin: theme.spacing(1),
    //     },
    // },

    locationItem: {

    },
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

    const [results, setResults] = useState([]);
    const [mapState, setMapState] = useState(null);
    const [openDetail, setOpenDetail] = useState(false);

    const [dialog, setDialog] = useState(false);
    const [tasteRating, setTasteRating] = useState(5);
    const [distanceRating, setDistanceRating] = useState(5);
    const [overallRating, setOverallRating] = useState(5);


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

    const getRestaurant = () => {
        const request = {
            location: location,
            radius: 1000,
            type: 'restaurant'
        };

        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                for (let i = 0; i < results.length; i++) {
                    createMarker(results[i], i);

                }

                if (results[0].geometry != null && results[0].geometry.location != null) {
                    map.setCenter(results[0].geometry.location);
                }

            }
            setResults((prev) => results.map((item) => Object.assign(item, { selected: false })));
        })
    }

    const clickHandler = (index, place) => {
        // console.log(place)
        // console.log(place.geometry)
        // console.log(place.geometry.location.lat())
        // console.log(map.panTo({lat: place.geometry.location.lat() , lng: place.geometry.location.lng()}))
        // if (!place.geometry || !place.geometry.location) return;
        // map.panTo(place.geometry.location)

        mapState.panTo(place.geometry.location)
        setResults((prev) => prev.map((v, i) => ({
            ...v, selected: (i === index ? true : false)
        })))
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



    useEffect(() => {
        const init = () => {
            map = new google.maps.Map(document.getElementById("map"), {
                center: { lat: center.lat, lng: center.lng },
                zoom: 15,
            })

            service = new google.maps.places.PlacesService(map);
            location = new google.maps.LatLng(center.lat, center.lng)
            infowindow = new google.maps.InfoWindow();
        }
        init()
        // console.log(typeof map)
        // setMapState((prev) => map)

        // setMapState(map)



        // initLocator(CONFIGURATION)

    }, [])

    useEffect(() => {
        console.log('results change : ', results)
    }, [results])

    return (
        <div style={{ display: 'flex' }}>

            <div style={{ width: '20vw', minWidth: 400, height: '100vh', overflowY: 'auto' }}>
                <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                    <Button onClick={getRestaurant}>Restaurant</Button>
                    <Button>Attraction</Button>
                    <Button>Event</Button>
                </ButtonGroup>
                <Divider />
                <List>
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
                </List>

                <div class="results">
                </div>
            </div>
            <div id="map" className="map" style={{ height: '100vh', width: (openDetail ? '60vw' : '80vw') }}>
                test
            </div>

            <div style={{ height: '100vh', width: '20vw', minWidth: 400, display: (!openDetail ? 'none' : '') }}>
                <DetailItem
                    name="피자에땅 경대점"
                    address="Daeheyon 1(il)-dong, Buk-gu, Daegu, South Korea"
                    phone_number="053-939-2277"
                    distance="598m"
                    total_rate={4.2}
                    distance_rate={5}
                    taste_rate={3.4}
                    clickRate={() => dialogOpen()}
                />
            </div>

            <Dialog
                open={dialog}
                onClose={dialogClose}
            >
                <DialogTitle>
                    Dialog Title
                </DialogTitle>

                <DialogContent>
                    <TableContainer>
                        <Table>
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

                <DialogActions style={{justifyContent: 'center'}}>
                    <Button>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>


    );
};

const LocationItem = (props) => {

    return (
        <ListItem onClick={props.click} style={{ backgroundColor: props.selected ? '#252525' : '#ffffff' }}>
            <div style={{ width: '100%' }}>
                {props.index}
                {props.name}
                {props.type}
            </div>
            <div>
                {props.rating} <Rating name="read-only" value={props.rating} readOnly />
            </div>
            <div>
                {props.vicinity}
            </div>
        </ListItem>
    )
}


const DetailItem = (props) => {

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
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
                                {props.address}
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
                                {props.distance}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                TOTAL<br />RATE
                            </TableCell>
                            <TableCell>
                                {props.total_rate}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                DISTANCE<br />RATE
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
            </TableContainer>
            <Button onClick={() => props.clickRate()}>
                RATE
            </Button>
        </>

    )
}

export default Map;
