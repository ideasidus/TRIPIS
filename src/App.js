import logo from './logo.svg';

import './App.css';
// import Map from "./map";
import Map2 from './component/map'
import MapTest from './component/mapTest'


function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      {/* <SearchInput/> */}
      {/* <MapTest /> */}
      <Map2 />
    </div>
  );
}

export default App;
