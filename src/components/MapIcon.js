import React, {Component} from 'react';

export default class MapIcon extends Component {
  render() {
    const depth = this.props.depth || 0;
    return (
      <svg width="20px" height="20px" cx='0' cy='0' viewBox="0 0 42 42" className="donut" aria-labelledby="beers-title beers-desc" role="img">
        <circle className="donut-hole" cx="24" cy="24" r="14" fill="white" role="presentation"></circle>
        <circle className="donut-ring" cx="24" cy="24" r="14" fill="transparent" stroke="#d2d3d4" strokeWidth="1" role="presentation"></circle>
        <g className="chart-text">
          <text className="chart-number" x="40%" y="68%">
            {depth}
          </text>
        </g>
      </svg>
    );
  }
}

// const myCustomColour = '#588470'

// const markerHtmlStyles = `
//     background-color: ${myCustomColour};
//     width: 3rem;
//     height: 3rem;
//     display: block;
//     left: -1.5rem;
//     top: -1.5rem;
//     position: relative;
//     border-radius: 3rem 3rem 0;
//     transform: rotate(45deg);
//     border: 1px solid #FFFFFF`

//     https://stackoverflow.com/questions/23567203/leaflet-changing-marker-color