import React, { Component } from 'react'
import { defaults, Line } from 'react-chartjs-2'

const processDatesDepths = (dataObj) => {
  const dates = []
  const depths = []

  dataObj.forEach(element => {
    const { date, depth } = element
    dates.push(date)
    depths.push(depth)
  });

  return {dates, depths}
}


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
            backgroundColor: 'rgba(100,60,180, 0.6)'
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
          height={600}
          width={1200}
        />
      </div>
    )
  }
};

export default LineChart;