<template>
  <div class="container">
     <!-- 头部区域 -->
    <head-bar></head-bar>
    <div>
       <iframe src="/sys/dept" />
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
</style>  