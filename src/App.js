import logo from './logo.svg';

import { HashRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import React, { useState, useEffect } from 'react'

import './App.css';
import Map from './component/map'
import AdminRestaurant from './component/admin/adminRestaurant';
import AdminAttraction from './component/admin/adminAttraction';
import Test from './component/test'
import SideNav from './component/sideNav';

import weatherAPI from './component/weather';


import { putKindALL } from './LS2Request/PutKind';
import { findCenter } from './LS2Request/Find';

const App = () => {

  // const [mapLoad, setMapLoad] = React.useState(false);
  // const googleMapScript = document.getElementById('googleMap').addEventListener('load', () => {
  //   console.log('Google Map is Loaded!')
  //   setMapLoad(true)
  // })

  const [weatherTemp, setWeatherTemp] = useState('');
  const [weatherIcon, setWeatherIcon] = useState('');
  const [weatherDesc, setWeatherDesc] = useState('');
  const [center, setCenter] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let response;
    // function getWeather() {
    //   response = weatherAPI().then((result) => {
    //     console.log('weather result', result)
    //     if (result.status === "success") {
    //       console.log('in success', result.temp, result.icon, result.desc)
    //       setWeatherTemp((prev) => result.temp)
    //       setWeatherIcon((prev) => result.icon)
    //       setWeatherDesc((prev) => result.desc)
    //     }
    //   });
    // }

    putKindALL();

    const getWeather = weatherAPI().then((result) => {
      console.log('weather result', result)
      if (result.status === "success") {
        console.log('in success', result.temp, result.icon, result.desc)
        setWeatherTemp((prev) => result.temp)
        setWeatherIcon((prev) => result.icon)
        setWeatherDesc((prev) => result.desc)
      }
    });
    const getCenter = findCenter().then((result) => {
      if (result.status === 'success') {
        console.log('success center', result)
        setCenter(result.data[0]);
      } else {
        setCenter(null)
      }
    })
    
    Promise.all([getWeather, getCenter]).then((results) => {
      setLoading(true)
    })

    
  }, [])

  return loading && (
    <div className="App" style={{ display: "flex" }}>
      <Router>
        <SideNav weatherTemp={weatherTemp} weatherIcon={weatherIcon} weatherDesc={weatherDesc} center={center} />
        <Switch>

          <Route path="/restaurant" component={() => <Map type='restaurant' center={center}/>} />
          <Route path="/attraction" component={() => <Map type='tourist_attraction' center={center}/>} />
          <Route path="/event" component={() => <Map type='lodging' center={center}/>} />

          {/* {center == null && <Redirect from="/" to="/admin"/> } */}
          <Route exact path="/admin" component={() => <Test />} />
          {center != null && <Route path="/admin/restaurant" component={() => <AdminRestaurant center={center} />} />}
          {center != null && <Route path="/admin/attraction" component={() => <AdminAttraction center={center} />} />}
          {center != null && <Route path="/admin/event" component={() => <AdminRestaurant center={center} />} />}
          <Route path="/test" component={() => <Test />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
