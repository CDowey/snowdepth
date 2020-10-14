import React, { Component } from 'react'
import moment from 'moment'
import { Line } from 'react-chartjs-2'
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

// Set default globally chart.js styles https://blog.bitsrc.io/customizing-chart-js-in-react-2199fa81530a
// defaults.global.elements.pointDot = false

// defaults.global.elements.line.tension = 0;



const getDaysArray = (start, end) => {
  for (var arr = [], dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
    arr.push(moment(new Date(dt)).format("MMM D"));
  }
  return arr;
};

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
    const chartData = this.props.chartData
    const dates = getDaysArray(new Date('09-01-2019'), new Date('06-30-2020'))
    const datasets = []

    for (let [key, value] of Object.entries(chartData)) {
      if (key === 'Average Season') {
        datasets.push(
          {
            label: key,
            data: value,
            order: 2,
            backgroundColor: 'rgba(255,0,0,.02)',
            borderColor: 'rgba(255,0,0,.95)',
            pointRadius: 0,
            lineTension: 0.1,
            borderWidth: 2,
            fill: true
          }
        )
      }
      else if (key === 'Current Season') {
        datasets.push(
          {
            label: key,
            data: value,
            order: 1,
            backgroundColor: 'rgba(0,0,255, .02)',
            borderColor: 'rgba(0, 31, 255,.95)',
            pointRadius: 0,
            lineTension: 0.1,
            borderWidth: 2,
            fill: false
          }
        )
      }
      else {
        datasets.push(
          {
            label: key,
            data: value,
            order: 3,
            backgroundColor: 'rgba(100,100,100, 0.6)',
            borderColor: 'rgba(146,146,146,.95)',
            pointRadius: 0,
            lineTension: 0.1,
            borderWidth: 0.25,
            fill: false
          }
        )
      }
    }




    this.setState({
      isLoading: false,
      ChartData: {
        labels: dates,
        datasets: datasets
      }
    })


  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      const chartData = this.props.chartData
      const dates = getDaysArray(new Date('09-01-2019'), new Date('06-30-2020'))
      const datasets = []

      const special_datasets = ['Average Season', 'Current Season']

      for (let [key, value] of Object.entries(chartData)) {
        if (special_datasets.includes(key)) {
          if (key === 'Average Season') {
            datasets.push(
              {
                label: key,
                data: value,
                order: 2,
                backgroundColor: 'rgba(255,0,0,.02)',
                borderColor: 'rgba(255,0,0,.95)',
                pointRadius: 0,
                lineTension: 0.1,
                borderWidth: 2,
                fill: true
              }
            )
          }
          if (key === 'Current Season') {
            datasets.push(
              {
                label: key,
                data: value,
                order: 1,
                backgroundColor: 'rgba(0,0,255, .02)',
                borderColor: 'rgba(0, 31, 255,.95)',
                pointRadius: 0,
                lineTension: 0.1,
                borderWidth: 2,
                fill: true
              }
            )
          }
        }
        else {
          datasets.push(
            {
              label: key,
              data: value,
              order: 3,
              backgroundColor: 'rgba(100,100,100, 0.6)',
              borderColor: 'rgba(146,146,146,.95)',
              pointRadius: 0,
              lineTension: 0.1,
              borderWidth: 0.25,
              fill: false
            }
          )
        }

        this.setState({
          isLoading: false,
          ChartData: {
            labels: dates,
            datasets: datasets
          }
        })
      }
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

    const isLoading = this.props.loading

    // || is or

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