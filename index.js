"use strict";

const cities = ["cologne", "new%20york", "perth"];
const e = React.createElement;
const weatherContainer = document.querySelector("#container");

const getDayTime = (sunset, sunrise) => {
  let timeInMilliSeconds = +new Date();
  let timeInSeconds = Math.floor(timeInMilliSeconds / 1000);
  if (timeInSeconds <= sunset && timeInSeconds >= sunrise) {
    return "day";
  } else {
    return "night";
  }
};

const getWeatherIcon = (daytime, weather) => {
  switch (weather[0]?.description) {
    case "scattered clouds":
      return e("img", {
        key: weather[0]?.description,
        src: `./assets/svgs/few_clouds.svg`,
        className: "weather-panel__weather-icon",
      });
      break;
    case "overcast clouds":
      return e("img", {
        key: weather[0]?.description,
        src: `./assets/svgs/overcast.svg`,
        className: "weather-panel__weather-icon",
      });
      break;
    default:
      if (daytime == "day") {
        return e("img", {
          key: daytime,
          src: `./assets/svgs/clear_sky_day.svg`,
          className: "weather-panel__weather-icon",
        });
      } else {
        return e("img", {
          key: daytime,
          src: `./assets/svgs/clear_sky_night.svg`,
          className: "weather-panel__weather-icon",
        });
      }
      break;
  }
};

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
    return e("input", {
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

const WeatherPanel = ({main, weather, wind, name, sys}) => {
  console.log(name);
  let dayTime = getDayTime(sys.sunrise, sys.sunset);
  console.log(dayTime);
  let imageElement = getWeatherIcon(dayTime, weather);
  const a = weather[0]?.description;
  let cityElement = React.createElement("h2", {key: "city"}, name);
  let weatherElement = React.createElement(
    "h6",
    {key: `weather-${name}`, className: "weather-panel__weather-description"},
    a
  );
  let temperatureElement = React.createElement(
    "h2",
    {key: `temperature-${name}`},
    Math.floor(main.temp) + " \u2103"
  );
  let TemperatureElement = React.createElement(
    "div",
    {key: `info-${name}`, className: "weather-panel__weather-details"},
    React.createElement(
      "span",

      {key: `temp_max-${name}`, className: "weather-details__max-temp"},
      "H: " + Math.floor(main.temp_max) + " \u2103"
    ),
    React.createElement(
      "span",
      {key: `temp_min-${name}`, className: "weather-details__min-temp"},
      "L: " + Math.floor(main.temp_min) + " \u2103"
    )
  );

  return React.createElement(
    "div",
    {key: `weather-panel-${name}`, className: "panel"},
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
    const weather = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=ff84f45749b2a4665cf37312097a278b&units=metric`
    )
      .then((response) => {
        response.json().then((res) => {
          let locations = this.state.locations;
          locations.push(res);
          this.setState({locations: [...locations]});
          return;
        });
      })
      .catch((err) => {});
  }

  render() {
    return React.createElement(
      "div",
      {className: "weather-panel center"},
      this.state.locations
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((location) => WeatherPanel(location))
    );
  }
}

ReactDOM.render(e(App, cities), weatherContainer);
