import { useState, Fragment } from 'react'
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import UpdateIcon from '@material-ui/icons/Update';

import { useSnackbar } from 'notistack';

import { makeStyles } from '@material-ui/core/styles';
import { Paper, IconButton, Divider, InputBase, Button, CircularProgress, Toolbar, Tooltip, Typography } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { useEffect } from 'react';

import { DetailItem } from '../map';

import { findAttraction as LS2FindAttraction, findCenter } from '../../LS2Request/Find';
import { putAttraction } from '../../LS2Request/Put';
import AdminAttraction from './adminAttraction';

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
    UpdateListToolBarTitle: {
        flex: '1 1 100%',
    },
}))

/* eslint-disable no-undef */

const defaultCenter = { lat: 40.7483475, lng: -73.9864422 };

const getCenter = () => {
    // Select DB8 Code
    return findCenter()

    // return null
    return { name: 'Test!!', lat: 35.8692386, lng: 128.5919156 }
}

const AdminAttraction = (props) => {
    let map, service, location, infowindow, geocoder, searchBox;
    // let markers = [];
    const classes = useStyles()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [input, setInput] = useState('');
    const [markers, setMarkers] = useState([]);
    const [center, setCenter] = useState(getCenter())

    const [search, setSearch] = useState([]);
    const [selection, setSelection] = useState();

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
            history.push('/admin')
            // map = new google.maps.Map(document.getElementById("map"), {
            //     center: { lat: defaultCenter.lat, lng: defaultCenter.lng },
            //     zoom: 15,
            // })

            // location = new google.maps.LatLng(defaultCenter.lat, defaultCenter.lng)
            // service = new google.maps.places.PlacesService(map);
            // infowindow = new google.maps.InfoWindow()

            // console.log('in initMap serive', service)
            // setServiceState(service)

            // centerSearch();
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
        let tmpResult = null;

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
                if (tmpResult === null) {
                    tmpResult = results;
                } else {
                    tmpResult = tmpResult.concat(results);
                }

                if (pagetoken.hasNextPage) {
                    console.log('next!!')
                    pagetoken.nextPage();
                } else {
                    console.log('end!!')
                    searchFiltering(tmpResult)
                }

            }


        })
    }

    const initSearchBox = () => {
        const searchInputEl = document.getElementById('input');
        const searchBox = new google.maps.places.SearchBox(searchInputEl);

        map.addListener("bounds_changed", () => {
            searchBox.setBounds(map.getBounds());
        })

        searchBox.addListener("places_changed", () => {
            const places = searchBox.getPlaces();

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

    const createMarker = (place, index) => {
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
            map.panTo({ lat: place.Latitude, lng: place.Longitude })
            setResults((prev) => prev !== null && prev.map((v, i) => ({
                ...v, selected: (i === index ? true : false)
            })))
            setOpenDetail(true)
        })

        return marker;
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

    const searchFiltering = (tmpResult) => {
        console.log('in searchFiltering', tmpResult)

        LS2FindRestaurant().then(async (db_results) => {
            const recommend = (db_results[0].status && db_results[0].status === 'success') ? db_results[0].data.map((item) => item.PlaceID) : []
            const notRecommend = (db_results[1].status && db_results[1].status === 'success') ? db_results[1].data.map((item) => item.PlaceID) : []

            return await recommend.concat(notRecommend);
        }).then((totalRestaurant) => {
            return tmpResult.filter(x => !totalRestaurant.includes(x.place_id))
        })
            .then((updateRestaurant) => {
                if (updateRestaurant.length !== 0) {
                    let tAllMarkers = [];
                    for (let i = 0; i < updateRestaurant.length; i++) {
                        var marker = createMarker(updateRestaurant[i], i);
                        tAllMarkers.push(marker);
                    }

                    setMarkers(tAllMarkers);
                    setSearch((prev) => updateRestaurant)
                }
            })

        setLoading(false);
    }

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
        console.log('search changed', search, search.length)
    }, [search])



    return (
        <div style={{ display: 'flex' }}>
            <div className={classes.listSection}>
                <Paper className={classes.inputPaper}>
                    <InputBase
                        id='input'
                        className={classes.input}
                        placeholder="Search Google Maps"
                    />
                    <IconButton onClick={handleClear} className={classes.iconButton}>
                        <ClearIcon />
                    </IconButton>
                    <Divider className={classes.divider} orientation="vertical" />
                    <IconButton id='searchBtn' className={classes.iconButton}>
                        <SearchIcon />
                    </IconButton>
                </Paper>

                <UpdateList
                    createMarker={createMarker}
                    setMarkers={setMarkers}
                    markers={markers}
                    search={search}
                    setSearch={setSearch}
                    setSelection={() => setSelection()}
                    loading={loading}
                    rows={loading ? []
                        : search.map((item => (({ place_id, name, rating, vicinity, ...item }) => ({ id: place_id, name, rating, vicinity, ...item }))(item)))
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
                    clickBtn={() => { console.log('click recommend!') }}
                    reviews={[]}
                />
            </div>
        </div>
    )
}

