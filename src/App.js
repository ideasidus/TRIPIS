import logo from './logo.svg';

import { HashRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import React, { useState, useEffect } from 'react'

import './App.css';
import Map from './component/map'
import AdminMap from './component/adminMap'
import Test from './component/test'
import SideNav from './component/sideNav';

import weatherAPI from './component/weather';


import { putKindALL } from './LS2Request/PutKind';

const App = () => {

  // const [mapLoad, setMapLoad] = React.useState(false);
  // const googleMapScript = document.getElementById('googleMap').addEventListener('load', () => {
  //   console.log('Google Map is Loaded!')
  //   setMapLoad(true)
  // })

  const [weatherTemp, setWeatherTemp] = useState('');
  const [weatherIcon, setWeatherIcon] = useState('');
  const [weatherDesc, setWeatherDesc] = useState('');
  const [loading, setLoading] = useState(false);

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
          setLoading(true);
        }
      });
    }

    getWeather();

    console.log("Make DB!")
    putKindALL();
  }, [])

  return loading && (
    <div className="App" style={{ display: "flex" }}>
      <Router>
        <SideNav weatherTemp={weatherTemp} weatherIcon={weatherIcon} weatherDesc={weatherDesc}/>
        <Switch>
          <Redirect exact from="/" to="/restaurant"/>
          <Route path="/restaurant" component={() => <Map type='restaurant'></Map>} />
          <Route path="/attraction" component={() => <Map type='tourist_attraction'></Map>} />
          <Route path="/event" component={() => <Map type='lodging'></Map>} />
          <Route path="/admin" component={() => <AdminMap />} />
          <Route path="/test" component={() => <Test />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
