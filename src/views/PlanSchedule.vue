<template>
  <div class="container">
    <div>
      <!-- 头部区域 -->
      <head-bar></head-bar>
       <!-- 导航菜单栏 -->
      <nav-bar></nav-bar>
      <!-- 主内容区域 -->
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