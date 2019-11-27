<template>
  <div class="page-container">
    <el-tabs type="border-card">
      <el-tab-pane v-for='item in scheduleCategoryTabs'  :label='item.label' :key='item.label'>
        <!--表格树内容栏-->
        <el-table
          :data="planTableData"
          stripe
          size="mini"
          style="width: 100%;"
          rowKey="id"
          v-loading="loading"
          :element-loading-text="$t('action.loading')"
        >
          <el-table-column
            prop="id"
            header-align="center"
            align="center"
            width="110"
            label="ID"
            v-if="false"
          ></el-table-column>
          <el-table-column
            prop="type"
            header-align="center"
            align="center"
            width="150"
            v-if="false"
          ></el-table-column>
          <el-table-column
            prop="typeLabelCn"
            header-align="center"
            align="center"
            width="150"
            label="模板类别"
          ></el-table-column>
          <el-table-column
            prop="category"
            header-align="center"
            align="center"
            width="150"
            v-if="false"
          ></el-table-column>
          <el-table-column
            prop="categoryLabelCn"
            header-align="center"
            align="center"
            width="150"
            label="模板名称"
          ></el-table-column>
          <el-table-column prop="filename" header-align="center" width="150" label="文件名称"></el-table-column>
          <el-table-column prop="relatedUserName" header-align="center" align="center" label="上传者"></el-table-column>
          <el-table-column prop="createDate" header-align="center" align="center" label="上传时间"></el-table-column>
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="300"
            :label="$t('action.operation')"
          >
            <template slot-scope="scope">
              <el-upload
                name="file"
                class="upload-demo"
                style="display: inline"
                :headers="headers"
                :action="uploadUrl"
                :data="{id:scope.row.id}"
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
                >上传</el-button>
              </el-upload>
              <kt-button
                icon="fa fa-trash el-icon-delete"
                size="mini"
                :label="$t('action.delete')"
                perms="sys:dept:delete"
                type="danger"
                @click="handleDelete(scope.row)"
              />
              <el-button
                icon="el-icon-download"
                size="mini"
                label="$t('action.download')"
                type="danger"
                @click="handleDownload(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import KtButton from "@/views/Core/KtButton";
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog";
import Cookies from "js-cookie";
import config from "@/http/config";
import axios from "axios";
export default {
  components: {
    TableColumnFilterDialog,
    KtButton
  },
  data() {
    return {
      headers: {
        token: Cookies.get("token")
      },
      scheduleCategoryTabs: [
        {label: '年度计划'},
        {label: '阶段计划'},
        {label: '具体工作计划'},
        {label: '综合计划'},
        {label: '各专业计划'},
        {label: '月计划'},
        {label: '周计划'}

      ],
      loading: false,
      size: "small",
      filters: {
        name: ""
      },
      planTableData: [],
      scheduleTableData: [],
      columns: [],
      filterColumns: [],
      operation: false, // true:新增, false:编辑
      editLoading: false,
      uploadUrl: config.baseUrl + "/template/templateUpload",
      roles: [],
      enabledUploadBtn: true,
      uploadBtnIcon: "el-icon-upload2"
    };
  },
  methods: {
    // 获取数据
    findTemplateData: function() {
      this.loading = true;
      this.planTableData = [];
      this.scheduleTableData = [];
      this.$api.template.findAll().then(res => {
        for(let record of res.data){
          if (record.type == "plan_type") {
            this.planTableData.push(record)
          }else{
            this.scheduleTableData.push(record)
          }
        }
        this.loading = false;
      });
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
    }
  },
  mounted() {
    this.findTemplateData();
  }
};
</script>

<style scoped>
</style>