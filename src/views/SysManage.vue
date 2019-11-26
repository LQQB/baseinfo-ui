<template>
  <div class="container">
    <!-- 头部区域 -->
    <head-bar></head-bar>
    <nav-bar></nav-bar>
    <main-content></main-content> 
    
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