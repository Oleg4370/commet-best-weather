import React, { Component, Fragment } from 'react';
import {arrayOf, object} from 'prop-types';

class Map extends Component {
  static propTypes = {
    markers: arrayOf(object)
  };

  static defaultProps = {
    markers: []
  };

  myRef = React.createRef();

  state = {
    mapCenter: {
      lat: 41.950006,
      lng: 12.517507
    },
    mapZoom: 4
  };

  componentDidMount() {
    this.map = new window.google.maps.Map(this.myRef.current, {
      center: this.state.mapCenter,
      zoom: this.state.mapZoom
    });
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const {markers} = this.props;

    return nextProps.markers.length !== markers.length;
  }

  componentDidUpdate() {
    const {markers} = this.props;

    if (markers.length === 0) {
      return null;
    }
    markers.forEach((item) => {
      console.log('%c ', 'color: yellow; font-size: 20px', item.coords);
      const marker = new window.google.maps.Marker({
        position: {lat: item.coords.Lat, lng: item.coords.Lon},
        map: this.map,
        title: item.name
      })
    })
  }

  render() {
    return (
        <div
          ref={this.myRef}
          style={{ width: '100%', height: '100%' }}
        />
    );
  }
}

export default Map;
