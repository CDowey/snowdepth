import React, { Component } from 'react'
import { defaults, Line } from 'react-chartjs-2'


var options = { year: 'numeric', month: 'numeric', day: 'numeric' };

const processDatesDepths = (dataObj) => {
  const dates = []
  const depths = []

  dataObj.forEach(element => {
    const { date, depth } = element
    dates.push(date.toLocaleDateString("en-US", options))
    depths.push(depth)
  });

  return {dates, depths}
}

// Set default globally chart.js styles https://blog.bitsrc.io/customizing-chart-js-in-react-2199fa81530a
// defaults.global.elements.pointDot = false

// defaults.global.elements.line.tension = 0;



class LineChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ChartData: {
        labels: [1, 2, 3],
        datasets: [
          {
            label: 'Snow Depth',
            data: [4, 5, 6],
            backgroundColor: 'rgba(100,60,180, 0.6)',
            borderColor: 'rgba(27,27,27,.95)',
            pointRadius: 0,
            lineTension: 0,
            fill: false
          }
        ]
      }
    };
    this.chartReference = React.createRef();
  };

  componentDidMount() {
    console.log(this.chartReference); // returns a Chart.js instance reference
    const {dates, depths} = processDatesDepths(this.props.data)
    console.log(dates, depths)
    // Set State to include the data from props
    this.setState(prevState => ({
      ChartData: {
        ...prevState.ChartData,
        labels: dates,
        datasets:[
          {
            label: 'Snow Depth',
            data: depths,
            backgroundColor: 'rgba(100,60,180, 0.6)'
          }
        ]

      }
    })

    )

  }

  render() {

    // Set up Chart options
    const options = {
      title: {
        display: true,
        text: 'Snow depths',
        fontSize: 25
      },
      legend: {
        display: true,
        position: 'right'
      }
    }


    return (
      <div className='Chart'>
        <Line
          ref={this.chartReference}
          data={this.state.ChartData}
          height={400}
          width={800}
          options={options}
        />
      </div>
    )
  }
};

export default LineChart;