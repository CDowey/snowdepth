import React, { Component } from 'react'
import { defaults, Line } from 'react-chartjs-2'
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

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
            label: '',
            data: [],
            backgroundColor: 'rgba(100,60,180, 0.6)',
            borderColor: 'rgba(27,27,27,.95)',
            pointRadius: 0,
            lineTension: 0.1,
            borderWidth: 1,
            fill: false
          }
        ]
      }
    };
    this.chartReference = React.createRef();
  };
  componentDidMount() {
    //  this.setState()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data.depths !== this.props.data.depths) {
      console.log('props data', this.props.data)
      const depths = this.props.data.depths
      const historicdata = this.props.historicdata
      console.log('props historic depths', historicdata)
      console.log('labels', this.props.dates)


      // Once the current year data is obtained append it to the historic datasets array
      const all_years = this.props.historicdata.concat(
        {
          label: 'Current Season Snow Depth',
          data: depths,
          backgroundColor: 'rgba(0, 72, 255, 0.05)',
          borderColor: 'rgba(77,87,213,.95)',
          pointRadius: 0,
          pointHoverRadius: 5,
          lineTension: 0.5,
          borderWidth: 2,
          fill: true
        }
      )


      this.setState(prevState => ({
        ChartData: {
          ...prevState.ChartData,
          datasets: all_years

        }
      }))
    };

    if (prevProps.data.dates !== this.props.data.dates) {
      const dates = this.props.data.dates
      console.log(dates)
      this.setState(prevState => ({
        ChartData: {
          ...prevState.ChartData,
          labels: dates
        }
      }))
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
        display: false,
        position: 'right'
      },
      scales: {
        xAxes: [{
          gridLines: {
            drawOnChartArea: false
          },

          ticks: {
           maxTicksLimit: 20,
   //   stepsize: 30,
            // callback: function (value, index, values) { /// HAven't quite figured out this callback, can adjust labels but only if they are placed...
            //   const indicestokeep = [0, 32, 45] //ticks to labels conversion could also help here
            //   const labelstokeep = ['Sep 1st', 'Oct 3rd']


            //   if (!indicestokeep.includes(index)) {
            //     value = null
            //     return value
            //   } else{
            //     return value
            //   }

            // }
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
          label: function (tooltipItem, data) {
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
    console.log('Chart Data', this.state.ChartData)

    const isLoading = this.props.data.depths.length === 0

    return (
      <div className='Chart'>
        {/* Change what is rendered in the Chart div based on if the depths from current season have returned yet */}
        {isLoading
          ? <>
            <div className='LoadingText'>
              Counting Snowflakes
            </div>
            <Loader className='Loader'
              type="Circles"
              color="#DBDDDE"
              height={80}
              width={80}

            />
          </>
          :
          <Line
            ref={this.chartReference}
            data={this.state.ChartData}
            height={400}
            width={800}
            options={options}
          />
        }

      </div>
    )
  }
};

export default LineChart;