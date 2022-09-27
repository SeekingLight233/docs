<template>
  <div
    style="display: inline-flex; flex-direction: column; align-items: center"
  >
    <span v-if="hide === false"
      ><span v-for="(s, idx) in textArr" :key="idx"
        ><span :style="textStyle(idx)">{{ s }}</span></span
      >
    </span>

    <input
      v-if="hide === true"
      type="text"
      v-model="curVal"
      @keydown="handleKeyDown"
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
  },
  methods: {
    myclick() {
      let span = document.getElementById(this.txt);
      span.style.color = "white";
    },
    handleKeyDown(e) {
      if (e.key === "Enter") {
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

    textStyle(idx) {
      if (this.diffIdx.includes(idx)) {
        return "color: red";
      } else {
        return "color: #2196f3";
      }
    },
  },
};
</script>
<style scoped>
#aa {
  background-color: yellow;
}
</style>