import logo from './logo.svg';

import { HashRouter as Router, Route, Switch } from "react-router-dom";
import React, { useState, useEffect } from 'react'

import './App.css';
import Map from './component/map'
import AdminMap from './component/adminMap'
import Test from './component/test'
import SideNav from './component/sideNav';

import weatherAPI from './component/weather';

const App = () => {

  // const [mapLoad, setMapLoad] = React.useState(false);
  // const googleMapScript = document.getElementById('googleMap').addEventListener('load', () => {
  //   console.log('Google Map is Loaded!')
  //   setMapLoad(true)
  // })

  const [weatherTemp, setWeatherTemp] = useState('');
  const [weatherIcon, setWeahterIcon] = useState('');

  console.log('weather now : ',weatherTemp, weatherIcon)

  useEffect(() => {
    let response;
    function getWeather() {
      response = weatherAPI().then((result) => {
        console.log(result)
        if (result === "success") {
          setWeahterIcon(result.temp)
          setWeahterIcon(result.icon)
        }
      });
      console.log('weather response',response);
    }

    getWeather();
  }, [])

  return (
    <div className="App" style={{ display: "flex" }}>
      <Router>
        <SideNav weatherTemp={weatherTemp} weatherIcon={weatherIcon}/>
        <Switch>
          <Route exact path="/" component={() => <Map />} />
          <Route path="/admin" component={() => <AdminMap />} />
          <Route path="/test" component={() => <Test />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
