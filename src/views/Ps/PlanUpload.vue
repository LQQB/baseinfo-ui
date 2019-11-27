<template>
  <div class="page-container">
    <el-tabs type="border-card" @tab-click="tabClick" v-model="activeName">
      <el-tab-pane v-for='item in planCategoryTabs' :label='item.label' :key='item.category' :name='item.label'>
	    <!--表格内容栏-->
	      <kt-table :height="350" :data="pageResult" @findPage="findPage" :columns="filterColumns" :autoLoad='item.load'>
	      </kt-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton";
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog";
import Cookies from "js-cookie";
import config from "@/http/config";
import axios from "axios";
export default {
  mounted() {
     console.log("this comp")
  },
  components: {
    TableColumnFilterDialog,
    KtButton,
    KtTable
  },
  data() {
    return {
      activeName: "年度方案",
      planCategoryTabs: [
        {label: '年度方案',category: '1',load: true},
        {label: '阶段方案',category: '2',load: false},
        {label: '综合方案',category: '3',load: false},
        {label: '具体工作方案',category: '4',load: false}
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
      uploadUrl: config.baseUrl + "/template/templateUpload",
      roles: [],
      enabledUploadBtn: true,
      uploadBtnIcon: "el-icon-upload2"
    };
  },
  methods: {
    tabClick: function(tab){
      console.log("tab" + tab.label + ";" + tab.name)
      for(let i = 0; i < this.planCategoryTabs.length; i++){
        if (this.planCategoryTabs[i].label == tab.label){
          this.planCategoryTabs[i].load = true
          break;
        }
      }

    },
		// 获取分页数据
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			this.pageRequest.columnFilters = {name: {name:'name', value:this.filters.name}}
			this.$api.sysPlan.findPage(this.pageRequest).then((res) => {
				this.pageResult = res.data
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
      this.findTemplateData();
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
    // 处理表格列过滤显示
    displayFilterColumnsDialog: function() {
      this.$refs.tableColumnFilterDialog.setDialogVisible(true);
    },
    // 处理表格列过滤显示
    handleFilterColumns: function(data) {
      this.filterColumns = data.filterColumns;
      this.$refs.tableColumnFilterDialog.setDialogVisible(false);
    },
    handleDelete(row) {
      this.$confirm("确认删除模板文件吗？", "提示", {
        type: "warning"
      }).then(() => {
        this.$api.template.batchDelete(row).then(
          res => {
            this.$message({ message: "模板文件删除成功", type: "success" });
            row.filename = "";
            row.relatedUserName = "";
            row.createDate = "";
          },
          error => {
            this.$message({ message: "模板文件删除失败", type: "error" });
          }
        );
      });
    },
    handleDownload(row) {
      if (row.filename == null || row.filename.length == 0) {
        this.$message({ message: "请先上传模板文件!", type: "error" });
      } else {
        config.headers.token = Cookies.get("token");
        const instance = axios.create({
          headers: config.headers,
          timeout: config.timeout,
          withCredentials: config.withCredentials
        });

        instance
          .post(config.baseUrl + "/template/download", row, {
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
          })
          .catch(function(error) {
            console.log(error);
          });

        // this.$api.template.download(row).then(res =>{
        //    this.$message({message: '模板文件下载成功', type: 'success'})
        // },(error) =>{
        //   this.$message({message: '模板文件下载失败', type: 'error'})
        // })
      }
    },
    		// 显示新增界面
		handleAdd: function () {
			this.dialogVisible = true
			this.operation = true
			this.dataForm = {
				id: 0,
				name: '',
				password: '',
				deptId: 1,
				deptName: '',
				email: 'test@qq.com',
				mobile: '13889700023',
				status: 1,
				userRoles: []
			}
		},
  },
  mounted() {
    this.initColumns()
  }
};
</script>

<style scoped>
</style>