<template>
  <div  >
    
    <div style="background:black;"  class="clearfix"> 
       <button  style="float:left" >this is a button</button>
       <div style="float:right"><span>this is a div</span></div>
    </div>
    <div style="background:yellow;"> this is a span2</div>
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
    top: 50px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background-color: red;
  }
  .iframe-container {
    padding: 0 5px 5px;
  position: absolute;
  top: 60px;
  left: 1px;
  right: 1px;
  bottom: 0px;
  }
  .clearfix:after {
content: "\0020";
display: block;
height: 0;
clear: both;
}
</style>  