<template>
  <div>
    <section>
      <b-container class="main pt-4 pb-5">
        <template v-for="(validator, index) in validators">
          <template v-if="validator.accountId == accountId">
            <div class="row">
              <div class="col-2 col-lg-1">
                <template v-if="index > 0">
                  <a v-bind:href="'/validator?accountId=' + validators[index-1].accountId" title="Previous validator">
                    <i class="fas fa-2x fa-chevron-left"></i>
                  </a>
                </template>
              </div>
              <div class="col-8  col-lg-10">
                <h3 class="text-center mb-1">Validator <span v-if="favorites[getIndex(validator.accountId)] !== undefined"><span v-if="favorites[getIndex(validator.accountId)].name != 'Edit validator name...'">{{ favorites[getIndex(validator.accountId)].name }}</span><span v-else>{{ accountId }}</span></span><span v-else>{{ accountId }}</span></a></h3>
              </div>
              <div class="col-2 col-lg-1 text-right">
                <template v-if="index < validators.length - 1">
                  <a v-bind:href="'/validator?accountId=' + validators[index+1].accountId" title="Next validator">
                    <i class="fas fa-2x fa-chevron-right"></i>
                  </a>
                </template>
              </div>
            </div>
            <div class="validator card mt-4 mb-3">
              <div class="card-body" v-bind:class="{ 'card-body': 'card-body', 'bg-offline': validator.isOffline }">
                <p class="text-right">
                  <i v-if="isFavorite(validator.accountId)" class="favorite fas fa-star" style="color: #f1bd23" title="Favorite"></i>
                  <i v-else class="favorite fas fa-star" style="color: #e6dfdf;"></i>
                </a>
                <div class="row">
                  <div class="col-md-3 text-center">
                    <p class="display-1 mb-0 rank">{{ index+1 }}</p>
                    <p class="bonded mb-1" v-b-tooltip.hover title="Total bonded">{{ formatDot(validator.stakers.total) }} DOT</p>
                    <p class="mb-0"><small><span v-b-tooltip.hover title="Self bonded">{{ formatDot(validator.stakers.own) }} DOT</span> (+<span v-b-tooltip.hover title="Bonded by nominators">{{ formatDot(validator.stakers.total - validator.stakers.own) }} DOT)</span></small></p>
                  </div>
                  <div class="col-md-9">
                    <div v-if="validator.controllerId != validator.nextSessionId">
                      <div class="row">
                        <div class="col-md-3 mb-2">
                          <strong>Controller</strong>
                        </div>
                        <div class="col-md-9 mb-2">
                          <a v-bind:href="blockExplorer.account + validator.controllerId" target="_blank">
                            <span class="d-inline d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="validator.controllerId">{{ shortAddess(validator.controllerId) }} </span>
                            <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">{{ validator.controllerId }}</span>
                          </a>
                          <a v-clipboard:copy="validator.controllerId" v-on:click="makeToast('Address ' + validator.controllerId + ' copied to the clipboard', 'Notification', 'success', true)" title="Copy address to clipboard"><i class="fas fa-copy"></i></a>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-3 mb-2">
                          <strong>Session</strong>
                        </div>
                        <div class="col-md-9 mb-2">                 
                          <a v-bind:href="blockExplorer.account + validator.nextSessionId" target="_blank">
                            <span class="d-inline d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="validator.nextSessionId">{{ shortAddess(validator.nextSessionId) }}</span>
                            <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">{{ validator.nextSessionId }}</span>     
                          </a>
                          <a v-clipboard:copy="validator.nextSessionId" v-on:click="makeToast('Address ' + validator.nextSessionId + ' copied to the clipboard', 'Notification', 'success', true)" title="Copy address to clipboard"><i class="fas fa-copy"></i></a>
                        </div>
                      </div>
                    </div>
                    <div v-else>
                      <div class="row">
                        <div class="col-md-3 mb-2">
                          <strong>Controller/Session</strong>
                        </div>
                        <div class="col-md-9 mb-2">
                          <a v-bind:href="blockExplorer.account + validator.nextSessionId" target="_blank">
                            <span class="d-inline d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="validator.nextSessionId">{{ shortAddess(validator.nextSessionId) }}</span>
                            <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">{{ validator.nextSessionId }}</span>
                          </a>
                          <a v-clipboard:copy="validator.nextSessionId" v-on:click="makeToast('Address ' + validator.nextSessionId + ' copied to the clipboard', 'Notification', 'success', true)" title="Copy address to clipboard"><i class="fas fa-copy"></i></a>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3 mb-2">
                        <strong>Stash</strong>
                      </div>
                      <div class="col-md-9 mb-2">
                        <a v-bind:href="blockExplorer.account + validator.stashId" target="_blank">
                          <span class="d-inline d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="validator.stashId">{{ shortAddess(validator.stashId) }}</span>
                          <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">{{ validator.stashId }}</span>
                        </a>
                        <a v-clipboard:copy="validator.stashId" v-on:click="makeToast('Address ' + validator.stashId + ' copied to the clipboard', 'Notification', 'success', true)" title="Copy address to clipboard"><i class="fas fa-copy"></i></a>
                      </div>
                    </div>
                    <div class="row mt-2">
                      <div class="col-md-3 mb-2">
                        <strong>Comission</strong>
                      </div>
                      <div class="col-md-9 mb-2 fee">
                        {{ validator.validatorPrefs.validatorPayment / 100000000000000 }}%
                      </div>
                    </div>
                    <div class="row mb-3">
                      <div class="col-md-3 mb-2">
                        <strong>Unstake threshold</strong>
                      </div>
                      <div class="col-md-9 mb-2 unstake">
                        {{ validator.validatorPrefs.unstakeThreshold}}
                      </div>
                    </div>
                    <a class="" data-toggle="collapse" v-bind:href="'#staker' + index" role="button" aria-expanded="false" v-bind:aria-controls="'staker' + index">
                      <h6 class="h6 nominators"><i class="fas"></i> Nominators ({{ validator.stakers.others.length }})</h6>
                    </a>
                    <div class="nominator collapse pt-2 pb-3"  v-bind:id="'staker' + index">
                      <div v-for="staker in validator.stakers.others" class="row">
                        <div class="col-8 who">                      
                          <a v-bind:href="blockExplorer.account + staker.who" target="_blank">
                            <span class="d-block d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="staker.who">{{ shortAddess(staker.who) }}</span>
                            <span class="d-none d-sm-block d-md-block d-lg-block d-xl-block">{{ staker.who }}</span>                        
                          </a>
                        </div>
                        <div class="col-4 text-right value">
                          {{ formatDot(staker.value) }} DOT
                        </div>
                      </div>
                    </div>
                    <div v-if="validator.offline.length > 0">
                      <a data-toggle="collapse" v-bind:href="'#offline' + index" role="button" aria-expanded="false" v-bind:aria-controls="'offline' + index">
                        <h6 class="h6 offline"><i class="fas"></i> Reported offline ({{ validator.offline.length }})</h6>
                      </a>
                      <div class="offlineEvent collapse pt-2 pb-3"  v-bind:id="'offline' + index">
                        <div v-for="offlineEvent in validator.offline" class="row">
                          <div class="col-12" style="color: #d75ea1;">                      
                            <i class="far fa-angry"></i> Reported offline {{ offlineEvent.number }} time/s at block <a class="block" v-bind:href="blockExplorer.block + offlineEvent.block" target="_blank">#{{ thousandsSeparator(offlineEvent.block) }}</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>
        <div class="mt-4" id="stake-evolution-chart">
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
      title: 'PolkaStats - Validator ' + this.$route.query.accountId,
      meta: [
        { hid: 'description', name: 'description', content: 'Validator ' + this.$route.query.accountId }
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
      blockExplorer: {
        block: 'https://polkascan.io/pre/alexander/block/',
        account: 'https://polkascan.io/pre/alexander/account/'
      },
      validatorsTmp: [],
      validators: [],
      offline: [],
      favorites: [],
      StakeEvolutionSeries: [{
          name: "Total bonded (DOT)",
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
          text: 'Total bonded graph (24h)',
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
            text: 'Total bonded (DOT)'
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

    if (this.$cookies.get('favorites')) {
      this.favorites = this.$cookies.get('favorites');
    }

    /* First time */
    this.getValidatorDailyGraphData();
    this.getValidatorStats();
    
    /* Refresh data every 1 minute */
    this.timer = setInterval(() => {
      this.getValidatorDailyGraphData()
    }, 60000);

    /* Refresh data every 1 minute */
    this.timer = setInterval(() => {
      this.getValidatorStats()
    }, 60000);
    
  },
  methods: {
    getValidatorDailyGraphData: function () {
      var vm = this;
      axios.get('https://polkastats.io:8443/validator/graph/daily/' + this.accountId)
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
                  text: 'Total bonded (DOT)'
                },
                labels: {
                  formatter: function (val) {
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
    getValidatorStats: function () {
      var vm = this;
      axios.get('https://polkastats.io:8443/validators')
        .then(function (response) {
          vm.validatorsTmp = response.data;
          axios.get('https://polkastats.io:8443/offline')
            .then(function (response) {
              //console.log('Getting offline events ...');
              for (let i = 0; i < vm.validatorsTmp.length; i++) {
                var tmp = []
                for (let j = 0; j < response.data.length; j++) {
                  if (vm.validatorsTmp[i].stashId == response.data[j][0]) {
                    //console.log('Offline Event | addr: ' + vm.validatorsTmp[i].accountId + ' block: ' + response.data[j][1] + ' number: ' + response.data[j][2]);
                    tmp.push(
                      {
                        block: response.data[j][1],
                        number: response.data[j][2]
                      }
                    );
                  }
                }
                vm.validatorsTmp[i].offline = tmp;
                // Set isOffline to true if there is offlines reported
                if (vm.validatorsTmp[i].offline.length > 0) {
                  vm.validatorsTmp[i].isOffline = true; 
                } else {
                  vm.validatorsTmp[i].isOffline = false; 
                }
              }
              vm.validators = vm.validatorsTmp;
            })          
        })
    },
    isHex(n) {
      var a = parseInt(n,16);
      return (a.toString(16) === n)
    },
    formatDot(amount) {
      if (this.isHex(amount)) {
        return (parseInt(amount, 16) / 1000000000000000).toFixed(3)
      } else {
        return (amount / 1000000000000000).toFixed(3)
      }
    },
    shortAddess(address) {
      return (address).substring(0,10) + ' .... ' + (address).substring(address.length - 10)
    },
    thousandsSeparator(n) {
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    toggleFavorite(validator) {
      // Receives validator accountId
      if (this.isFavorite(validator)) {
        this.favorites.splice(this.getIndex(validator), 1);
      } else {
        this.favorites.push({ accountId: validator, name: 'Edit validator name...'});
      }
      return true;
    },
    isFavorite(validator) {
      // Receives validator accountId
      for (var i=0; i < this.favorites.length; i++) {
        if (this.favorites[i].accountId == validator) {
          return true;
        }
      }
      return false;
    },
    getIndex(validator) {
      // Receives validator accountId
      for (var i=0; i < this.favorites.length; i++) {
        if (this.favorites[i].accountId == validator) {
          return i;
        }
      }
      return false;
    },
    makeToast(content = '', title = '', variant = null, solid = false) {
      this.$bvToast.toast(content, {
        title: title,
        variant: variant,
        solid: solid
      })
    }    
  },
  components: {
    apexchart: VueApexCharts
  }
}
</script>
<style scoped>
.fas.fa-copy {
  cursor: pointer;
  color: #d75ea1;
  font-size: 0.9rem;
  margin-left: 0.1rem;
}
.rank {
  margin-top: -0.6rem
}
.favorite {
  cursor: initial;
}
</style>