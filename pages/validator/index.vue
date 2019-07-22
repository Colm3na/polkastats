<template>
  <div>
    <section>
      <b-container class="main pt-4 pb-5">
        <h1 class="mb-4">VALIDATORS</h1>
        <p>Go to home and click on a validator to show info about a validator.</p>
      </b-container>
    </section>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  head () {
    return {
      title: 'POLKADOT VALIDATORS - Validators',
      meta: [
        { hid: 'description', name: 'description', content: 'Validators' }
      ]
    }
  }
}
</script>
<style>
</style>