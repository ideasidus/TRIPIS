import logo from './logo.svg';

import { HashRouter as Router, Route, Switch } from "react-router-dom";

import './App.css';
import Map from './component/map'
import AdminMap from './component/adminMap'


function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={() => <Map/>} />
          <Route path="/admin" component={() => <AdminMap/>} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
