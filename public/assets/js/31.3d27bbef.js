(window.webpackJsonp=window.webpackJsonp||[]).push([[31],{491:function(t,e,n){},738:function(t,e,n){"use strict";n(491)},746:function(t,e,n){"use strict";n.r(e);n(38),n(236),n(230),n(231);var i={data:function(){return{text:"",hide:!0,curVal:"",diffIdx:[]}},props:{txt:String},computed:{textArr:function(){return this.txt.split("")},isShowWord:function(){return 0!==this.diffIdx.length&&!1===this.hide},inputStyle:function(){return{width:"".concat(.5*this.txt.length,"em")}}},methods:{myclick:function(){document.getElementById(this.txt).style.color="white"},handleKeyDown:function(t){if("Enter"===t.key||"Tab"===t.key){this.hide=!1;var e=this.getStrDiffIdxs(this.txt,this.curVal);this.diffIdx=e}},getStrDiffIdxs:function(t,e){for(var n=[],i=0;i<t.length;i++)t[i]!==e[i]&&n.push(i);return n},getTextStyle:function(t){return this.diffIdx.includes(t)?"color: red":"color: #2196f3"},restoreData:function(){this.hide=!0,this.curVal="",this.diffIdx=[],this.text=""},clickShowWord:function(){this.restoreData()}}},r=(n(738),n(8)),o=Object(r.a)(i,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticStyle:{display:"inline-flex","flex-direction":"column","align-items":"center"}},[t.isShowWord?n("span",{on:{click:function(e){return t.clickShowWord()}}},t._l(t.textArr,(function(e,i){return n("span",{key:i},[n("span",{style:t.getTextStyle(i)},[t._v(t._s(e))])])})),0):t._e(),t._v(" "),!0===t.hide?n("input",{directives:[{name:"model",rawName:"v-model",value:t.curVal,expression:"curVal"}],style:t.inputStyle,attrs:{type:"text"},domProps:{value:t.curVal},on:{keydown:t.handleKeyDown,input:function(e){e.target.composing||(t.curVal=e.target.value)}}}):t._e(),t._v(" "),!1===t.hide?n("span",{staticStyle:{color:"#2196f3"}},[t._v(t._s(t.curVal))]):t._e()])}),[],!1,null,"7d7f8e5e",null);e.default=o.exports}}]);