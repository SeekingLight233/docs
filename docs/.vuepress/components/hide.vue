<template>
  <span :id="txt" style="background-color: #24292e;" @click="myclick()">
      {{txt}}
  </span>
</template>

<script>
export default {
  data() {
    return {
      text:"",
    };
  },
  props:{
      txt:String
  },
  methods: {
      myclick(){
          let span = document.getElementById(this.txt);
          span.style.color = "white";
      }
  },
};
</script>
<style scoped>
#aa{
  background-color: yellow;
}
</style>