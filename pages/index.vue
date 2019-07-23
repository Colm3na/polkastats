<template>
  <div>
    <section>
      <b-container class="main pt-4">
        <nav>
          <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <a class="nav-item nav-link active" id="nav-active-validators" data-toggle="tab" href="#active-validators" role="tab" aria-controls="nav-active-validators" aria-selected="true">VALIDATORS ({{ validators.length }})</a>
            <a class="nav-item nav-link" id="nav-favorites" data-toggle="tab" href="#favorites" role="tab" aria-controls="nav-favorites" aria-selected="false"> <i class="far fa-star" style="color: rgb(241, 189, 35);"></i> FAVORITES ({{ favorites.length }})</a>
            </div>
        </nav>
        <div class="tab-content mb-2" id="nav-tabContent">
          <div class="tab-pane fade show active" id="active-validators" role="tabpanel" aria-labelledby="nav-active-validators">
            <div class="validator card mb-3" v-for="(validator, index) in validators">
              <div class="card-body" v-bind:class="{ 'card-body': 'card-body', 'bg-offline': validator.isOffline }">
                <p class="text-right">
                  <a class="favorite" v-on:click="toggleFavorite(validator.accountId)" title="Mark as Favorite">
                    <i v-if="isFavorite(validator.accountId)" class="fas fa-star" style="color: #f1bd23" title="Unset as Favorite"></i>
                    <i v-else class="fas fa-star" style="color: #e6dfdf;" title="Set as Favorite"></i>
                  </a>
                  <nuxt-link class="detail" :to="{name: 'validator', query: { accountId: validator.accountId } }" title="Validator Graphs (Beta)">
                    <i class="fas fa-chart-line"></i>
                  </nuxt-link>
                </a>
                <div class="row">
                  <div class="col-md-3 text-center">
                    <p class="display-1 mb-0 rank">{{ index+1 }}</p>
                    <p class="bonded mb-1" v-b-tooltip.hover title="Total bonded">{{ formatDot(validator.stakers.total) }} DOT</p>
                    <p class="mb-0"><small><span v-b-tooltip.hover title="Self bonded">{{ formatDot(validator.stakers.own) }} DOT</span> (+<span v-b-tooltip.hover title="Bonded by nominators">{{ formatDot(validator.stakers.total - validator.stakers.own) }} DOT)</span></small></p>
                  </div>
                  <div class="col-md-9">
                    <h5 class="card-title mb-4 account mt-4 mt-sm-1 mt-md-1 mt-lg-1 mt-xl-1"><a v-bind:href="blockExplorer.account + validator.controllerId" target="_blank">{{ validator.accountId }}</a> <a v-clipboard:copy="validator.accountId" v-on:click="makeToast('Address ' + validator.accountId + ' copied to the clipboard', 'Notification', 'success', true)" title="Copy address to clipboard"><i class="fas fa-copy"></i></a></h5>
                    <div v-if="validator.controllerId != validator.nextSessionId">
                      <div class="row">
                        <div class="col-md-3 mb-2">
                          <strong>Controller</strong>
                        </div>
                        <div class="col-md-9 mb-2">
                          <a v-bind:href="blockExplorer.account + validator.controllerId" target="_blank">
                            <span class="d-block d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="validator.controllerId">{{ shortAddess(validator.controllerId) }}</span>
                            <span class="d-none d-sm-block d-md-block d-lg-block d-xl-block">{{ validator.controllerId }}</span>
                          </a>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-3 mb-2">
                          <strong>Session</strong>
                        </div>
                        <div class="col-md-9 mb-2">                 
                          <a v-bind:href="blockExplorer.account + validator.nextSessionId" target="_blank">
                            <span class="d-block d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="validator.nextSessionId">{{ shortAddess(validator.nextSessionId) }}</span>
                            <span class="d-none d-sm-block d-md-block d-lg-block d-xl-block">{{ validator.nextSessionId }}</span>     
                          </a>
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
                            <span class="d-block d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="validator.nextSessionId">{{ shortAddess(validator.nextSessionId) }}</span>
                            <span class="d-none d-sm-block d-md-block d-lg-block d-xl-block">{{ validator.nextSessionId }}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3 mb-2">
                        <strong>Stash</strong>
                      </div>
                      <div class="col-md-9 mb-2">
                        <a v-bind:href="blockExplorer.account + validator.stashId" target="_blank">
                          <span class="d-block d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="validator.stashId">{{ shortAddess(validator.stashId) }}</span>
                          <span class="d-none d-sm-block d-md-block d-lg-block d-xl-block">{{ validator.stashId }}</span>
                        </a>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <div class="col-md-3 mb-2">
                        <strong>Comission</strong>
                      </div>
                      <div class="col-md-3 mb-2 fee">
                        {{ validator.validatorPrefs.validatorPayment / 100000000000000 }}%
                      </div>
                      <div class="col-md-3 mb-2">
                        <strong>Unstake threshold</strong>
                      </div>
                      <div class="col-md-3 mb-2 unstake">
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
          </div>
          <div class="tab-pane fade show" id="favorites" role="tabpanel" aria-labelledby="nav-favorites">
            <template v-if="favorites.length == 0">
              <div class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
                <strong>Hi there!</strong> You can click in the star icon <i class="fas fa-star" style="color: #e6dfdf;"></i> of a validator to track it on this tab.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </template>
            <template  v-for="(validator, index) in validators">
              <template v-if="isFavorite(validator.accountId)">
                <div class="validator card mb-3">
                  <a class="favorite" v-on:click="toggleFavorite(validator.accountId)">
                    <i v-if="isFavorite(validator.accountId)" class="fas fa-star" style="color: #f1bd23" title="Unset as Favorite"></i>
                    <i v-else class="fas fa-star" style="color: #e6dfdf;" title="Set as Favorite"></i>
                  </a>
                  <nuxt-link class="detail" :to="{name: 'validator', query: { accountId: validator.accountId } }" title="Validator Graphs (Beta)">
                    <i class="fas fa-chart-line"></i>
                  </nuxt-link>                  
                  <div class="card-body" v-bind:class="{ 'card-body': 'card-body', 'bg-offline': validator.isOffline }">
                    <div class="row">
                      <div class="col-md-3 text-center">
                        <p class="display-1 mb-0 rank">{{ index+1 }}</p>
                        <p class="bonded mb-1" v-b-tooltip.hover title="Total bonded">{{ formatDot(validator.stakers.total) }} DOT</p>
                        <p class="mb-0"><small><span v-b-tooltip.hover title="Self bonded">{{ formatDot(validator.stakers.own) }} DOT</span> (+<span v-b-tooltip.hover title="Bonded by nominators">{{ formatDot(validator.stakers.total - validator.stakers.own) }} DOT)</span></small></p>
                        <editable v-bind:favorites="favorites" v-model="favorites[getIndex(validator.accountId)].name"></editable>
                      </div>
                      <div class="col-md-9">
                        <h5 class="card-title mb-4 account mt-4 mt-sm-1 mt-md-1 mt-lg-1 mt-xl-1"><a v-bind:href="blockExplorer.account + validator.controllerId" target="_blank">{{ validator.accountId }}</a> <a v-clipboard:copy="validator.accountId" v-on:click="makeToast('Address ' + validator.accountId + ' copied to the clipboard', 'Notification', 'success', true)" title="Copy address to clipboard"><i class="fas fa-copy"></i></a></h5>
                        <div v-if="validator.controllerId != validator.nextSessionId">
                          <div class="row">
                            <div class="col-md-3 mb-2">
                              <strong>Controller</strong>
                            </div>
                            <div class="col-md-9 mb-2">
                              <a v-bind:href="blockExplorer.account + validator.controllerId" target="_blank">
                                <span class="d-block d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="validator.controllerId">{{ shortAddess(validator.controllerId) }}</span>
                                <span class="d-none d-sm-block d-md-block d-lg-block d-xl-block">{{ validator.controllerId }}</span>
                              </a>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-md-3 mb-2">
                              <strong>Session</strong>
                            </div>
                            <div class="col-md-9 mb-2">                 
                              <a v-bind:href="blockExplorer.account + validator.nextSessionId" target="_blank">
                                <span class="d-block d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="validator.nextSessionId">{{ shortAddess(validator.nextSessionId) }}</span>
                                <span class="d-none d-sm-block d-md-block d-lg-block d-xl-block">{{ validator.nextSessionId }}</span>     
                              </a>
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
                                <span class="d-block d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="validator.nextSessionId">{{ shortAddess(validator.nextSessionId) }}</span>
                                <span class="d-none d-sm-block d-md-block d-lg-block d-xl-block">{{ validator.nextSessionId }}</span>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-3 mb-2">
                            <strong>Stash</strong>
                          </div>
                          <div class="col-md-9 mb-2">
                            <a v-bind:href="blockExplorer.account + validator.stashId" target="_blank">
                              <span class="d-block d-sm-none d-md-none d-lg-none d-xl-none" v-b-tooltip.hover v-bind:title="validator.stashId">{{ shortAddess(validator.stashId) }}</span>
                              <span class="d-none d-sm-block d-md-block d-lg-block d-xl-block">{{ validator.stashId }}</span>
                            </a>
                          </div>
                        </div>
                        <div class="row mb-3">
                          <div class="col-md-3 mb-2">
                            <strong>Comission</strong>
                          </div>
                          <div class="col-md-3 mb-2 fee">
                            {{ validator.validatorPrefs.validatorPayment / 100000000000000 }}%
                          </div>
                          <div class="col-md-3 mb-2">
                            <strong>Unstake threshold</strong>
                          </div>
                          <div class="col-md-3 mb-2 unstake">
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
            <p>&nbsp;</p>
          </div>
        </div>
        <p>&nbsp;</p>
      </b-container>
    </section>
  </div>
