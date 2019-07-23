<template>
  <a class="clipboard" v-clipboard:copy="address" v-on:click="makeToast('Address ' + address + ' copied to the clipboard', 'Notification', 'success', true)" title="Copy address to clipboard">             
    <div v-html="svgString" v-bind:title="'Copy address ' + address + ' to clipboard'"></div>
  </a>
</template>
<script>
import { u8aToHex } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';
import jdenticon from 'jdenticon';
export default {
  props: ["address", "size"],
  data: function() {
    return {
      svgString: ''
    }
  },
  created: function () {
    this.showJIdentIconSvg();
  },
  methods: {
    showJIdentIconSvg: function () {
      const pkU8a = decodeAddress(this.address); // as a Uint8Array
      const pkHex = u8aToHex(pkU8a);
      this.svgString = jdenticon.toSvg(pkHex, this.size);
      //console.log(this.svgString);
    },
    makeToast(content = '', title = '', variant = null, solid = false) {
      this.$bvToast.toast(content, {
        title: title,
        variant: variant,
        solid: solid
      })
    }
  }
}
</script>
<style scoped>
.clipboard {
  cursor: pointer;
}
</style>