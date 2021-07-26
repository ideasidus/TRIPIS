import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import MyMarker from "./MyMarker";
import axios from "axios";

import { Loader } from 'google-maps';

import PlacesList from './placeList';

import SearchInput from "./component/searchInput";

/* eslint-disable no-undef */

const center = { lat: 35.886058, lng: 128.611335 };


const Map = (props) => {

  // let map, service, location, infowindow;
  const CONFIGURATION = { "capabilities": { "input": true, "autocomplete": true, "directions": true, "distanceMatrix": true, "details": true }, "locations": [{ "title": "정식당", "address1": "대한민국 대구광역시 대현동 대현동 189-7번지 1층 북구 대구광역시 KR", "coords": { "lat": 35.8848305071286, "lng": 128.60908605889546 }, "placeId": "ChIJ7YddJXjhZTURMYEra6JJVGA" }], "mapOptions": {}, "mapsApiKey": "AIzaSyCrT38oSig-WBhPCJyBRuJzO_dkR_hZdFo" };

  const [searchLocation, setSearchLocation] = useState(null);
  const [selectedLocationIdx, setSelectedLocationIdx] = useState(null);
  const [searchLocationMarker, setSearchLocationMarker] = useState(null);
  const [userCountry, setUserCountry] = useState(null);

  const [results, setResults] = useState([]);

  const locations = CONFIGURATION.locations || []
  const mapOptions = CONFIGURATION.mapOptions;

  const mapEl = document.getElementById('map');

  const map = new google.maps.Map(mapEl, {
    fullscreenControl: mapOptions.fullscreenControl,
    zoomControl: mapOptions.zoomControl,
    streetViewControl: mapOptions.streetViewControl,
    mapTypeControl: mapOptions.mapTypeControl,
    mapTypeControlOptions: {
      position: google.maps.ControlPosition.TOP_RIGHT,
    },
  })

  const selectResultItem = (locationIdx, panTomarker) => {
    setSelectedLocationIdx(locationIdx)

    setResults((prev) => prev.map((v, i) => ({ ...v, 'selected': i == locationIdx ? true : false })))

    if (panToMarker && (locationIdx != null)) {
      map.panTo(locations[locationIdx].coords)
    }
  }

  const markers = locations.map((location, index) => {
    const marker = new google.maps.Marker({
      position: location.coords,
      map: map,
      title: location.title,
    })

    marker.addListener('click', () => {
      selectResultItem(index, false);
    })

    return marker;
  })

  const updateBounds = () => {
    const bounds = new google.maps.LatLngBounds();
    if (searchLocationMarker) {
      bounds.extend(searchLocationMarker.getPosition());
    }

    markers.map((item, index) => {
      bounds.extend(item.getPosition());
    })

    map.fitBounds(bounds);
  };

  updateBounds();

  // const renderResultsList = () => {
  //   let tLocations = locations.slice();

  //   tLocations.map((item, index) => {
  //     item.index = index
  //   })

  //   const resultItemContext = {
  //     locations: tLocations,
  //     showDirectionsButton: !!searchLocation
  //   }
  // }



  // const createMarker = (place) => {
  //   if (!place.geometry || !place.geometry.location) return;
  //   const marker = new google.maps.Marker({
  //     map,
  //     position: place.geometry.location
  //   });

  //   google.maps.event.addListener(marker, "click", () => {
  //     infowindow.setContent(place.name || "");
  //     infowindow.open(map);
  //   });
  // }

  // const getRestaurant = () => {
  //   const request = {
  //     location: location,
  //     radius: 1000,
  //     type: 'restaurant'
  //   };

  //   service.nearbySearch(request, (results, status) => {
  //     console.log('results', results)
  //     if (status === google.maps.places.PlacesServiceStatus.OK && results) {
  //       for (let i = 0; i < results.length; i++) {
  //         createMarker(results[i]);
  //       }

  //       if (results[0].geometry != null && results[0].geometry.location != null) {
  //         map.setCenter(results[0].geometry.location);
  //       }

  //     }
  //   })
  // }


  useEffect(() => {
    // map = new google.maps.Map(document.getElementById("map"), {
    //   center: { lat: center.lat, lng: center.lng },
    //   zoom: 15,
    // })

    // service = new google.maps.places.PlacesService(map);
    // location = new google.maps.LatLng(center.lat, center.lng)
    // infowindow = new google.maps.InfoWindow();

    initLocator(CONFIGURATION)

  }, [])

  return (
    <div style={{ display: 'flex' }}>
      {/* <button onClick={getRestaurant}>Get Restaurant</button> */}
      <div style={{ width: '20vw', minWidth: 400, }}>
        <SearchInput google={google} />

        <div className="results">
          <div id="results-section-name">
            {searchLocation ? `Nearest locations (${locations.length})` : `All locations (${locations.length})`}
          </div>
          <ul id="location-results-list"></ul>
        </div>
      </div>
      <div id="map" className="map">
        test
      </div>
    </div>


  );
};

export default Map;
