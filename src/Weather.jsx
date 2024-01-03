import React, { useState } from 'react';
import './Weather.css';

const gecode = {
    apiKey: '4cb4507936d570bd72ef62bc876e413c',
    base: 'http://api.openweathermap.org/geo/1.0/direct',
};

const api = {
    apiKey: '4cb4507936d570bd72ef62bc876e413c',
    base: 'https://api.openweathermap.org/data/2.5/weather',
};

const Weather = () => {
    const [query, setQuery] = useState('');
    const [weather, setWeather] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setQuery(event.target.value);
    };

    const dateBuilder = (date) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = new Date(date * 1000).toLocaleDateString('en-US', options);

        // Replace commas with spaces
        return formattedDate.replace(/,/g, '');
    };

    const convertKelvinToCelsius = (temperature) => {
        return temperature - 273.15;
    };

    const search = (event) => {
        if (event.key === 'Enter') {
            setLoading(true); // Set loading state

            fetch(`${gecode.base}?q=${query}&appid=${gecode.apiKey}`)
                .then((res) => res.json())
                .then((results) => {
                    console.log('Geocode API response:', results);

                    if (results.length > 0) {
                        const result = results[0];
                        const x = result.lat;
                        const y = result.lon;

                        fetch(`${api.base}?lat=${x}&lon=${y}&appid=${api.apiKey}`)
                            .then((res) => res.json())
                            .then((weatherData) => {
                                console.log('Weather API response:', weatherData);

                                setWeather(weatherData);
                                setQuery('');
                                setLoading(false); // Reset loading state
                            })
                            .catch((error) => {
                                console.log('Error while fetching weather data:', error);
                                setLoading(false); // Reset loading state
                            });
                    } else {
                        console.error('Location not found');
                        setLoading(false); // Reset loading state
                    }
                })
                .catch((error) => {
                    console.error('Error fetching geocode data:', error);
                    setLoading(false); // Reset loading state
                });
        }
    };

    return (
        <div className={(typeof weather.main != "undefined") ? ((weather.main.temp >16)?
        'app warm' : 'app'): 'app'}>
            <main>
                <div className='heading'>
                    <h1>Weather App</h1>
                </div>
                <div className='search-box'>
                    <input
                        type='text'
                        placeholder='Search'
                        className='search-bar'
                        value={query}
                        onChange={handleChange}
                        onKeyPress={search}
                    />
                </div>
                {loading && <div className='loading'>Loading...</div>}
                {weather.main && (
                    <div className='location-box'>
                        <div className='location'>
                            {weather.name} {weather.sys && weather.sys.country}
                        </div>
                        <div className='date'>{weather.dt && dateBuilder(weather.dt)}</div>
                    </div>
                )}
                {weather.main && (
                    <div className='temperature-box'>
                        <div className='temperature'>
                            {convertKelvinToCelsius(weather.main.temp).toFixed(2)} °C
                        </div>
                    </div>
                )}
                {weather.weather && weather.weather[0] && (
                    <div className='weather'>
                        {weather.weather[0].main}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Weather;
