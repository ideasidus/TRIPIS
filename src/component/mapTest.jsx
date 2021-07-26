import React, { useState, useEffect } from "react";
import { Button, ButtonGroup, Divider, List, ListItem } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { Rating } from '@material-ui/lab'

import { useGoogleMaps } from "react-hook-google-maps";

import GoogleMapReact from "google-map-react";
import axios from "axios";

import { Loader } from 'google-maps';

import SearchInput from "./searchInput";

/* eslint-disable no-undef */

const center = { lat: 35.886058, lng: 128.611335 };

const useStyles = makeStyles((theme) => ({

    locationItem: {

    },
}));


const Map = (props) => {
    let service, location, infowindow;

    const {ref, map, google} = useGoogleMaps(
        "AIzaSyCrT38oSig-WBhPCJyBRuJzO_dkR_hZdFo", {
            center: { lat: center.lat, lng: center.lng },
            zoom: 15,
        }
    )

    console.log('init',map, google)

    // const [map, setMap] = useState()
    // const ref = useRef();

    const [results, setResults] = useState(null);


    // useEffect(() => {
    //     const onLoad = () => setMap(new window.google.maps.Map(ref.current, {
    //         center: { lat: center.lat, lng: center.lng },
    //         zoom: 15,
    //     }))

    //     if (!window.google) {
    //         const script = document.createElement('script')
    //         script.src =
    //             `https://maps.googleapis.com/maps/api/js?key=` +
    //             "AIzaSyCrT38oSig-WBhPCJyBRuJzO_dkR_hZdFo"
    //         document.head.append(script)
    //         script.addEventListener(`load`, onLoad)
    //         return () => script.removeEventListener(`load`, onLoad)
    //     } else onLoad()
    // })

    // if (map && typeof onMount === 'function') onMount(map)


    const createMarker = (place, index) => {
        if (!place.geometry || !place.geometry.location) return;
        const marker = new google.maps.Marker({
            map,
            position: place.geometry.location
        });

        google.maps.event.addListener(marker, "click", () => {
            infowindow.setContent(place.name || "");
            infowindow.open(map);
        });

        marker.addListener('click', () => {
            // clickHandler(index, place)
            map.panTo(place.geometry.location)
            setResults((prev) => prev.map((v, i) => ({
                ...v, selected: (i === index ? true : false)
            })))
        })
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
        console.log(mapState)
        // if (!place.geometry || !place.geometry.location) return;
        // map.panTo(place.geometry.location)
        setResults((prev) => prev.map((v, i) => ({
            ...v, selected: (i === index ? true : false)
        })))
    }



    useEffect(() => {
        // map = new google.maps.Map(document.getElementById("map"), {
        //     center: { lat: center.lat, lng: center.lng },
        //     zoom: 15,
        // })

        console.log('map : ', map)
        service = new google.places.PlacesService(map);
        // service = new google.maps.places.PlacesService(map);
        location = new google.maps.LatLng(center.lat, center.lng)
        infowindow = new google.maps.InfoWindow();

    }, [])

    useEffect(() => {
        console.log('results is change', results)
    }, [results])

    return (
        <div style={{ display: 'flex' }}>

            <div style={{ width: '20vw', minWidth: 400, }}>
                <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                    <Button onClick={getRestaurant}>Restaurant</Button>
                    <Button>Attraction</Button>
                    <Button>Event</Button>
                </ButtonGroup>
                <Divider />
                <List>
                    {results !== null && results.map((item, index) => {
                        return <><LocationItem
                            index={index}
                            click={(e) => clickHandler(index, item)}
                            name={item.name}
                            vicinity={item.vicinity}
                            rating={item.rating}
                            selected={item.selected}
                        /><Divider /></>
                    })}
                </List>

                <div class="results">
                </div>
            </div>
            <div ref={ref} style={{ width: 400, height: 300 }} />
            <div id="map" className="map">
                test
            </div>
        </div>


    );
};

const LocationItem = (props) => {

    return (
        <ListItem onClick={props.click} style={{ backgroundColor: props.selected ? '#252525' : '#ffffff' }}>
            {props.name}
            {props.vicinity}
            <Rating name="read-only" value={props.rating} readOnly />
        </ListItem>
    )
}

export default Map;
