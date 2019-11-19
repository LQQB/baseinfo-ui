<template>
    <div id="app">
        <el-input v-model="firstName"  placeholder="please input firstname"></el-input>
        <el-input v-model="lastName"  placeholder="please input lastname"></el-input>
        <el-input v-model="fullName"  placeholder="echo full name"></el-input>
        <el-input v-model="fullName1"  placeholder="echo full name"></el-input>
    </div>
</template>
<script>
export default {
    data () {
        return {
            firstName: '',
            lastName: ''
        }
    },
    computed: {
      fullName: function () {
          return this.firstName + " haha " + this.lastName
      }
    },
    watch: {
      firstName: function (val) {
        console.log(val)        
      },
      fullName1: function(valu){
          console.log(valu)
      }
    }
}
</script>