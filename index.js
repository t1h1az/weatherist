"use strict";

const cities = ["new%20york", "cologne", "tokyo"];
const element = React.createElement;
const weatherContainer = document.querySelector("#container");
const windDirection = (deg) => {
  if (deg > 11.25 && deg < 33.75) {
    return "NNE";
  } else if (deg > 33.75 && deg < 56.25) {
    return "ENE";
  } else if (deg > 56.25 && deg < 78.75) {
    return "E";
  } else if (deg > 78.75 && deg < 101.25) {
    return "ESE";
  } else if (deg > 101.25 && deg < 123.75) {
    return "ESE";
  } else if (deg > 123.75 && deg < 146.25) {
    return "SE";
  } else if (deg > 146.25 && deg < 168.75) {
    return "SSE";
  } else if (deg > 168.75 && deg < 191.25) {
    return "S";
  } else if (deg > 191.25 && deg < 213.75) {
    return "SSW";
  } else if (deg > 213.75 && deg < 236.25) {
    return "SW";
  } else if (deg > 236.25 && deg < 258.75) {
    return "WSW";
  } else if (deg > 258.75 && deg < 281.25) {
    return "W";
  } else if (deg > 281.25 && deg < 303.75) {
    return "WNW";
  } else if (deg > 303.75 && deg < 326.25) {
    return "NW";
  } else if (deg > 326.25 && deg < 348.75) {
    return "NNW";
  } else {
    return "N";
  }
};

class SearchBar extends React.Component {
  render() {
    return element("input", {
      key: "search-bar",
    });
  }
}

const WindPanel = (wind) => {
  return React.createElement(
    "div",
    {key: "wind-panel", className: "wind-panel"},
    [
      React.createElement(
        "p",
        {key: "speed"},
        `Windspeed: ${Math.floor(wind.speed)} km/h`
      ),
      React.createElement(
        "p",
        {key: "direction"},
        "Winddirection: " + windDirection(wind.deg)
      ),
    ]
  );
};

const WeatherPanel = ({main, city, weather, wind}) => {
  let timestamp = +new Date();
  let imageElement = React.createElement("img", {
    src: `./assets/svgs/sunny.svg`,
    className: "weather-panel__weather-icon",
  });
  const a = weather[0]?.description;
  a?.toUpperCase;
  let cityElement = React.createElement("h2", {key: "city"}, city);
  let weatherElement = React.createElement("h6", {key: "weather"}, a);
  let temperatureElement = React.createElement(
    "h2",
    {key: "temperature"},
    Math.floor(main.temp) + " \u2103"
  );
  let TemperatureElement = React.createElement(
    "div",
    {key: "info", className: "weather-panel__weather-details"},
    React.createElement(
      "span",

      {key: "temp_max", className: "weather-details__max-temp"},
      "H: " + Math.floor(main.temp_max) + " \u2103"
    ),
    React.createElement(
      "span",
      {key: "temp_min", className: "weather-details__min-temp"},
      "L: " + Math.floor(main.temp_min) + " \u2103"
    )
  );

  return React.createElement(
    "div",
    {key: "weather-panel", className: "weather-panel"},
    [
      imageElement,
      cityElement,
      weatherElement,
      temperatureElement,
      TemperatureElement,
      WindPanel(wind),
    ]
  );
};

const isDayTime = (sunset, sunrise) => {
  let date = new Date();
  if (date <= sunset && date >= sunrise) {
    return true;
  }
  return false;
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      dayTime: false,
      city: "",
      wind: {
        speed: "",
        deg: "",
      },
      weather: "",
      main: {
        feels_like: "",
        humidity: "",
        temp: "",
        temp_max: "",
        temp_min: "",
      },
      sys: "",
    };
  }
  componentDidMount() {
    this.requestWeather();
  }

  requestWeather() {
    return fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=cologne&appid=ff84f45749b2a4665cf37312097a278b&units=metric`
    )
      .then((response) => {
        response.json().then((data) => {
          const {name, wind, weather, main, sys} = data;
          this.setState({city: name, wind, weather, main, sys});
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return React.createElement(
      "main",
      {className: "panel center"},
      WeatherPanel(this.state)
    );
  }
}

ReactDOM.render(element(App, cities), weatherContainer);
