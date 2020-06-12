import React, { Component } from 'react'
import { defaults, Line } from 'react-chartjs-2'


var options = { month: 'short', day: 'numeric' };

const processDatesDepths = (dataObj) => {
  const dates = []
  const depths = []

  dataObj.forEach(element => {
    const { date, depth } = element
    dates.push(date.toLocaleDateString("en-US", options))
    depths.push(depth)
  });

  return { dates, depths }
}

// Set default globally chart.js styles https://blog.bitsrc.io/customizing-chart-js-in-react-2199fa81530a
// defaults.global.elements.pointDot = false

// defaults.global.elements.line.tension = 0;



class LineChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ChartData: {
        labels: [],
        datasets: [
          {
            label: 'Snow Depth',
            data: [],
            backgroundColor: 'rgba(100,60,180, 0.6)',
            borderColor: 'rgba(27,27,27,.95)',
            pointRadius: 0,
            lineTension: 0.5,
            borderWidth: 1,
            fill: false
          }
        ]
      }
    };
    this.chartReference = React.createRef();
  };

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      console.log(this.chartReference); // returns a Chart.js instance reference
      const { dates, depths } = processDatesDepths(this.props.data)
      console.log(dates, depths)
      // Set State to include the data from props
      this.setState(prevState => ({
        ChartData: {
          ...prevState.ChartData,
          labels: dates,
          datasets: [
            {
              label: 'Snow Depth',
              data: depths,
              backgroundColor: 'rgba(27,27,27, 0.6)'
            }
          ]

        }
      })

      )
    }
  }



  render() {

    // Set up Chart options
    const options = {
      title: {
        display: true,
        text: 'Snow depths',
        fontSize: 12
      },
      legend: {
        display: true,
        position: 'right'
      },
      scales: {
        xAxes: [{
          gridLines: {
            drawOnChartArea: false
          },
          ticks: {
            maxTicksLimit: 20
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Inches'
          },
          gridLines: {
            drawOnChartArea: false
          }
        }]
      },
      tooltips: {
        callbacks: {
            label: function(tooltipItem, data) {
                var label = data.datasets[tooltipItem.datasetIndex].label + ':';

                // if (label) {
                //     label += label;
                // }
                label += ' ' + tooltipItem.yLabel + ' in'

                return label;
            }
        }
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