"use strict";

const cities = ["cologne", "new%20york", "perth"];
const e = React.createElement;
const weatherContainer = document.querySelector("#container");
const assetsPath = "./assets/svg/";
const OPEN_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const APP_ID = 'ff84f45749b2a4665cf37312097a278b';

const getRequestParams = (city, units = 'metric' ) => {
  return `?q=${city}&appid=${APP_ID}&units=${units}`;
}


const WEATHER_TYPES = new Map();
WEATHER_TYPES.set('overcast clouds', 'partly_cloudy');
WEATHER_TYPES.set('broken clouds', 'partly_cloudy');
WEATHER_TYPES.set('few clouds', 'partly_cloudy');
WEATHER_TYPES.set('scattered clouds', 'partly_cloudy');
WEATHER_TYPES.set('clear sky', 'clear_sky');
WEATHER_TYPES.set('default', 'clear_sky');

const getDayTime = (sunrise, sunset) => {
  let timestamp = new Date;
  if (timestamp <= sunset*1000 && timestamp > sunrise*1000) {
    return "day";
  } else {
    return "night";
  }
};

const WeatherIcon = (weatherType = 'default', sys) =>  {
  const dayTime = getDayTime(sys.sunrise, sys.sunset);
  weatherType = WEATHER_TYPES.get(weatherType);
  return e("img", {
    key: dayTime,
    src: `${assetsPath}/${weatherType}_${dayTime}.svg`,
    className: "weather-panel__weather-icon",
  });
}

const getWindDirection = (deg) => {
  if (deg > 11.25 && deg < 33.75) {
    return "NNE";
  } else if (deg > 33.75 && deg <= 56.25) {
    return "ENE";
  } else if (deg > 56.25 && deg <= 78.75) {
    return "E";
  } else if (deg > 78.75 && deg <= 101.25) {
    return "ESE";
  } else if (deg > 101.25 && deg <= 123.75) {
    return "ESE";
  } else if (deg > 123.75 && deg <= 146.25) {
    return "SE";
  } else if (deg > 146.25 && deg <= 168.75) {
    return "SSE";
  } else if (deg > 168.75 && deg <= 191.25) {
    return "S";
  } else if (deg > 191.25 && deg <= 213.75) {
    return "SSW";
  } else if (deg > 213.75 && deg <= 236.25) {
    return "SW";
  } else if (deg > 236.25 && deg <= 258.75) {
    return "WSW";
  } else if (deg > 258.75 && deg <= 281.25) {
    return "W";
  } else if (deg > 281.25 && deg <= 303.75) {
    return "WNW";
  } else if (deg > 303.75 && deg <= 326.25) {
    return "NW";
  } else if (deg > 326.25 && deg <= 348.75) {
    return "NNW";
  } else {
    return "N";
  }
};

const WindDetails = (wind) => {
  return e("div", {key: "wind-panel", className: "wind-panel"}, [
    e("p", {key: "speed"}, `Windspeed: ${Math.floor(wind.speed)} km/h`),
    e("p", {key: "direction"}, "Winddirection: " + getWindDirection(wind.deg)),
  ]);
};

const WeatherDetails = (main, name) => {
  return e(
    "div",
    {key: `weather-details-${name}`},
    e(
      "div",
      {key: `info-${name}`, className: "weather-panel__weather-details"},
      e(
        "span",

        {key: `temp_max-${name}`, className: "weather-details__max-temp"},
        "High: " + Math.floor(main.temp_max) + " \u2103"
      ),
      e(
        "span",
        {key: `temp_min-${name}`, className: "weather-details__min-temp"},
        "Low: " + Math.floor(main.temp_min) + " \u2103"
      )
    )
  );
};

const GeneralData = (main, name, weather) => {
  const weatherType = weather[0]?.description;
  return e(
    "div",
    {key: `general-weather-${name}`},
    e("h2", {key: "city"}, name),
    e(
      "h6",
      {key: `weather-${name}`, className: "weather-panel__weather-description"},
      weatherType
    ),
    e("h2", {key: `temperature-${name}`}, Math.floor(main.temp) + " \u2103")
  );
};

const WeatherPanel = ({main, name, sys, weather, wind}) => {
  const weatherType = weather[0]?.description;

  return e("div", {key: `weather-panel-${name}`, className: "panel"}, [
    WeatherIcon(weatherType, sys),
    GeneralData(main, name, weather),
    WeatherDetails(main, name),
    WindDetails(wind),
  ]);
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
    };
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    cities.forEach((city) => {
      this.requestWeather(city);
    });
  }

  async requestWeather(city = "cologne") {
    let requestUrl = OPEN_WEATHER_URL + getRequestParams(city)
    let response = await fetch(
      requestUrl
    );
    response = await response.json();

    this.setState(prevState => {
      const locations = prevState.locations;
      locations.push(response)
      return Object.assign(prevState, { locations: [...locations]})
    })
  }

  render() {
    return e(
      "div",
      {className: "weather-panel center"},
      this.state.locations
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((locationData) => WeatherPanel(locationData))
    );
  }
}

ReactDOM.render(e(App, cities), weatherContainer);