</template>
<script>
import axios from 'axios'
import bootstrap from 'bootstrap'
import editable from "../components/editable.vue";
export default {
  head () {
    return {
      title: 'PolkaStats - Polkadot network statistics',
      meta: [
        { hid: 'description', name: 'description', content: 'Polkadot network statistics' }
      ]
    }
  },
  data: function() {
    return {
      blockExplorer: {
        block: 'https://polkascan.io/pre/alexander/block/',
        account: 'https://polkascan.io/pre/alexander/account/'
      },
      validatorsTmp: [],
      validators: [],
      offline: [],
      favorites: []
    }
  },
  created: function () {
    
    /* First time */
    this.getValidatorStats();

    if (this.$cookies.get('favorites')) {
      this.favorites = this.$cookies.get('favorites');
    }
    
    /* Refresh data every 20 seconds */
    this.timer = setInterval(() => {
      this.getValidatorStats();
    }, 20000);

  },
  methods: {
    getValidatorStats: function () {
      var vm = this;
      axios.get('https://polkadot-node.mariopino.es/validators')
        .then(function (response) {
          vm.validatorsTmp = response.data;
          axios.get('https://polkadot-node.mariopino.es/offline')
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
  watch: {
    favorites: function (val) {
      //console.log(val);
      this.$cookies.set('favorites', val, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      });
    }
  },
  components: {
    editable
  }
}
</script>
<style>
body {
  font-size: 0.9rem;
}
.favorite {
  cursor: pointer;
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  z-index: 10;
  font-size: 1.1rem;
}
.detail {
  cursor: pointer;
  position: absolute;
  top: 0.45rem;
  right: 2.4rem;
  z-index: 10;
  font-size: 1.1rem;
}
.validator .bg-offline {
  background-color: rgba(239, 57, 74, 0.12) !important;
}
.rank {
  color: #7d7378;
}
.account {
  color: #670d35;
}
.bonded {
  color: #d75ea1;
  font-weight: 700;
  font-size: 1.3rem;
}
[data-toggle="collapse"] .fas:before {   
  content: "\f078";
}
[data-toggle="collapse"][aria-expanded="false"] .fas:before {
  content: "\f054";
}
.nominators {
  color: #670d35;
}
.nominator {
  font-size: 0.9rem;
}
.nominator .value {
  color: #d75ea1;
  font-weight: 700;
}
.fee, .unstake {
  color: #d75ea1;
  font-weight: 700;
}
.block {
  color: #d75ea1;
  font-weight: bold;
}
.block:hover {
  color: #d75ea1;
}
.tab-content .validator:nth-child(1) {
  border-top: 0;
}
.fas.fa-copy {
  cursor: pointer;
  color: #d75ea1;
  font-size: 0.9rem;
  margin-left: 0.1rem;
}
</style>