import { useState, Fragment } from 'react'
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';

import { useSnackbar } from 'notistack';

import { makeStyles } from '@material-ui/core/styles';
import { Paper, IconButton, Divider, InputBase, Button } from '@material-ui/core';
import { useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
    inputSection: {
        width: '20vw', minWidth: 400, height: '100vh', overflowY: 'auto',

    },
    inputPaper: {
        display: 'flex', alignItems: 'center',
    },
    input: {
        marginLeft: 10,
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
}))

/* eslint-disable no-undef */

const defaultCenter = { lat: 40.7483475, lng: -73.9864422 };

const getCenter = () => {
    // Select DB8 Code

    return null
    return { lat: 35.8692386, lng: 128.5919156 }
}

const AdminMap = (props) => {
    let map, service, location, infowindow, geocoder, searchBox;
    const classes = useStyles()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [input, setInput] = useState('');
    const [markers, setMarkers] = useState([]);
    const [center, setCenter] = useState(getCenter())
    const [result, setResults] = useState([]);


    const handleClear = () => {
        setInput('')
    }

    const action = key => (
        <Fragment>
            <Button onClick={() => { closeSnackbar(key) }}>
                'Dismiss'
            </Button>
        </Fragment>
    );


    const handleInputChange = (e) => {
        setInput(e.target.value.trim())
    }

    const centerMarker = (place, lat, lng) => {
        console.log('in centerMarker')
        const svgMarker = {
            path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
            fillColor: "blue",
            fillOpacity: 0.6,
            strokeWeight: 0,
            rotation: 0,
            scale: 2,
            anchor: new google.maps.Point(15, 30),
        };

        const marker = new google.maps.Marker({
            position: { lat: lat, lng: lng },
            icon: svgMarker,
            map: map,
        })

        showCenterInfoWindow(marker, place);

        google.maps.event.addListener(marker, "click", () => showCenterInfoWindow(marker, place));
    }

    const showCenterInfoWindow = (marker, place) => {
        // let content = `<div>${place.name}</div>\
        // <button onclick="setCenterPlace()">숙소로 등록하기!!</button>\
        // `
        // let content = `<div>${place.name}</div>\
        // <button id="setCenterBtn">숙소로 등록하기!!</button>`


        let content = document.createElement('div');
        let name = document.createElement('div');
        name.innerText = place.name;
        content.appendChild(name);

        let btn = document.createElement('button');
        btn.innerText = 'Register as accommodation'
        btn.addEventListener('click', function () { setCenterPlace(place); })
        content.appendChild(btn)

        infowindow.setContent(content);
        infowindow.open(map, marker);
    }

    function setCenterPlace(place) {
        console.log('setCenter', place)
        // set db
        setCenter({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() })
        enqueueSnackbar('Set Center!!', { variant: 'success', autoHideDuration: 2000, action })
    }

    const initMap = () => {
        if (center !== null) {
            map = new google.maps.Map(document.getElementById("map"), {
                center: { lat: center.lat, lng: center.lng },
                zoom: 15,
            })

            location = new google.maps.LatLng(center.lat, center.lng)
            service = new google.maps.places.PlacesService(map);
            infowindow = new google.maps.InfoWindow()

            infowindow.setContent()

            centerMarker(center.lat, center.lng)

            restaurantSearch();

        } else {
            console.log('center is null')
            map = new google.maps.Map(document.getElementById("map"), {
                center: { lat: defaultCenter.lat, lng: defaultCenter.lng },
                zoom: 15,
            })

            location = new google.maps.LatLng(defaultCenter.lat, defaultCenter.lng)
            service = new google.maps.places.PlacesService(map);
            infowindow = new google.maps.InfoWindow()

            centerSearch();
        }
    }

    const centerSearch = () => {
        const searchInputEl = document.getElementById('input');
        const searchBox = new google.maps.places.SearchBox(searchInputEl);

        map.addListener("bounds_changed", () => {
            searchBox.setBounds(map.getBounds());
        })

        searchBox.addListener("places_changed", () => {
            const places = searchBox.getPlaces();
            console.log('places : ', places)

            if (places.length === 0) {
                return;
            }

            // clear marker
            markers.forEach((marker) => {
                marker.setMap(null);
            });

            setMarkers([]);

            const bounds = new google.maps.LatLngBounds();
            places.forEach((place) => {
                if (!place.geometry || !place.geometry.location) {
                    console.log('Returned place contains no geometry')
                    return;
                }
                console.log('before centerMarker')
                centerMarker(place, place.geometry.location.lat(), place.geometry.location.lng())

                // Info Window Section

                if (place.geometry.viewport) {
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location)
                }
            })
            map.fitBounds(bounds)

        })
    }

    const restaurantSearch = () => {

    }

    const initSearchBox = () => {
        const searchInputEl = document.getElementById('input');
        const searchBox = new google.maps.places.SearchBox(searchInputEl);

        // map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchInputEl);

        map.addListener("bounds_changed", () => {
            searchBox.setBounds(map.getBounds());
        })

        searchBox.addListener("places_changed", () => {
            const places = searchBox.getPlaces();
            console.log('places : ', places)

            if (places.length === 0) {
                return;
            }

            // clear marker
            markers.forEach((marker) => {
                marker.setMap(null);
            });

            setMarkers([]);

            const bounds = new google.maps.LatLngBounds();
            places.forEach((place) => {
                if (!place.geometry || !place.geometry.location) {
                    console.log('Returned place contains no geometry')
                    return;
                }

                if (place.geometry.viewport) {
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location)
                }
            })
            map.fitBounds(bounds)

        })
    }

    // const initAutoComplete  = () => {
    //     const searchInputEl = document.getElementById('input');
    //     const autoComplete = new google.maps.places.Autocomplete(searchInputEl, {
    //         types: ['geocode'],
    //         fields: ['place_id', 'formatted_address', 'geometry.location', 'name']
    //     })

    //     autoComplete.bindTo('bounds', map);
    //     autoComplete.addListener('place_changed', () => {
    //         const placeResult = autoComplete.getPlace();
    //         console.log('in intiAC result : ',placeResult)
    //         // setInput(placeResult.formatted_address)

    //         console.log(placeResult.geometry.location.lat(), placeResult.geometry.location.lng())
    //         console.log(map)

    //         const marker = new google.maps.Marker({
    //             map: map,
    //             position: placeResult.geometry.location,
    //         });

    //         map.panTo(placeResult.geometry.location)
    //     })
    // }

    // const initGeocode = () => {
    //     geocoder = new google.maps.Geocoder();

    //     const geocodeSearch = (query) => {
    //         console.log('in geocode search!', query)
    //         if (!query) {
    //             return;
    //         }

    //         const handleResult = (geocodeResult) => {
    //             return;
    //         }

    //         console.log(map)

    //         // const request = {address: "Hell's Kitchen, 맨해튼 뉴욕 미국", bounds: map.getBounds()};
    //         const request = {address: query, bounds: map.getBounds()};
    //         geocoder.geocode(request, (results, status) => {
    //             console.log(results, status)
    //             if (status === 'OK') {
    //                 if (results.length > 0) {
    //                     const result = results[0]
    //                     handleResult(result)
    //                 }
    //             }
    //         })
    //     }

    //     const searchButtonEl = document.getElementById('searchBtn')
    //         .addEventListener('click', () => {
    //             console.log('search btn click!!')
    //             geocodeSearch(input.trim())
    //         })
    // }

    useEffect(() => {
        initMap()
        initSearchBox();

    }, [])

    useEffect(() => {
        console.log('center changed', center)

        if (center === null) {

        }
    }, [center])

    return (
        <div style={{ display: 'flex' }}>
            <div className={classes.inputSection}>
                <Paper className={classes.inputPaper}>
                    {/* <input
                        id='input'
                        className={classes.input}  
                    /> */}
                    <InputBase
                        id='input'
                        className={classes.input}
                        placeholder="Search Google Maps"
                    // value={input}
                    // onChange={handleInputChange}
                    />
                    <IconButton onClick={handleClear} className={classes.iconButton}>
                        <ClearIcon />
                    </IconButton>
                    <Divider className={classes.divider} orientation="vertical" />
                    <IconButton id='searchBtn' className={classes.iconButton}>
                        <SearchIcon />
                    </IconButton>
                </Paper>
            </div>


            <div id="map" className="map" style={{ height: '100vh', width: '80vw' }}>
                map
            </div>
        </div>
    )
}

export default AdminMap;