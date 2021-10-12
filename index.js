"use strict";

const container = document.getElementById("container");
let element = React.createElement;

const weatherContainer = document.querySelector("#container");

const windPanel = (wind) => {
  let windSpeed = React.createElement(
    "p",
    {key: "speed"},
    "Windgeschwindigkeit: " + wind.speed
  );
  let windDirection = React.createElement(
    "p",
    {key: "direction"},
    "Windrichtung: " + wind.deg
  );
  return React.createElement(
    "div",
    {key: "wind-panel", className: "wind-panel"},
    [windSpeed, windDirection]
  );
};

class WeatherView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wind: "",
      weather: "",
      main: "",
      sys: "",
    };
  }
  componentDidMount() {
    let currentWeather = this.requestWeather();
  }

  requestWeather() {
    return fetch(
      "http://api.openweathermap.org/data/2.5/weather?q=cologne&appid=ff84f45749b2a4665cf37312097a278b"
    )
      .then((response) => {
        response.json().then((data) => {
          const {wind, weather, main, sys} = data;
          this.setState({wind, weather, main, sys});
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    return element("main", {className: "weather-panel"}, [
      windPanel(this.state.wind),
    ]);
  }
}

ReactDOM.render(element(WeatherView), weatherContainer);
