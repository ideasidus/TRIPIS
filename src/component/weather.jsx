import React, { useState } from 'react';
import axios from 'axios';
import dotenv from 'dotenv'

dotenv.config();
const center = { lat: 40.7483475, lng: -73.9864422 };

function weatherAPI() {
    
    // photos, setPhotos 비구조화 할당
    let [photos, setPhotos] = useState([]);
    let [temp, setTemp] = useState(0);

    // 통신 메서드
    function getTempApi() {
        const url = "api.openweathermap.org/data/2.5/weather";
        axios.get(url, {
            params: {
                lat: center.lat,
                lon: center.lng,
                appid: process.env.OPEN_WEATHER_MAP_API_KEY
            }
        })
        .then(function(response) {
            setTemp(response.main.temp);
            setPhotos(response.weather.icon)
            console.log("성공");
        })
        .catch(function(error) {
            console.log("실패");
        })
        
    }

    // 조회 데이터 존재할 경우
    if(photos.length > 0) {
        return (
            <div>
                <img src={`http://openweathermap.org/img/w/${photos}.png`} alt="img" />
                temp: {temp}
            </div>
            
        );
    } else { // 조회 데이터 존재하지 않을 경우
        return (
            <div>
                <button onClick={getTempApi}>Reload</button>
            </div>
        )
    }
}
export default weatherAPI;