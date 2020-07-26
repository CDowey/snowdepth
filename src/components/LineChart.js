import React, { Component } from 'react'
import { defaults, Line } from 'react-chartjs-2'
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

// Set default globally chart.js styles https://blog.bitsrc.io/customizing-chart-js-in-react-2199fa81530a
// defaults.global.elements.pointDot = false

// defaults.global.elements.line.tension = 0;

debugger

class LineChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
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
    if (prevProps.data !== this.props.data) {
      console.log('props data', this.props.data)

      const { depths, dates } = this.props.data.forChart
      const single_year_data = depths['2015-2016']

      this.setState({
        isLoading: false,
        ChartData: {
          labels: dates,
          datasets: [
            {
              label: 'Rainfall',
              fill: false,
              lineTension: 0.5,
              backgroundColor: 'rgba(75,192,192,1)',
              borderColor: 'rgba(0,0,0,1)',
              borderWidth: 2,
              data: single_year_data
            }
          ]
        }
        // ChartData: {
        //   labels: [1,2,3,4],
        //   datasets: {
        //     label: '1970-71',
        //     data: [1, 2, 3, 4],
        //     backgroundColor: 'rgba(100,60,180, 0.6)',
        //     borderColor: 'rgba(27,27,27,.95)',
        //     pointRadius: 0,
        //     lineTension: 0.1,
        //     borderWidth: 1,
        //     fill: false
        //   }
        // }
      })

      console.log('line chart state', this.state)

      // need something here for when station props changes to renew the loading screen until that request is fulfilled
      if (prevProps.station !== this.props.station) {
        this.setState((prevState) => ({
          isLoading: true,
          ChartData: {}
        }))

      }


    };

    // if (prevProps.data.dates !== this.props.data.dates) {
    //   const dates = this.props.data.dates
    //   console.log(dates)
    //   this.setState(prevState => ({
    //     ChartData: {
    //       ...prevState.ChartData,
    //       labels: dates
    //     }
    //   }))
    // }
  }

  render() {

    // Set up Chart options
    const options = {
      responsive: true,
      maintainAspectRatio: true,
      title: {
        display: false,
        text: 'Snow depths',
        fontSize: 12
      },
      legend: {
        display: false,
        position: 'right'
      },
      legendCallback: function (chart) {
        // Return the HTML string here.
        console.log(chart.data.datasets);
        const datasets = chart.data.datasets
        var text = [];
        // 'Average Season'
        // 'Current Season Snow Depth'
        datasets.forEach(dataset => {
          if (dataset.label === 'Average Season')
            text.push(dataset.label)
        });

        // for (var i = 0; i < chart.data.datasets[0].data.length; i++) {
        //   text.push('<li><span id="legend-' + i + '-item" style="background-color:' + chart.data.datasets[0].backgroundColor[i] + '"   onclick="updateDataset(event, ' + '\'' + i + '\'' + ')">');
        //   if (chart.data.labels[i]) {
        //     text.push(chart.data.labels[i]);
        //   }
        //   text.push('</span></li>');
        // }
        // text.push('</ul>');
        // console.log(text)
        return text;
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
            labelString: 'Measured Depth (Inches)'
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

    const isLoading = this.state.isLoading
    const cd = this.state.ChartData


    return (
      <div className='lineChartContainter'>
        {/* Change what is rendered in the Chart div based on if the depths from current season have returned yet */}
        {isLoading
          ? <div className='LoadingContainer'>
            <div className='LoadingText'>
              Gathering Snow Data
              </div>
            <Loader className='Loader'
              type="Circles"
              color="#DBDDDE"
              height={80}
              width={80}
            />
          </ div>
          :
          <Line
            ref={this.chartReference}
            data={this.state.ChartData}
            // height={250}
            // width={650} responsive
            options={options}
          />
        }

      </div>
    )
  }
};

export default LineChart;