<template>
  <div>
    <h5 class="mt-2" v-on:click="editing=true" v-show="!editing">
      {{value}}<span v-if="value.length == 0">Edit validator name...</span>
    </h5>
    <span v-show="editing">
      <input :value="value"
        @input="$emit('input', $event.target.value)"
        @keydown.enter="updateFavoritesCookie()"
        type="text" 
        class="form-control mt-2"
      >
    </span>
  </div>
</template>
<script>
export default {
  props: ["value", "favorites"],
  data: function() {
    return {
      editing: false
    }
  },
  methods: {
    updateFavoritesCookie: function () {
      this.editing = false;
      this.$cookies.set('favorites', this.favorites, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      });
      console.log(this.favorites);
    }
  }
}
</script>
<style>
</style>