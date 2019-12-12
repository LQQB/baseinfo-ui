<template>
  <div class="container">
    <div>
      <!-- 头部区域 -->
      <head-bar></head-bar>

      <nav-bar v-show="this.$route.path !='/tr'"></nav-bar>
      <main-content v-show="this.$route.path != '/tr'"></main-content>
      <single-main-content  v-show="this.$route.path == '/tr'"></single-main-content>
      <!-- <div class="iframe-container">
         <iframe width="100%" height="100%" frameborder="0" src="/planSchedule">
      </iframe>
      </div>    -->
      <!-- <router-view name="content"/> -->
      
    </div>
    </div>

</template>

<script>
import HeadBar from "./HeadBar/HeadBar"
import NavBar from "./NavBar/NavBar"
import MainContent from "./MainContent/MainContent"
import SingleMainContent from "./SingleMainContent/SingleMainContent"

export default {
  components:{
        HeadBar,
        NavBar,
        MainContent,
        SingleMainContent
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