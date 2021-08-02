import logo from './logo.svg';

import { HashRouter as Router, Route, Switch } from "react-router-dom";
import React from 'react'

import './App.css';
import Map from './component/map'
import AdminMap from './component/adminMap'
import Test from './component/test'
import SideNav from './component/sideNav';

const App = () => {

  // const [mapLoad, setMapLoad] = React.useState(false);
  // const googleMapScript = document.getElementById('googleMap').addEventListener('load', () => {
  //   console.log('Google Map is Loaded!')
  //   setMapLoad(true)
  // })


  return  (
    <div className="App" style={{display:"flex"}}>
      <Router>
        <SideNav/>
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
