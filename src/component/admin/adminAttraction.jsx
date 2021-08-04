import { useState, Fragment } from 'react'
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import UpdateIcon from '@material-ui/icons/Update';

import { useSnackbar } from 'notistack';

import { makeStyles } from '@material-ui/core/styles';
import { Paper, IconButton, Divider, InputBase, Button, Tabs, CircularProgress, Toolbar, Tooltip, Typography, AppBar, Tab } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { useEffect } from 'react';

import { DetailItem } from '../map';

import { findAttraction as LS2FindAttraction, findCenter } from '../../LS2Request/Find';
import { putAttraction } from '../../LS2Request/Put';
import { useHistory } from 'react-router-dom';

import haversine from 'haversine-distance'
import { TabContext, TabList, TabPanel } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        background: 'white',
    },

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
    tabPanel: {
        height: '90vh',
        padding: 0,
    }
}))

/* eslint-disable no-undef */

const AdminAttraction = (props) => {
    let map, service, location, infowindow, geocoder, searchBox;
    const { center } = props;
    let history = useHistory();

    // let markers = [];
    const classes = useStyles()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [input, setInput] = useState('');
    const [updateMarkers, setUpdateMarkers] = useState([]);
    const [registMarkers, setRegistMarkers] = useState([]);

    const [search, setSearch] = useState([]);
    const [regist, setRegist] = useState([]);

    const [serviceState, setServiceState] = useState(null);
    const [mapState, setMapState] = useState(null);
    const [loading, setLoading] = useState(false);

    const [tabValue, setTabValue] = useState('0');

    console.log('in attraction')


    const handleClear = () => {
        setInput('')
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

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
        google.maps.event.addListener(marker, "click", () => showCenterInfoWindow(marker, name, lat, lng));
    }

    const showCenterInfoWindow = (marker, name, lat, lng) => {
        let content = document.createElement('div');
        let nameEl = document.createElement('div');
        nameEl.innerText = name;
        content.appendChild(nameEl);

        infowindow.setContent(content);
        infowindow.open(map, marker);
    }

    const initMap = async () => {
        map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: center.Latitude, lng: center.Longitude },
            zoom: 15,
        })
        location = new google.maps.LatLng(center.Latitude, center.Longitude)
        service = new google.maps.places.PlacesService(map);
        infowindow = new google.maps.InfoWindow()

        setServiceState((prev) => service)
        setMapState(map);

        infowindow.setContent()

        centerMarker(center.Name, center.Latitude, center.Longitude)

        await getAttraction();
        await attractionSearch(service, null)
    }

    const getAttraction = () => {
        console.log('start get attraction')

        LS2FindAttraction().then((db_results) => {
            console.log('find result ', db_results)
            const recommend = (db_results[0].status && db_results[0].status === 'success') ? db_results[0].data : []
            const notRecommend = (db_results[1].status && db_results[1].status === 'success') ? db_results[1].data : []

            let sumList = recommend.concat(notRecommend)
            setRegist((prev) => sumList)

            let tAllMarkers = [];
            for (let i = 0; i < sumList.length; i++) {
                var marker = createMarker(sumList[i], i);
                tAllMarkers.push(marker);
            }
            setRegistMarkers(tAllMarkers);
        })
    }


    const attractionSearch = (service, pageToken) => {

        if (!loading) {
            setLoading((prev) => !prev)
        }

        let request;
        let tmpResult = null;

        if (pageToken) {
            request = {
                location: { lat: center.Latitude, lng: center.Longitude },
                radius: 2000,
                type: 'tourist_attraction',
                language: 'en',
                pageToken: pageToken,
            };
        } else {
            console.log('init!!')
            request = {
                location: { lat: center.Latitude, lng: center.Longitude },
                radius: 2000,
                type: 'tourist_attraction',
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
                    setSearch((prev) => tmpResult);
                    // searchFiltering(regist, tmpResult)
                    setLoading(false);
                }

            }


        })
    }

    // const initSearchBox = () => {
    //     const searchInputEl = document.getElementById('input');
    //     const searchBox = new google.maps.places.SearchBox(searchInputEl);

    //     map.addListener("bounds_changed", () => {
    //         searchBox.setBounds(map.getBounds());
    //     })

    //     searchBox.addListener("places_changed", () => {
    //         const places = searchBox.getPlaces();

    //         if (places.length === 0) {
    //             return;
    //         }

    //         // clear marker
    //         markers.forEach((marker) => {
    //             marker.setMap(null);
    //         });
    //         setMarkers([]);

    //         const bounds = new google.maps.LatLngBounds();
    //         places.forEach((place) => {
    //             if (!place.geometry || !place.geometry.location) {
    //                 return;
    //             }

    //             if (place.geometry.viewport) {
    //                 bounds.union(place.geometry.viewport);
    //             } else {
    //                 bounds.extend(place.geometry.location)
    //             }
    //         })
    //         map.fitBounds(bounds)

    //     })
    // }

    const createMarker = (place, index) => {
        if (place.geometry) {
            console.log('place geometry exist = update', mapState)
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
                map.panTo(place.geometry.location)
                setResults((prev) => prev !== null && prev.map((v, i) => ({
                    ...v, selected: (i === index ? true : false)
                })))
                setOpenDetail(true)
            })

            return marker;

        } else {
            console.log('place geometry is null = regist')
            const marker = new google.maps.Marker({
                map: map,
                position: { lat: place.Latitude, lng: place.Longitude },
                label: numToSSColumn(index + 1),
            });

            google.maps.event.addListener(marker, "click", () => {
                infowindow.setContent(place.Name || "");
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

    const searchFilteringFunc = (regist, search) => {
        const tmpS = search.map((item => (({ place_id, name, rating, vicinity, ...item }) => ({ id: place_id, name, rating, vicinity, ...item }))(item)))
        const tmpR = regist.map((item) => item.PlaceID)
        let update = tmpS.filter(x => !tmpR.includes(x.id))

        

        if (update.length != updateMarkers.length && updateMarkers.length == 0) {
            console.log('searchFilterginFunc')
            let tAllMarkers = [];
            for (let i = 0; i < update.length; i++) {
                console.log('createMarker!!', i)
                var marker = createMarker(update[i], i)
                tAllMarkers.push(marker)
            }
            setUpdateMarkers((prev) => tAllMarkers)
        }

        return update;
    }

    // const searchFiltering = async (regist, tmpResult) => {
    //     console.log('in searchFiltering', tmpResult)

    //     // LS2FindAttraction().then(async (db_results) => {
    //     //     const recommend = (db_results[0].status && db_results[0].status === 'success') ? db_results[0].data.map((item) => item.PlaceID) : []
    //     //     const notRecommend = (db_results[1].status && db_results[1].status === 'success') ? db_results[1].data.map((item) => item.PlaceID) : []

    //     //     return await recommend.concat(notRecommend);
    //     // }).then((totalRestaurant) => {
    //     //     return tmpResult.filter(x => !totalRestaurant.includes(x.place_id))
    //     // })
    //     // .then((updateRestaurant) => {
    //     //     if (updateRestaurant.length !== 0) {
    //     //         let tAllMarkers = [];
    //     //         for (let i = 0; i < updateRestaurant.length; i++) {
    //     //             var marker = createMarker(updateRestaurant[i], i);
    //     //             tAllMarkers.push(marker);
    //     //         }

    //     //         setMarkers(tAllMarkers);
    //     //         setSearch((prev) => updateRestaurant)
    //     //     }
    //     // })

    //     console.log('in searchFiltering regist?', regist)
    //     let updateRestaurant = tmpResult.filter(x => !regist.includes(x.place_id))
    //     if (updateRestaurant.length !== 0) {
    //         let tAllMarkers = [];
    //         for (let i = 0; i < updateRestaurant.length; i++) {
    //             var marker = createMarker(updateRestaurant[i], i);
    //             tAllMarkers.push(marker);
    //         }
    //         setMarkers(tAllMarkers);
    //         setSearch((prev) => updateRestaurant)
    //     }

    //     setLoading(false);
    // }

    const handleUpdate = (selectionModel) => {
        console.log('click update btn')
        console.log('markers?', updateMarkers)

        if (selectionModel) {
            let responseList = [];
            let indexList = [];

            async function updateCall(responseList, indexList) {
                await selectionModel.map((item, i) => {
                    let lastIndex = -1;

                    const res = search.find((element, index, array) => {
                        lastIndex = index;
                        return item === element.place_id;
                    })

                    if (res !== undefined) {

                        (x => {
                            setTimeout(() => {
                                console.log('500ms wait,,,', x)
                                let request = {
                                    placeId: res.place_id,
                                    fields: ['name', 'formatted_address', 'place_id', 'geometry', 'formatted_phone_number']
                                }
                                serviceState.getDetails(request, (place, status) => {
                                    console.log('after getDetail', place, status)
                                    if (status === google.maps.places.PlacesServiceStatus.OK &&
                                        place && place.geometry && place.geometry.location
                                    ) {
                                        console.log('result place:', place)
                                        putAttraction(
                                            Object.assign(res, {
                                                address: place.formatted_address,
                                                phone: place.formatted_phone_number,
                                                distance: Math.round(haversine([res.geometry.location.lng(), res.geometry.location.lat()], [center.Longitude, center.Latitude]))
                                            }))
                                    }
                                })
                            }, 400 * (x))
                        })(i)
                    }
                })
            }

            updateCall(responseList, indexList);

            const tmp = searchFilteringFunc(regist, search);
            const tmpMarker = updateMarkers.slice();

            console.log('selection model',selectionModel)
            console.log('tmp',tmp)
            let tAllMarkers = [];
            let i = 0;
            updateMarkers.map((marker, index) => {
                if (selectionModel.includes(tmp[index].id)) {
                    console.log('delete', index)
                    marker.setMap(null);
                } else {
                    console.log('remain', index)
                    tAllMarkers.push(tmpMarker[index])
                }
            })
            setUpdateMarkers(tAllMarkers)

            setSearch((prev) => prev.filter(x => !selectionModel.includes(x.place_id)))
        }
    }

    useEffect(() => {
        initMap()

        // initSearchBox();
    }, [])

    useEffect(() => {
        console.log('search changed', search, search.length)
    }, [search])

    useEffect(() => {
        console.log('regist changed', regist)
    }, [regist])

    useEffect(() => {
        console.log('tabValue change', tabValue)
        console.log('\tmap', map)
        console.log('\tmap', mapState)
        console.log('\tregisterMarker', registMarkers)
        console.log('\tupdateMarker', updateMarkers)

        if (tabValue == '1') {
            for (let i = 0; i < updateMarkers.length; i++) {
                updateMarkers[i].setMap(mapState);
            }
            for (let j = 0; j < registMarkers.length; j++) {
                registMarkers[j].setMap(null);
            }

        } else {
            for (let i = 0; i < updateMarkers.length; i++) {
                updateMarkers[i].setMap(null);
            }
            for (let j = 0; j < registMarkers.length; j++) {
                registMarkers[j].setMap(mapState);
            }
        }
    }, [tabValue])



    return (
        <div className={classes.root}>
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

                <TabContext value={tabValue}>
                    <AppBar position="static">
                        <TabList onChange={handleTabChange} >
                            <Tab label="Registered" value="0" />
                            <Tab label="Update" value="1" />

                        </TabList>
                    </AppBar>

                    <TabPanel value="0" className={classes.tabPanel}>
                        <RegistList
                            markers={registMarkers}
                            loading={loading}
                            rows={loading ? []
                                : regist.map((item => (({ PlaceID, Name, TotalRate, Address, ...item }) => ({ id: PlaceID, name: Name, rating: TotalRate, vicinity: Address, ...item }))(item)))
                            }
                        />
                    </TabPanel>
                    <TabPanel value="1" className={classes.tabPanel}>
                        {/* update */}
                        <UpdateList
                            updateList={loading ? [] : searchFilteringFunc(regist, search)}
                            handleUpdate={handleUpdate}
                            markers={updateMarkers}
                            loading={loading}
                            search={loading ? []
                                : search.map((item => (({ place_id, name, rating, vicinity, ...item }) => ({ id: place_id, name, rating, vicinity, ...item }))(item)))
                            }
                            regist={loading ? []
                                : regist.map((item) => item.PlaceID)
                            }
                        />
                    </TabPanel>

                </TabContext>


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

    const { loading, search, regist, updateList } = props;
    const [selectionModel, setSelectionModel] = useState([]);

    const columns = [
        { field: 'name', headerName: 'Name', width: '150' },
        { field: 'rating', headerName: 'Rating', width: '75' },
        { field: 'vicinity', headerName: 'Vicinity', width: '125' }
    ]


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
        props.handleUpdate(selectionModel)
    }

    return (
        <DataGrid
            pageSize={10}
            rows={updateList}
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
                <Typography className={classes.UpdateListToolBarTitle}>Attraction Updateable List</Typography>
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


const RegistList = (props) => {

    const { loading, rows, markers } = props;
    const [selectionModel, setSelectionModel] = useState([]);

    const columns = [
        { field: 'name', headerName: 'Name', width: '150' },
        { field: 'rating', headerName: 'Rating', width: '75' },
        { field: 'vicinity', headerName: 'Vicinity', width: '125' }
    ]

    return (
        <DataGrid
            pageSize={10}
            rows={rows}
            loading={loading}
            columns={columns}
            // checkboxSelection

            onSelectionModelChange={(newSelection) => {
                setSelectionModel(newSelection);
            }}
            selectionModel={selectionModel}

            components={{ Toolbar: RegistListToolbar }}
            componentsProps={{ toolbar: { selectionModel: selectionModel } }}
        >

        </DataGrid>

    )
}

const RegistListToolbar = (props) => {
    const classes = useStyles();
    const { selectionModel } = props;
    const numSelected = selectionModel ? selectionModel.length : 0;

    return (
        <Toolbar>
            {numSelected > 0 ? (
                <Typography className={classes.UpdateListToolBarTitle}>{numSelected} selected</Typography>
            ) : (
                <Typography className={classes.UpdateListToolBarTitle}>Attraction Regist List</Typography>
            )}

            {numSelected > 0 && (
                <Tooltip title="Regist">
                    <IconButton>
                        <UpdateIcon />
                    </IconButton>
                </Tooltip>
            )}

        </Toolbar>

    )
}
export default AdminAttraction;