const UpdateList = (props) => {

    const { loading, rows, setSearch, search, markers, setMarkers, createMarker } = props;
    const [selectionModel, setSelectionModel] = useState([]);

    const columns = [
        { field: 'name', headerName: 'Name', width: '150' },
        { field: 'rating', headerName: 'Rating', width: '75' },
        { field: 'vicinity', headerName: 'Vicinity', width: '125' }
    ]

    console.log('rows', rows)
    console.log('props markers?', markers)


    // const dumiRows = [
    //     { id: 1, name: 'Snow', rating: 'Jon', vicinity: 35, test: 't' },
    //     { id: 2, name: 'Lannister', rating: 'Cersei', vicinity: 42, test: 't' },
    //     { id: 3, name: 'Lannister', rating: 'Jaime', vicinity: 45, test: 't' },
    //     { id: 4, name: 'Stark', rating: 'Arya', vicinity: 16, test: 't' },
    //     { id: 5, name: 'Targaryen', rating: 'Daenerys', vicinity: null, test: 't' },
    //     { id: 6, name: 'Melisandre', rating: null, vicinity: 150, test: 't' },
    //     { id: 7, name: 'Clifford', rating: 'Ferrara', vicinity: 44, test: 't' },
    //     { id: 8, name: 'Frances', rating: 'Rossini', vicinity: 36, test: 't' },
    //     { id: 9, name: 'Roxie', rating: 'Harvey', vicinity: 65, test: 't' },
    // ];

    useEffect(() => {
        console.log('selectionModel changed', selectionModel)
    }, [selectionModel])

    const handleUpdate = () => {

        if (selectionModel) {

            let responseList = [];
            let indexList = [];

            async function updateCall(responseList, indexList) {
                await selectionModel.map((item) => {
                    let lastIndex = -1;

                    const res = rows.find((element, index, array) => {
                        lastIndex = index;
                        return item === element.id;
                    })

                    if (res !== undefined) {
                        putRestaurant(res).then((result) => {
                        })
                    }
                })
            }

            updateCall(responseList, indexList);
            const tmp = search.slice();
            const tmpMarker = markers.slice();

            let tAllMarkers = [];
            let i = 0;
            markers.map((marker, index) => {
                if (selectionModel.includes(tmp[index].place_id)) {
                    marker.setMap(null);
                } else {
                    tAllMarkers.push(tmpMarker[index])
                }
            })
            setMarkers(tAllMarkers)

            setSearch((prev) => prev.filter(x => !selectionModel.includes(x.place_id)))
        }
    }

    return (
        <DataGrid
            pageSize={10}
            rows={rows}
            loading={loading}
            columns={columns}
            checkboxSelection

            onSelectionModelChange={(newSelection) => {
                setSelectionModel(newSelection);
            }}
            selectionModel={selectionModel}

            components={{ Toolbar: UpdateListToolbar }}
            componentsProps={{ toolbar: { selectionModel: selectionModel, handleUpdate: handleUpdate } }}
        // disableSelectionOnClick
        >

        </DataGrid>

    )
}

const UpdateListToolbar = (props) => {
    const classes = useStyles();
    const { selectionModel, handleUpdate } = props;
    const numSelected = selectionModel ? selectionModel.length : 0;

    return (
        <Toolbar>
            {numSelected > 0 ? (
                <Typography className={classes.UpdateListToolBarTitle}>{numSelected} selected</Typography>
            ) : (
                <Typography className={classes.UpdateListToolBarTitle}>Updateable List</Typography>
            )}

            {numSelected > 0 && (
                <Tooltip title="Update">
                    <IconButton onClick={handleUpdate}>
                        <UpdateIcon />
                    </IconButton>
                </Tooltip>
            )}

        </Toolbar>

    )
}

export default AdminAttraction;