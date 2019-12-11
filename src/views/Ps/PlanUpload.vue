<template>
  <div class="page-container">
      	<!--工具栏-->
	  <div class="clearfix">
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px">
		 <el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<kt-button icon="fa fa-search el-icon-download" :label="downLoadBtnLabel" perms="sys:role:view" type="primary" @click="handleTemplateDownload"/>
			</el-form-item>
			<el-form-item>
              <el-upload
                name="file"
                class="upload-demo"
                style="display: inline"
                :headers="headers"
                :data="{category:this.activeName}"
                :action="uploadUrl"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :on-success="onSuccess"
                :on-error="onError"
              >
                <el-button
                  :disabled="!enabledUploadBtn"
                  :icon="uploadBtnIcon"
                  size="mini"
                  type="primary"
                >{{upLoadBtnLabel}}</el-button>
              </el-upload>
				
			</el-form-item>
		</el-form>
	</div>
  </div>
    <el-tabs type="border-card" @tab-click="tabClick" v-model="activeName">
      <el-tab-pane v-for='item in planCategoryTabs' :label='item.label' :key='item.category' :name='item.category'>
	    <!--表格内容栏-->
	      <ps-table :height="tableHeight" :data="item.pageResult" @findPage="findPage" 
                  :columns="filterColumns" :autoLoad='item.load'
                  permsDownload="permsDownload"
                  @handleDownload="handleDownload">
	      </ps-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import PsTable from "./PsTable"
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
      activeName: "1",
      downLoadBtnLabel: '下载年度方案模板',
      upLoadBtnLabel: '上传年度方案',
      planCategoryTabs: [
        {label: '年度方案',category: '1',load: true,pageResult: {}},
        {label: '阶段方案',category: '2',load: false,pageResult: {}},
        {label: '综合方案',category: '3',load: false,pageResult: {}},
        {label: '具体工作方案',category: '4',load: false,pageResult: {}}
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
      uploadUrl: config.baseUrl + "/sysPlan/planUpload",
      roles: [],
      enabledUploadBtn: true,
      uploadBtnIcon: "el-icon-upload2",
      tableHeight: window.innerHeight - 60 - 45 - 10 - 70 - 30 - 80 - 39
    };
  },
  watch: {
    pageResult() {
      console.log("pageResult is changed!")
    }
  },
  methods: {
    tabClick: function(tab){
      console.log("tab" + tab.label + ";" + tab.name)
      this.key = tab.key
      for(let i = 0; i < this.planCategoryTabs.length; i++){
        if (this.planCategoryTabs[i].label == tab.label){
          this.selectedTab = this.planCategoryTabs[i]
          downLoadBtnLabel = "下载".concat(tab.label).concat("模板")
          upLoadBtnLabel = "上传".concat(tab.label)
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
			this.$api.sysPlan.findPage(this.pageRequest).then((res) => {
				this.selectedTab.pageResult = res.data
			},(error) => {this.$message({message: '获取数据失败', type: 'error'})}).then(data!=null?data.callback:'')
    },
    
    		// 处理表格列过滤显示
    initColumns: function () {
			this.columns = [
				{prop:"id", label:"ID", minWidth:50, show: false},
				{prop:"category", label:"类别", minWidth:120, show: false},
        {prop:"filename", label:"文件名", minWidth:120},
        {prop:"path", label:"路径", minWidth:120, show: false},
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
    beforeUpload(file) {
      this.enabledUploadBtn = false;
      this.uploadBtnIcon = "el-icon-loading";
    },
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
    },
    handleTemplateDownload() {
      //先向用户确认是不是要下载这种类型的模板,如果是的话，再下载对应的模板
      let category = this.activeName;
      let templateName = "";
      for(let i = 0; i < this.planCategoryTabs.length; i ++){
        if (this.planCategoryTabs[i].category == category){
           templateName = this.planCategoryTabs[i].label
           break;
        }
      }

      this.$confirm("确认是下载".concat(templateName).concat("模板文件吗？"), "提示", {
        type: "info"
      }).then(() => {
        //const params = new URLSearchParams()
        //params.append('category', category)
        //download("/template/planTemplateDownload",params)
         let headers = {'content-type': 'application/x-www-form-urlencoded' };
         headers.token = Cookies.get("token");
         const instance = axios.create({
          headers: headers,
          timeout: config.timeout,
          withCredentials: config.withCredentials
        });
        const params = new URLSearchParams();
        params.append('category', category);
        instance
          .post(config.baseUrl + "/template/planTemplateDownload", params, {
            responseType: "blob"
          })
          .then(response => {
            let data = response.data;
            if (!data) {
              return;
            }
            let contentDisposition = response.headers["content-disposition"];
            let fileName = decodeURIComponent(
              contentDisposition.substring(contentDisposition.indexOf("=") + 1)
            );
            //let url = window.URL.createObjectURL(new Blob([data], { type: 'application/ms-excel;charset=utf-8' }))
            let url = window.URL.createObjectURL(new Blob([data]));
            let a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.setAttribute("download", fileName);
            document.body.appendChild(a);
            //点击下载
            a.click();
            // 下载完成移除元素
            document.body.removeChild(a);
            // 释放掉blob对象
            window.URL.revokeObjectURL(url);
            console.log("下载完成");
          },
          error=>{
            this.$message({ message: "模板文件下载失败,可能是还没上传模板文件", type: "error" });
          })
          .catch(function(error) {
            this.$message({ message: "模板文件下载失败,可能是还没上传模板文件", type: "error" });
          }); 
      });
    },
  },
  mounted() {
    this.initColumns()
    this.selectedTab = this.planCategoryTabs[0]
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
</style>