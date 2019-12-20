<template> 
  <div class="headbar" :style="{'background':themeColor}" 
    :class="$store.state.app.collapse?'position-collapse-left':'position-left'">
        <!-- logo -->
    <!-- <div class="logo" :style="{'background-color':themeColor}"  style="display:in-line;" :class="collapse?'menu-bar-collapse-width':'menu-bar-width'"
      @click="$router.push('/')">
        <img src="@/assets/logo.png"/>
    </div>  -->
        <!-- 导航菜单 -->
    <span class="navbar">
      <el-menu :default-active="activeIndex" class="el-menu-demo" 
          :background-color="themeColor" text-color="#fff" active-text-color="#ffd04b" mode="horizontal" @select="selectNavBar">
        <!-- <el-menu-item index="1" @click="$router.push('/')"><i class="fa fa-home fa-lg"></i>  </el-menu-item>
        <el-menu-item index="2" @click="openWindow('https://gitee.com/liuge1988/kitty/wikis/Home')">方案计划</el-menu-item>
        <el-menu-item index="3" @click="openWindow('https://gitee.com/liuge1988/kitty/wikis/Home')">训练监控</el-menu-item>
        <el-menu-item index="4" @click="openWindow('https://www.cnblogs.com/xifengxiaoma/')">教学资源</el-menu-item>
        <el-menu-item index="5" @click="openWindow('https://www.cnblogs.com/xifengxiaoma/')">互动交流</el-menu-item>
        <el-menu-item index="6" @click="$router.push('/sys')">系统管理</el-menu-item> -->
        <el-menu-item index="1" @click="$router.push('/')"><i class="fa fa-home fa-lg"></i>  </el-menu-item>
        <el-menu-item @click="$router.push(item.url)" v-for="(item,index) in menuBar" :key="item.name" :index= "String(index+2)">{{item.name}}</el-menu-item>
      </el-menu>
    </span>
     <!-- 工具栏 -->
    <span class="toolbar">
      <el-menu class="el-menu-demo" :background-color="themeColor" :text-color="themeColor" :active-text-color="themeColor" mode="horizontal">
        <el-menu-item index="1">
          <!-- 主题切换 -->
          <theme-picker class="theme-picker" :default="themeColor" @onThemeChange="onThemeChange"></theme-picker>
        </el-menu-item>  
        <el-menu-item index="5" v-popover:popover-personal>
          <!-- 用户信息 -->
          <span class="user-info"><img :src="user.avatar" />{{user.name}}</span>
          <el-popover ref="popover-personal" placement="bottom-end" trigger="click" :visible-arrow="false">
            <personal-panel :user="user"></personal-panel>
          </el-popover>

        </el-menu-item>
      </el-menu>  
    </span>  

  </div>
</template>

<script>
import { mapState } from 'vuex'
import ThemePicker from "@/components/ThemePicker"
import PersonalPanel from "@/views/Core/PersonalPanel"
export default {
  data () {
    return {
      user: {
        name: "Louis",
        avatar: "",
        role: "超级管理员",
        registeInfo: "注册时间：2018-12-20 "
      },
      menuBar: [
        {name: '方案计划',url: '/ps',index: 1},
        {name: '训练档案',url: '/td',index: 400},
        {name: '训练监控',url: '/tm',index: 46},
        {name: '教学资源',url: '/tr',index: 100},
        {name: '互动交流',url: '/ic',index: 200},
        {name: '系统管理',url: '/sys',index: 6}
      ],
      liItem: ['1','2','3'],
      activeIndex: '2'
    }
  },
  components: {
    ThemePicker,
    PersonalPanel
  },
  computed: mapState({
      themeColor: state=>state.app.themeColor,
      collapse: state=>state.app.collapse
    }),
  methods: {
    // 切换主题
    onThemeChange: function(themeColor) {
      this.$store.commit('setThemeColor', themeColor)
    },
    selectNavBar(key, keyPath) {
      this.$store.commit('setMenuBarSelectedIndex', key)
      console.log(key)
      console.log(keyPath)
    },
    openWindow(url) {
      window.open(url)
    }
  }
}
</script>

<style>
.headbar {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1030;
  height: 60px;
  line-height: 60px;
  border-color: rgba(180, 190, 190, 0.8);
  border-left-width: 1px;
  border-left-style: solid;
}
.hamburg, .navbar {
  float: left;
}
.toolbar {
  float: right;
  height: 60px;
}
.lang-item {
  font-size: 16px;
  padding-left: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  cursor: pointer;
}
.lang-item:hover {
  font-size: 18px;
  background: #b0d6ce4d;
}
.user-info {
  font-size: 20px;
  color: #fff;
  cursor: pointer;
}
.user-info img {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    margin: 10px 0px 10px 10px;
    float: right;
}
.badge {
  line-height: 18px;
}
.position-left {
  left: 200px;
}
.position-collapse-left {
  left: 65px;
}
</style>