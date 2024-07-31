import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';
import './App.css'; // Import your CSS file

const App = () => {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('metric'); // 'metric' for Celsius, 'imperial' for Fahrenheit

  const API_KEY = 'ba0ff2c8fbd73c5f996b7f9b34482703';
  const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

  const handleSearch = async () => {
    try {
      setError(null);
      const response = await axios.get(API_BASE_URL, {
        params: {
          q: location,
          units: unit,
          appid: API_KEY,
        },
      });
      setWeather(response.data);
    } catch (err) {
      setError('Location not found or API request failed.');
    }
  };

  const toggleUnit = () => {
    if (weather) {
      const newUnit = unit === 'metric' ? 'imperial' : 'metric';
      const convertedWeather = { ...weather };

      if (unit === 'metric') {
        // Convert from Celsius to Fahrenheit
        convertedWeather.main.temp = (weather.main.temp * 9/5) + 32;
      } else {
        // Convert from Fahrenheit to Celsius
        convertedWeather.main.temp = (weather.main.temp - 32) * 5/9;
      }

      setWeather(convertedWeather);
      setUnit(newUnit);
    } else {
      setUnit(unit === 'metric' ? 'imperial' : 'metric');
    }
  };

  useEffect(() => {
    if (weather) {
      handleSearch();
    }
  }, [unit]);

  return (
    <div className="app-container">
      <Container maxWidth="sm" style={{ padding: '2rem' }}>
        <Paper style={{ padding: '2rem' }}>
          <Typography variant="h4" gutterBottom>
            Weather App
          </Typography>
          <TextField
            label="Enter City"
            variant="outlined"
            fullWidth
            margin="normal"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Get Weather
          </Button>
          <Button variant="outlined" color="secondary" onClick={toggleUnit} style={{ marginLeft: '1rem' }}>
            {unit === 'metric' ? 'Switch to Fahrenheit' : 'Switch to Celsius'}
          </Button>
          {error && <Typography color="error" style={{ marginTop: '1rem' }}>{error}</Typography>}
          {weather && (
            <div style={{ marginTop: '2rem' }}>
              <Typography variant="h6">
                Temperature: {weather.main.temp.toFixed(1)}°{unit === 'metric' ? 'C' : 'F'}
              </Typography>
              <Typography variant="h6">
                Description: {weather.weather[0].description}
              </Typography>
              <Typography variant="h6">
                Wind Speed: {weather.wind.speed} m/s
              </Typography>
              <Typography variant="h6">
                Humidity: {weather.main.humidity}%
              </Typography>
            </div>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default App;
