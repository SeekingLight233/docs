<template>
  <div style="display: inline-flex; flex-direction: column; align-items: center">
    <span v-if="isShowWord" v-on:click="clickShowWord()"><span v-for="(s, idx) in textArr" :key="idx"><span
          :style="getTextStyle(idx)">{{ s }}</span></span>
    </span>

    <input v-if="hide === true" type="text" v-model="curVal" @keydown="handleKeyDown" :style="inputStyle" />
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
      componentId: null  // 添加一个用于存储位置索引的数据属性
    };
  },
  props: {
    txt: String,
  },
  computed: {
    textArr() {
      return this.txt.split("");
    },
    isShowWord() {
      return this.hide === false && this.diffIdx.length > 0;
    },
    inputStyle() {
      return {
        width: `${this.txt.length * 0.5}em`,
      };
    },
    storageKey() {
      // 结合 txt 属性和组件位置索引构造唯一键
      return `hideState-${this.txt}-${this.componentId}`;
    }
  },
  mounted() {
    this.componentId = Array.from(this.$el.parentNode.children).indexOf(this.$el);
    this.loadState();
  },
  methods: {
    saveState() {
      const state = {
        hide: this.hide,
        curVal: this.curVal,
        diffIdx: this.diffIdx,
      };
      localStorage.setItem(this.storageKey, JSON.stringify(state));
    },

    loadState() {
      const state = localStorage.getItem(this.storageKey);
      if (state) {
        const { hide, curVal, diffIdx } = JSON.parse(state);
        this.hide = hide;
        this.curVal = curVal;
        this.diffIdx = diffIdx;
      }
    },

    handleKeyDown(e) {
      if (e.key === "Enter" || e.key === "Tab") {
        this.hide = false;
        const diffIdx = this.getStrDiffIdxs(this.txt, this.curVal);
        this.diffIdx = diffIdx;
        this.saveState();  // 保存状态每次修改后
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
      return this.diffIdx.includes(idx) ? "color: red" : "color: #2196f3";
    },

    restoreData() {
      this.hide = true;
      this.curVal = "";
      this.diffIdx = [];
      this.text = "";
      localStorage.removeItem(this.storageKey);  // 清除存储的状态
    },

    clickShowWord() {
      this.restoreData();
    }
  },
};
</script>
