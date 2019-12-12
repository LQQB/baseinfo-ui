<template>
  <div id="single-main-container" class="single-main-container" :class="$store.state.app.collapse?'position-collapse-left':'position-left'">
    <!-- 主内容区域 -->
    <div class="single-main-content" ref="singleMainContent">
      <keep-alive>
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import breadcrumbNav from '@/components/BreadCrumb';//面包屑
export default {
  components: {
    breadcrumbNav
  },
  data () {
    return {
    }
  },
  methods: {


  }
}
</script>

<style lang="scss">
.single-main-container {
  padding: 0 5px 5px;
  position: absolute;
  top: 60px;
  left: 1px;
  right: 1px;
  bottom: 0px;
  // background: rgba(56, 5, 114, 0.5);
  .tabs {
    position: fixed;
    top: 60px;
    right: 50px;
    padding-left: 0px;
    padding-right: 2px;
    z-index: 1020;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    background: rgb(255, 253, 255);
    border-color: rgba(200, 206, 206, 0.5);
    // border-left-width: 1px;
    // border-left-style: solid;
    border-bottom-width: 1px;
    border-bottom-style: solid;
  }
 .tabs-tools {
    position: fixed;
    top: 60px;
    right: 0;
    z-index: 1020;
    height: 30px;
    // padding: 0 10px;
    font-size: 14px;
    line-height: 30px;
    cursor: pointer;
    border-color: rgba(200, 206, 206, 0.5);
    border-left-width: 1px;
    border-left-style: solid;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    background: rgba(255, 255, 255, 1);
  }
  .tabs-tools:hover {
    background: rgba(200, 206, 206, 1);
  }
  .single-main-content {
    position: absolute;
    top: 0px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    padding: 5px;
    // background: rgba(209, 212, 212, 0.5);
  }
}

.position-collapse-left {
  left: 65px;
}

.el-tabs__item {
  height: 30px  !important;
  line-height: 30px !important;
}
.el-tabs__header {
  margin-bottom: 0px !important;
}

.el-popper[x-placement^=bottom] {
  margin-top: 5px !important;
}
</style>