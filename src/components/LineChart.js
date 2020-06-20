import React, { Component } from 'react'
import { defaults, Line } from 'react-chartjs-2'


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
  componentDidMount(){
  //  this.setState()
  }

  componentDidUpdate(prevProps) {
      if (prevProps.data.depths !== this.props.data.depths) {
        console.log('props data', this.props.data)
        const depths  = this.props.data.depths
        const historicdata = this.props.historicdata
        console.log('props historic depths', historicdata)

        // Once the current year data is obtained append it to the historic datasets array
        const all_years = this.props.historicdata.concat(
          {
            label: 'Current Season Snow Depth',
            data: depths,
            backgroundColor: 'rgba(100,60,180, 0.6)',
            borderColor: 'rgba(77,87,213,.95)',
            pointRadius: 0,
            lineTension: 0.5,
            borderWidth: 2,
            fill: false
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


      // if (prevProps.historicdata !== this.props.historicdata) {
      //   console.log('his data CHANGED', this.props.historicdata)
      //   const dataset  = this.props.historicdata
      //   const datasets = this.state.ChartData.datasets.concat(dataset)
      //   const dates = this.props.data.dates

      //   console.log('datasets hist', datasets)
      //   this.setState(prevState => ({
      //     ChartData: {
      //       ...prevState.ChartData,
      //       lables: dates,
      //       datasets: datasets
      //     }
      //   }))
      // };
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