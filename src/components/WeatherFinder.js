import React, { Component, Fragment } from 'react';
import countriesBbox from '../config/countries_bbox';
import Map from '../components/Map';
import {bboxUrl, threshold} from '../config/openWeather';
import logo from '../logo.svg';

class WeatherFinder extends Component {
  state = {
    cityList: [],
    searching: false,
    finished: false,
    currentCountry: null
  };

  handleClick() {
    return () => {
      this.setState({searching: true});

      Promise.all(countriesBbox.map(country => {
        return fetch(bboxUrl(country.bbox)).then((data) => data.json())
      }))
        .then(result => {
          let cityList = {}; // use object for delete duplicate cities
          const finalArray = [];

          result.forEach((country) => {
            const foundCities = country.list && this.findBestCity(country.list);

            if (foundCities) {
              cityList = {...cityList, ...foundCities};
            }
          });

          for(let key in cityList) {
            finalArray.push(cityList[key])
          }

          this.setState({
            cityList: [...finalArray]
          });

      })
        .finally(() => {
          this.setState({
            finished: true,
            searching: false
          });
        });
    }
  }

  findBestCity(data) {
    const cities = {};

    data.forEach(item => {
      const {temp, humidity} = item.main;

      if (parseInt(temp) === threshold.temp && parseInt(humidity) === threshold.humidity) {
        cities[item.name] = {
          name: item.name,
          coords: item.coord,
          temp,
          humidity
        }
      }
    });

    return Object.keys(cities).length > 0 ? cities : null;
  }

  render() {
    const { searching, finished, cityList } = this.state;

    return (
      <Fragment>
        <div>
          <h1>WeatherFinder</h1>
          {
            (!searching && !finished) && <button onClick={this.handleClick()}>Find best weather</button>
          }
          {(searching && !finished) && (
            <h2>We are looking for best cities, please wait <img src={logo} className="loader" alt="logo" /></h2>
          )}
          {
            cityList.length > 0 && (
              <ul className='city-list'>
                {
                  cityList.map(item => (
                    <li key = {`${item.name}`} className="city-item">
                      <span><strong>{item.name}</strong></span>
                      <span>temp - {item.temp}</span>
                      <span>humidity - {item.humidity}</span>
                    </li>
                  ))
                }
              </ul>
            )
          }
        </div>
        <Map markers={finished ? cityList : []}/>

      </Fragment>
    );
  }
}

export default WeatherFinder;
