import logo from './logo.svg';

import { HashRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import React, { useState, useEffect } from 'react'

import './App.css';
import Map from './component/map'
import AdminMap from './component/adminMap'
import Test from './component/test'
import SideNav from './component/sideNav';

import weatherAPI from './component/weather';

import LS2Request from "@enact/webos/LS2Request";

const App = () => {

  // const [mapLoad, setMapLoad] = React.useState(false);
  // const googleMapScript = document.getElementById('googleMap').addEventListener('load', () => {
  //   console.log('Google Map is Loaded!')
  //   setMapLoad(true)
  // })

  const [weatherTemp, setWeatherTemp] = useState('');
  const [weatherIcon, setWeatherIcon] = useState('');
  const [weatherDesc, setWeatherDesc] = useState('');

  useEffect(() => {
    let response;
    function getWeather() {
      response = weatherAPI().then((result) => {
        console.log('weather result', result)
        if (result.status === "success") {
          console.log('in success', result.temp, result.icon, result.desc)
          setWeatherTemp((prev) => result.temp)
          setWeatherIcon((prev) => result.icon)
          setWeatherDesc((prev) => result.desc)
        }
      });
    }

    getWeather();

    console.log("Make DB!")
    new LS2Request().send({
      service: 'com.webos.service.db',
      method: 'putKind',
      parameters: {
          "id":"com.trip.info:1",
          "owner":"com.tripis.app", 
          "schema": {
              "type":"object",
              "properties": {
                  "PlaceID":{"type":"string"},
                  "Name":{"type":"string"},
                  "Latitude":{"type":"number"},
                  "Longitude":{"type":"number"},
                  "Address":{"type":"string"},
                  "Distance":{"type":"number"},
                  "DistanceRate":{"type":"number"},
                  "NumberOfRate":{"type":"number"},
                  "PhoneNumber":{"type":"string"},
                  "TasteRate":{"type":"number"},
                  "TotalRate":{"type":"number"},
                  "AveragePrice":{"type":"number"},
                  "NumberOFCustomer":{"type":"number"},
                  "HostRecommendation":{"type":"boolean"}
              }
          },
          "indexes":[
              {
                  "name":"indexPlaceID",
                  "props":[{"name":"PlaceID"}]
              },
              {
                  "name":"indexName",
                  "props":[{"name":"Name"}]
              },
              {
                  "name":"indexDistance",
                  "props":[{"name":"Distance"}]
              },
              {
                  "name":"indexDistanceRate",
                  "props":[{"name":"DistanceRate"}]
              },
              {
                  "name":"indexNumberOfRate",
                  "props":[{"name":"NumberOfRate"}]
              },
              {
                  "name":"indexTasteRate",
                  "props":[{"name":"TasteRate"}]
              },
              {
                  "name":"indexTotalRate",
                  "props":[{"name":"TotalRate"}]
              },
              {
                  "name":"indexAveragePrice",
                  "props":[{"name":"AveragePrice"}]
              },
              {
                  "name":"indexNumberOfCustomer",
                  "props":[{"name":"NumberOFCustomer"}]
              },
              {
                  "name":"indexHostRecommendation",
                  "props":[{"name":"HostRecommendation"}]
              }
          ]
      },
      onSuccess: (res) => {
          console.log('\t',res.results);
      },
      onFailure: (res) => {
          console.log('\t',res);
      }
    })
    new LS2Request().send({
      service: 'com.webos.service.db',
      method: 'putKind',
      parameters: {
          "id":"com.trip.info:2",
          "owner":"com.tripis.app", 
          "schema": {
              "type":"object",
              "properties": {
                  "PlaceID":{"type":"string"},
                  "Name":{"type":"string"},
                  "Latitude":{"type":"number"},
                  "Longitude":{"type":"number"},
                  "Address":{"type":"string"},
                  "Distance":{"type":"number"},
                  "DistanceRate":{"type":"number"},
                  "NumberOfRate":{"type":"number"},
                  "PhoneNumber":{"type":"string"},
                  "ReservationRequired":{"type":"boolean"},
                  "SatisfactionRate":{"type":"number"},
                  "TotalRate":{"type":"number"},
                  "Fees":{"type":"boolean"},
                  "HostRecommendation":{"type":"boolean"}
              }
          },
          "indexes":[
              {
                  "name":"indexPlaceID",
                  "props":[{"name":"PlaceID"}]
              },
              {
                  "name":"indexName",
                  "props":[{"name":"Name"}]
              },
              {
                  "name":"indexDistance",
                  "props":[{"name":"Distance"}]
              },
              {
                  "name":"indexDistanceRate",
                  "props":[{"name":"DistanceRate"}]
              },
              {
                  "name":"indexNumberOfRate",
                  "props":[{"name":"NumberOfRate"}]
              },
              {
                  "name":"indexReservationRequired",
                  "props":[{"name":"ReservationRequired"}]
              },
              {
                  "name":"indexSatisfactionRate",
                  "props":[{"name":"SatisfactionRate"}]
              },
              {
                  "name":"indexTotalRate",
                  "props":[{"name":"TotalRate"}]
              },
              {
                  "name":"indexFees",
                  "props":[{"name":"Fees"}]
              },
              {
                  "name":"indexHostRecommendation",
                  "props":[{"name":"HostRecommendation"}]
              }
          ]
      },
      onSuccess: (res) => {
          console.log('\t',res.results);
      },
      onFailure: (res) => {
          console.log('\t',res);
      }
    })
    new LS2Request().send({
      service: 'com.webos.service.db',
      method: 'putKind',
      parameters: {
          "id":"com.trip.info:3",
          "owner":"com.tripis.app", 
          "schema": {
              "type":"object",
              "properties": {
                  "PlaceID":{"type":"string"},
                  "Name":{"type":"string"},
                  "Latitude":{"type":"number"},
                  "Longitude":{"type":"number"},
                  "Address":{"type":"string"},
                  "Distance":{"type":"number"},								
                  "UserName":{"type":"string"},
                  "Password":{"type":"string"},
                  "DistanceRate":{"type":"number"},
                  "ReservationRequired":{"type":"boolean"},
                  "SatisfactionRate":{"type":"number"},
                  "TotalRate":{"type":"number"},
                  "Fees":{"type":"boolean"},
                  "HostRecommendation":{"type":"boolean"}
              }
          },
          "indexes":[
              {
                  "name":"indexPlaceID",
                  "props":[{"name":"PlaceID"}]
              },
              {
                  "name":"indexName",
                  "props":[{"name":"Name"}]
              },
              {
                  "name":"indexDistance",
                  "props":[{"name":"Distance"}]
              },
              {
                  "name":"indexDistanceRate",
                  "props":[{"name":"DistanceRate"}]
              },
              {
                  "name":"indexReservationRequired",
                  "props":[{"name":"ReservationRequired"}]
              },
              {
                  "name":"indexSatisfactionRate",
                  "props":[{"name":"SatisfactionRate"}]
              },
              {
                  "name":"indexTotalRate",
                  "props":[{"name":"TotalRate"}]
              },
              {
                  "name":"indexFees",
                  "props":[{"name":"Fees"}]
              },
              {
                  "name":"indexHostRecommendation",
                  "props":[{"name":"HostRecommendation"}]
              }
          ]
      },
      onSuccess: (res) => {
          console.log('\t',res.results);
      },
      onFailure: (res) => {
          console.log('\t',res);
      }
    })
    // make restaurant review DB
    new LS2Request().send({
      service: 'com.webos.service.db',
      method: 'putKind',
      parameters: {
          "id":"com.trip.info:4",
          "owner":"com.tripis.app", 
          "schema": {
              "type":"object",
              "properties": {
                  "PlaceID":{"type":"string"},
                  "UserName":{"type":"string"},
                  "Password":{"type":"string"},
                  "DistanceRate":{"type":"number"},
                  "TasteRate":{"type":"number"},
                  "TotalRate":{"type":"number"},
                  "TotalPrice":{"type":"number"},
                  "NumberOFCustomer":{"type":"number"}
              }
          },
          "indexes":[
              {
                  "name":"indexPlaceID",
                  "props":[{"name":"PlaceID"}]
              },
              {
                  "name":"indexDistanceRate",
                  "props":[{"name":"DistanceRate"}]
              },
              {
                  "name":"indexTasteRate",
                  "props":[{"name":"TasteRate"}]
              },
              {
                  "name":"indexTotalRate",
                  "props":[{"name":"TotalRate"}]
              },
              {
                  "name":"indexTotalPrice",
                  "props":[{"name":"TotalPrice"}]
              },
              {
                  "name":"indexNumberOfCustomer",
                  "props":[{"name":"NumberOFCustomer"}]
              }
          ]
      },
      onSuccess: (res) => {
          console.log('\t',res.results);
      },
      onFailure: (res) => {
          console.log('\t',res);
      }
    })
    // make attraction review DB
    new LS2Request().send({
      service: 'com.webos.service.db',
      method: 'putKind',
      parameters: {
          "id":"com.trip.info:5",
          "owner":"com.tripis.app", 
          "schema": {
              "type":"object",
              "properties": {
                  "PlaceID":{"type":"string"},
                  "UserName":{"type":"string"},
                  "Password":{"type":"string"},
                  "DistanceRate":{"type":"number"},
                  "ReservationRequired":{"type":"boolean"},
                  "TotalRate":{"type":"number"},
                  "SatisfactionRate":{"type":"number"},
                  "Fees":{"type":"boolean"}
              }
          },
          "indexes":[
              {
                  "name":"indexPlaceID",
                  "props":[{"name":"PlaceID"}]
              },
              {
                  "name":"indexDistanceRate",
                  "props":[{"name":"DistanceRate"}]
              },
              {
                  "name":"indexReservationRequired",
                  "props":[{"name":"ReservationRequired"}]
              },
              {
                  "name":"indexSatisfactionRate",
                  "props":[{"name":"SatisfactionRate"}]
              },
              {
                  "name":"indexFees",
                  "props":[{"name":"Fees"}]
              },
              {
                  "name":"indexTotalRate",
                  "props":[{"name":"TotalRate"}]
              }
          ]
      },
      onSuccess: (res) => {
          console.log('\t',res.results);
      },
      onFailure: (res) => {
          console.log('\t',res);
      }
    })
  }, [])

  return (
    <div className="App" style={{ display: "flex" }}>
      <Router>
        <SideNav weatherTemp={weatherTemp} weatherIcon={weatherIcon} weatherDesc={weatherDesc}/>
        <Switch>
          <Redirect exact from="/" to="/restaurant"/>
          <Route path="/restaurant" component={() => <Map />} />
          <Route path="/admin" component={() => <AdminMap />} />
          <Route path="/test" component={() => <Test />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
