<template>
  <div>
    <section>
      <b-container class="main pt-4 pb-5">
        <h2 class="mb-3">Validator {{ accountId }}</h2>
        <b-breadcrumb class="mb-5" :items="items"></b-breadcrumb>
        <div id="stake-evolution-chart">
          <apexchart type=line height=350 :options="StakeEvolutionChartOptions" :series="StakeEvolutionSeries" />
        </div>
      </b-container>
    </section>
  </div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
import VueApexCharts from 'vue-apexcharts';
export default {
  head () {
    return {
      title: 'POLKADOT VALIDATORS - Validator X',
      meta: [
        { hid: 'description', name: 'description', content: 'Validator X' }
      ]
    }
  },
  data: function() {
    return {
      accountId: this.$route.query.accountId,
      items: [
        {
          text: 'Validators',
          href: '/'
        },
        {
          text: this.$route.query.accountId,
          active: true
        }
      ],
      StakeEvolutionSeries: [{
          name: "Total Stake (DOT)",
          data: []
      }],
      StakeEvolutionChartOptions: {
        chart: {
          height: 500,
          stacked: false,
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        title: {
          text: 'Stake evolution graph (24h)',
          align: 'center',
          margin: 10,
          style: {
            fontSize: '1.75rem'
          },
          offsetY: 20,
        },
        markers: {
          size: 6
        },
        colors: ['#d75ea1'],
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        xaxis: {
          categories: [],
          type: 'datetime',
          title: {
            text: 'Date / time (UTC)'
          },          
          labels: {
            formatter: function (val) {
              return moment.unix(val).format('MM/DD/YYYY HH:mm');
            }
          },
          tooltip: {
            enabled: false
          }
        },
        yaxis: {
          /*
          min: 0,
          max: 0,
          */
          title: {
            text: 'Total Stake (DOT)'
          },
          labels: {
            formatter: function (val) {
              return val;
            }
          }       
        }
      }
    }
  },
  created: function () {

    /* First time */
    this.getValidatorStats();
    
    /* Refresh data every 5 seconds */
    this.timer = setInterval(() => {
      this.getValidatorStats()
    }, 60000);
    
  },
  methods: {
    getValidatorStats: function () {
      var vm = this;
      axios.get('https://polkadot-node.mariopino.es/validator/graph/daily/' + this.accountId)
        .then(function (response) {

          // Update chart data
          var newCategories = [];
          var newData = [];
      
          //console.log(response.data);

          for (var i = 0; i < response.data.length; i++) {
            // Insert firt point, last point and points with different values
            if (i == 0 || (i == response.data.length -1 ) || (i > 0 && response.data[i].amount != response.data[i-1].amount)) {
              newCategories.push(moment.unix(response.data[i].timestamp, 'YYYY-MM-DD HH:mm:ss.SSSSSS Z').format('YYYY-MM-DD HH:mm:ss'));
              newData.push(response.data[i].amount);
            }
          }
          
          newCategories.reverse();
          newData.reverse();
          
          // Make sure to update the whole options config and not just a single property to allow the Vue watch catch the change.
          vm.StakeEvolutionChartOptions = {
            ...vm.StakeEvolutionChartOptions,
            ...{
              xaxis: {
                categories: newCategories,
                type: 'datetime',
                title: {
                  text: 'Date time (UTC)'
                },        
                labels: {
                  formatter: function (val) {
                    return moment.unix(val/1000).format('MM/DD/YYYY HH:mm');
                  }
                }
              },
              yaxis: {
                /*
                min: 0,
                max: 0,
                */
                title: {
                  text: 'Total Stake'
                },
                labels: {
                  formatter: function (val) {
                    //return val;
                    return (val / 1000000000000000).toFixed(6);
                  }
                }         
              }
            }
          };
          
          // In the same way, update the series option
          vm.StakeEvolutionSeries = [{
            data: newData
          }];
          
        })
    },
  },
  components: {
    apexchart: VueApexCharts
  }
}
</script>
<style>
</style>