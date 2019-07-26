<template>
  <a class="clipboard" v-clipboard:copy="address" v-on:click="makeToast('Address ' + address + ' copied to the clipboard', 'Notification', 'success', true)" v-bind:title="'Copy address ' + address + ' to clipboard'">             
    <Identicon
      :value="address"
      :size="size"
      :theme="theme"
      class="identicon"
    />
  </a>
</template>

<script>
import Identicon from '@polkadot/ui-identicon'
export default {
  props: ["address", "size", "theme"],
  methods: {
    makeToast(content = '', title = '', variant = null, solid = false) {
      this.$bvToast.toast(content, {
        title: title,
        variant: variant,
        solid: solid
      })
    }
  },
  components: {
    'Identicon': Identicon
  }
}
</script>

<style>
.identicon .container {
  margin: 0;
  padding: 0;
}
</style>
