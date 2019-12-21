<template>
  <div class="container">
    <div>
      <!-- 头部区域 -->
      <head-bar></head-bar>
      <nav-bar></nav-bar>
      <main-content></main-content>
    </div>
    </div>

</template>

<script>
import HeadBar from "./HeadBar/HeadBar"
import NavBar from "./NavBar/NavBar"
import MainContent from "./MainContent/MainContent"

export default {
  components:{
        HeadBar,
        NavBar,
        MainContent
  },
  mounted() {
    console.log(this.$route.path)
  }
};
</script>

<style>
  .container {
    position:absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
  }
  .iframe-container {
    padding: 0 5px 5px;
  position: absolute;
  top: 60px;
  left: 1px;
  right: 1px;
  bottom: 0px;
  }
</style>  