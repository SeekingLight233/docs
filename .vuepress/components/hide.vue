<template>
  <div
    style="display: inline-flex; flex-direction: column; align-items: center"
  >
    <span v-if="isShowWord" v-on:click="clickShowWord()"
      ><span v-for="(s, idx) in textArr" :key="idx"
        ><span :style="getTextStyle(idx)">{{ s }}</span></span
      >
    </span>

    <input
      v-if="hide === true"
      type="text"
      v-model="curVal"
      @keydown="handleKeyDown"
      :style="inputStyle"
    />
    <span v-if="hide === false" style="color: #2196f3">{{ curVal }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: "",
      hide: true,
      curVal: "",
      diffIdx: [],
    };
  },
  props: {
    txt: String,
  },
  computed: {
    textArr() {
      return this.txt.split("");
    },
    isShowWord(){
      if(this.diffIdx.length === 0) return false
      return this.hide === false
    },
    inputStyle() {
      return {
        width: `${this.txt.length * 0.5}em`,
      };
    },
  },
  methods: {
    myclick() {
      let span = document.getElementById(this.txt);
      span.style.color = "white";
    },
    handleKeyDown(e) {
      // Enter or Tab
      if (e.key === "Enter" || e.key === "Tab") {
        this.hide = false;
        const diffIdx = this.getStrDiffIdxs(this.txt, this.curVal);
        this.diffIdx = diffIdx;
      }
    },
    getStrDiffIdxs(str1, str2) {
      let diffIdxs = [];
      for (let i = 0; i < str1.length; i++) {
        if (str1[i] !== str2[i]) {
          diffIdxs.push(i);
        }
      }
      return diffIdxs;
    },

    getTextStyle(idx) {
      if (this.diffIdx.includes(idx)) {
        return "color: red";
      } else {
        return "color: #2196f3";
      }
    },

    restoreData() {
      this.hide = true;
      this.curVal = "";
      this.diffIdx = [];
      this.text = ""
    },
    clickShowWord(){
      this.restoreData()
    }
  },
};
</script>
<style scoped>
#aa {
  background-color: yellow;
}
</style>