<template>
  <div v-html="svgString"></div>
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
  }
}
</script>