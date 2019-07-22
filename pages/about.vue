<template>
  <div>
    <section>
      <b-container class="main pt-4 pb-5">
        <h1 class="mb-4">ABOUT</h1>
        <p>This is about <a href="https://polkadot.network" target="_blank"><strong>Polkadot</strong></a>, of course ;-)</p>
        <p>I code this app to experiment and learn about how to retrieve and represent live (and useful for humans :-)) information about the Polkadot network. </p>
        <p>Thanks to all the people from <a href="https://riot.im/app/#/room/#polkadot-watercooler:matrix.org" target="_blank">Polkadot Watercooler</a> for point me to the right direction and save me hours of useless coding.</p>
      </b-container>
    </section>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  head () {
    return {
      title: 'POLKADOT VALIDATORS - About this web app',
      meta: [
        { hid: 'description', name: 'description', content: 'About this web app' }
      ]
    }
  }
}
</script>
<style>
</style>