import { useState, Fragment } from 'react'
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';

import { useSnackbar } from 'notistack';

import { makeStyles } from '@material-ui/core/styles';
import { Paper, IconButton, Divider, InputBase, Button, CircularProgress } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { useEffect } from 'react';

import { DetailItem } from './map';

import { getRestaurant as LS2getRestaurant } from "./LS2Request";

const useStyles = makeStyles((theme) => ({
    listSection: {
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

    mapOpened: {
        height: '100vh',
        width: '60vw',
    },
    mapNotOpened: {
        height: '100vh',
        width: '80vw',
    },
    detailItem: {
        height: '100vh',
        width: '20vw',
        minWidth: 400,
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
}))

/* eslint-disable no-undef */

const defaultCenter = { lat: 40.7483475, lng: -73.9864422 };

const getCenter = () => {
    // Select DB8 Code

    // return null
    return { name: 'Test!!', lat: 35.8692386, lng: 128.5919156 }
}

const AdminMap = (props) => {
    let map, service, location, infowindow, geocoder, searchBox;
    const classes = useStyles()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [input, setInput] = useState('');
    const [markers, setMarkers] = useState([]);
    const [center, setCenter] = useState(getCenter())
    const [search, setSearch] = useState([]);

    const [serviceState, setServiceState] = useState(null);
    const [loading, setLoading] = useState(false);


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

    const centerMarker = (name, lat, lng, setting = true) => {
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

        if (!setting) {
            showCenterInfoWindow(marker, name, lat, lng);
            google.maps.event.addListener(marker, "click", () => showCenterInfoWindow(marker, name, lat, lng));
        }

    }

    const showCenterInfoWindow = (marker, name, lat, lng) => {
        // let content = `<div>${place.name}</div>\
        // <button onclick="setCenterPlace()">숙소로 등록하기!!</button>\
        // `
        // let content = `<div>${place.name}</div>\
        // <button id="setCenterBtn">숙소로 등록하기!!</button>`


        let content = document.createElement('div');
        let nameEl = document.createElement('div');
        nameEl.innerText = name;
        content.appendChild(nameEl);

        let btnEl = document.createElement('button');
        btnEl.innerText = '숙소로 등록하기'
        btnEl.addEventListener('click', function () { setCenterPlace(lat, lng); })
        content.appendChild(btnEl)

        infowindow.setContent(content);
        infowindow.open(map, marker);
    }

    function setCenterPlace(lat, lng) {
        console.log('setCenter', place)
        // set db
        setCenter({ lat: lat, lng: lng })
        enqueueSnackbar('Set Center!!', { variant: 'success', autoHideDuration: 2000, action })
        infowindow.close();
    }

    const initMap = () => {
        if (center !== null) {
            console.log('center exist')
            map = new google.maps.Map(document.getElementById("map"), {
                center: { lat: center.lat, lng: center.lng },
                zoom: 15,
            })

            location = new google.maps.LatLng(center.lat, center.lng)
            service = new google.maps.places.PlacesService(map);
            infowindow = new google.maps.InfoWindow()

            setServiceState((prev) => service)

            infowindow.setContent()

            centerMarker(center.name, center.lat, center.lng)

            restaurantSearch(service, null);

        } else {
            console.log('center is null')
            map = new google.maps.Map(document.getElementById("map"), {
                center: { lat: defaultCenter.lat, lng: defaultCenter.lng },
                zoom: 15,
            })

            location = new google.maps.LatLng(defaultCenter.lat, defaultCenter.lng)
            service = new google.maps.places.PlacesService(map);
            infowindow = new google.maps.InfoWindow()

            console.log('in initMap serive', service)
            setServiceState(service)

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
                centerMarker(place.name, place.geometry.location.lat(), place.geometry.location.lng(), false)

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

    const restaurantSearch = (service, pageToken) => {

        if (!loading) {
            setLoading((prev) => !prev)
        }

        let request;
        if (pageToken) {
            request = {
                location: center,
                radius: 2000,
                type: 'restaurant',
                language: 'en',
                pageToken: pageToken,
            };
        } else {
            console.log('init!!')
            request = {
                location: center,
                radius: 2000,
                type: 'restaurant',
                language: 'en',
            };
        }

        service.nearbySearch(request, (results, status, pagetoken) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                // console.log('nearbySearch Result', results)
                // console.log('pagetoken', pagetoken)

                setSearch((prev) => prev.concat(results));

                if (pagetoken.hasNextPage) {
                    console.log('next!!')
                    pagetoken.nextPage();
                } else {
                    console.log('end!!')
                    searchFiltering()
                }

                // if (next_page_token !== null) {
                //     console.log('next!!', next_page_token.o)
                //     restaurantSearch(service, next_page_token.o)
                // } else {
                //     console.log('end!!')
                //     searchFiltering()
                // }
                // let tAllMarkers = [];
                // for (let i = 0; i < results.length; i++) {
                //     var marker = createMarker(results[i], i);
                //     tAllMarkers.push(marker);
                // }


                // if (results[0].geometry != null && results[0].geometry.location != null) {
                //     map.setCenter(results[0].geometry.location);
                // }

            }


        })
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

    const searchFiltering = () => {
        // db
        // search.filter(~~~)

        LS2getRestaurant().then((results) => {
            const [recommend, notRecommend] = results;
            const sumList = recommend.data.concat(notRecommend.data)

            setSearch((prev) => prev.filter( x => !sumList.includes(x)))
        })

        setLoading(false);
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

        } else {

        }
    }, [center])

    useEffect(() => {
        console.log('search changed', search)
    }, [search])
    useEffect(() => {
        console.log('loading changed', loading)
    }, [loading])

    return (
        <div style={{ display: 'flex' }}>
            <div className={classes.listSection}>
                <Paper className={classes.inputPaper}>
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

                <Button variant="contained" color="primary">
                    {loading && <CircularProgress color="secondary" />}
                    {loading ? 'Loading...' : `Update All!! (${search.length})`}
                </Button>

                <UpdateList
                    rows={loading ? [] 
                        : search.map((item => (({ place_id, name, rating, vicinity }) => ({ id:place_id, name, rating, vicinity }))(item)))
                    }
                >
                </UpdateList>
            </div>
            <div id="map" className={center !== null ? classes.mapOpened : classes.mapNotOpened}>
                test
            </div>


            <div className={center !== null ? classes.detailItemOpened : classes.detailItemNotOpened}>
                <DetailItem
                    name="피자에땅 경대점"
                    address="Daeheyon 1(il)-dong, Buk-gu, Daegu, South Korea"
                    phone_number="053-939-2277"
                    distance="598m"
                    total_rate={4.2}
                    distance_rate={5}
                    taste_rate={3.4}
                    btnName='Recommend!'
                    clickBtn={() => {console.log('click recommend!')}}
                    reviews={[]}
                />
            </div>
        </div>
    )
}

const UpdateList = (props) => {

    const columns = [
        { field: 'name', headerName: 'Name', width: '150' },
        { field: 'rating', headerName: 'Rating', width: '75' },
        { field: 'vicinity', headerName: 'Vicinity', width: '125' }
    ]

    const rows = [
        { id: 1, name: 'Snow', rating: 'Jon', vicinity: 35, test: 't' },
        { id: 2, name: 'Lannister', rating: 'Cersei', vicinity: 42, test: 't' },
        { id: 3, name: 'Lannister', rating: 'Jaime', vicinity: 45, test: 't' },
        { id: 4, name: 'Stark', rating: 'Arya', vicinity: 16, test: 't' },
        { id: 5, name: 'Targaryen', rating: 'Daenerys', vicinity: null, test: 't' },
        { id: 6, name: 'Melisandre', rating: null, vicinity: 150, test: 't' },
        { id: 7, name: 'Clifford', rating: 'Ferrara', vicinity: 44, test: 't' },
        { id: 8, name: 'Frances', rating: 'Rossini', vicinity: 36, test: 't' },
        { id: 9, name: 'Roxie', rating: 'Harvey', vicinity: 65, test: 't' },
    ];

    return (
        <DataGrid
            pageSize={10}
            rows={props.rows}
            // rows={rows}
            columns={columns}
            checkboxSelection
            disableSelectionOnClick
        >

        </DataGrid>
    )
}

export default AdminMap;