import Vue from 'vue'
/** Vue.component('button-counter', {
   data () {
     return {
       count: 0
    }
   },
   template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
}
)

Vue.component('button-counter_b', {
  data () {
    return {
      count: 0
   }
  },
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
}
)

Vue.component('button-counter_c', {
  data () {
    return {
      count: 0
   }
  },
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
}
)


Vue.component('button-counter_c', {
  data () {
    return {
      count: 0
   }
  },
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
}
)
**/
let buttonCounter = {
  data () {
    return {
      count: 0
   }
  },
  template: '<button v-on:click="count++"><slot></slot>You clicked me {{ count }} times.</button>'
}
let buttonCounterC = {
  data () {
    return {
      count: 0
   }
  },
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
}
let buttonCounterB = {
  data () {
    return {
      count: 0
   }
  },
  components: {
    'button-counter_c': buttonCounterC
  },  
  template: '<div><button-counter_c>this is button-counter-c</button-counter_c><button v-on:click="count++">You clicked me {{ count }} times.</button></div>'
}

new Vue({
  el: '#app',
  components: {
    'button-counter': buttonCounter,
    'button-counter_b': buttonCounterB
  }
});
/** import WatchTest from '@/views/WatchTest'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
new Vue({
  el: '#app',
  render: h => h(WatchTest)
}); */