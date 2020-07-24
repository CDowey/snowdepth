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
    }
    //   this.setState(prevState => ({
    //     ChartData: {
    //       ...prevState.ChartData,
    //       datasets: all_years

    //     }
    //   }))
    // };

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
          if(dataset.label === 'Average Season')
          text.push(dataset.label)
        });

        console.log('text', text)

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
    console.log('Chart Data', this.state.ChartData)

    const isLoading = this.props.data.data.length === 0

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