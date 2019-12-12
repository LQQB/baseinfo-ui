<template>
  <div class="page-container">

       <el-container>
     <!-- 左边是一个部门树 -->
     <el-aside width="180px">
        <el-tree :data="tableTreeDdata" :props="popupTreeProps" @node-click="handleNodeClick">></el-tree>
     </el-aside>
     <el-container>
       <el-main>
<el-tabs type="border-card" @tab-click="tabClick" v-model="activeName">
      <el-tab-pane v-for='item in trainResourceCategoryTabs' :label='item.label' :key='item.category' :name='item.category'>
	    <!--表格内容栏-->
	      <ps-table :height="tableHeight" 
                  :data="item.pageResult" 
                  @findPage="findPage" 
                  ref="trainResourceTable"
                  :columns="filterColumns" 
                  :autoLoad='item.load'
                  :uploadUrl="uploadUrl"
                  :uploadParams="uploadParams"
                  permsDownload="permsDownload"
                  permsUpload="trainResource.upload"
                  @before-upload="beforeUpload"
                  @on-success="onSuccess"
                  @on-error="onError"
                  @handleDownload="handleDownload">
	      </ps-table>
      </el-tab-pane>
    </el-tabs>
       </el-main>
         </el-container>
</el-container>
  </div>
</template>
<script>
import PsTable from "@/views/Ps/PsTable"
import KtButton from "@/views/Core/KtButton";
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog";
import Cookies from "js-cookie";
import config from "@/http/config";
import axios from "axios";
import {download} from "@/utils/download";
export default {
  components: {
    TableColumnFilterDialog,
    KtButton,
    PsTable
  },
  data() {
    return {
      uploadUrl: config.baseUrl + "/trainResource/upload",
      uploadParams:{category:this.activeName,smallKemuId:this.selectedRid},
      activeName: "1",
      trainResourceCategoryTabs: [
        {label: '实施笔记',category: '1',load: true,pageResult: {}},
        {label: '挂图',category: '2',load: false,pageResult: {}},
        {label: '课件',category: '3',load: false,pageResult: {}},
        {label: '录像',category: '4',load: false,pageResult: {}}
      ],
      columns: [],
			filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},
      headers: {
        token: Cookies.get("token")
      },
      loading: false,
      size: "small",
      filters: {
        name: ""
      },
      operation: false, // true:新增, false:编辑
      editLoading: false,
      roles: [],
      enabledUploadBtn: true,
      uploadBtnIcon: "el-icon-upload2",
      tableTreeDdata: [],
      popupTreeProps: {
				label: 'labelCn',
				children: 'children'
      },
      tableHeight: 0,
      selectedRid: -1
    };
  },

  methods: {

    offsetDis: function(obj) {
		var l = 0, t = 0;
		while(obj) {
			l = l + obj.offsetLeft + obj.clientLeft;
			t = t + obj.offsetTop + obj.clientTop;
			obj = obj.offsetParent;
		}
		return {left: l, top: t};
  },
  
  

    // 获取数据
    findTreeData: function () {
      this.loading = true
			this.$api.trainResource.findAllR().then((res) => {
        this.tableTreeDdata = res.data
        this.popupTreeData = this.getParentMenuTree(res.data)
        this.loading = false
			})
    },
		// 获取上级单位树
    getParentMenuTree: function (tableTreeDdata) {
      let parent = {
        parentId: 0,
        name: '顶级菜单',
        children: tableTreeDdata
      }
      return [parent]
    },

    handleNodeClick: function(obj, node, data){
      let level = obj.level
      if (level != 2) {
        this.clearData()
        this.selectedRid = -1
      }else{
        let rId = obj.id
        if (rId !== this.selectedRid){
          this.selectedRid = rId
          this.findPage(null)
        }
      }


    },
    clearData: function(){
      for (let i=0; i<this.trainResourceCategoryTabs.size; i++){
        this.trainResourceCategoryTabs[i].pageResult = {}
      }
    },
    
    beforeUpload: function(){
      //要判断下用户是否选择小课目
      if (this.selectedRid === -1){
        this.$message({message: '请先选择小课目', type: 'error'})
        return false
      }else{
        this.uploadParams = {category:this.activeName,smallKemuId:this.selectedRid}
        this.enabledUploadBtn = false
        this.uploadBtnIcon = "el-icon-loading"
      }
    },

    tabClick: function(tab){
      console.log("tab" + tab.label + ";" + tab.name)
      this.key = tab.key
      for(let i = 0; i < this.trainResourceCategoryTabs.length; i++){
        if (this.trainResourceCategoryTabs[i].label == tab.label){
          this.selectedTab = this.trainResourceCategoryTabs[i]
          this.selectedTab.load = true
          break;
        }
      }

    },
		// 获取分页数据
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
      this.pageRequest.columnFilters = {name: {name:'name', value:this.filters.name},category:{name:'category',value:this.activeName}}
			this.$api.trainResource.findPage(this.pageRequest).then((res) => {
				this.selectedTab.pageResult = res.data
			},(error) => {this.$message({message: '获取数据失败', type: 'error'})}).then(data!=null?data.callback:'')
    },
    
    		// 处理表格列过滤显示
    initColumns: function () {
			this.columns = [
				{prop:"id", label:"ID", minWidth:50, show: false},
        {prop:"category", label:"类别", minWidth:120, show: false},
        {prop:"smallKemuId", label:"所属课目ID", minWidth:120, show: false},
        {prop:"filename", label:"文件名", minWidth:120},
        {prop:"path", label:"路径", minWidth:120, show: false},
        {prop:"viewedNum", label:"浏览次数", minWidth:120},
        {prop:"rate", label:"分数", minWidth:120},
        {prop:"relatedUserId", label:"上传用户ID", minWidth:120, show: false},
        {prop:"relatedUserName", label:"上传者", minWidth:120},
        {prop:"relatedDeptId", label:"部门ID", minWidth:120, show: false},
        {prop:"relatedDeptName", label:"部门", minWidth:120},
				{prop:"createDate", label:"上传日期", minWidth:100}
			]
			this.filterColumns = JSON.parse(JSON.stringify(this.columns));
    },
    onSuccess(response, file, fileList) {
      this.enabledUploadBtn = true;
      this.uploadBtnIcon = "el-icon-upload2";
      this.$message.success("文件上传成功!");
      this.findPage(null);
    },
    onError(err, file, fileList) {
      this.enabledUploadBtn = true;
      this.uploadBtnIcon = "el-icon-upload2";
      this.$message.error("文件上传异常:status = " + err.status);
    },
    // beforeUpload(file) {
    //   this.enabledUploadBtn = false;
    //   this.uploadBtnIcon = "el-icon-loading";
    // },
    handleDelete(data) {
      this.$api.user.batchDelete(data.params).then(data!=null?data.callback:'')

      this.$confirm("确认删除方案文件吗？", "提示", {
        type: "warning"
      }).then(() => {
        this.$api.sysPlan.batchDelete(row).then(
          res => {
            this.$message({ message: "方案文件删除成功", type: "success" });
            row.filename = "";
            row.relatedUserName = "";
            row.createDate = "";
          },
          error => {
            this.$message({ message: "方案文件删除失败", type: "error" });
          }
        );
      });
    },
    //方案文件下载
    handleDownload(data){
        let url = "/sysPlan/download"
        download(url,data.row)
    }
   },
  mounted() {
    this.findTreeData()
    this.initColumns()
    this.selectedTab = this.trainResourceCategoryTabs[0]
        this.$nextTick(function () {
        this.tableHeight = window.innerHeight - this.offsetDis(this.$refs.trainResourceTable.$el).top;
            // 监听窗口大小变化
            let self = this;
            window.onresize = function() {
                this.tableHeight = window.innerHeight - this.offsetDis(this.$refs.trainResourceTable.$el).top;
            }
        })
  }
};
</script>

<style scoped>
.clearfix:after {
content: "\0020";
display: block;
height: 0;
clear: both;
}

.el-main {
  padding: 0px !important;
}
</style>