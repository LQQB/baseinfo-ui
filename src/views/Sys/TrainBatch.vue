<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.name" placeholder="用户名"></el-input>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:log:view" type="primary" @click="findPage(null)"/>
			</el-form-item>
		</el-form>
	</div>
	<!--表格内容栏-->
	<el-table
          :data="scheduleTableData"
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
            prop="labelCn"
            header-align="center"
            align="center"
            width="150"
            label="培训批次名称"
          ></el-table-column>
		    <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="300"
            :label="$t('action.operation')"
          >
            <template slot-scope="scope">
              <el-button
                icon="el-icon-download"
                size="mini"
                label="$t('action.edit')"
                type="danger"
                @click="handleDownload(scope.row)"
              />
              <kt-button
                icon="fa fa-trash el-icon-delete"
                size="mini"
                :label="$t('action.delete')"
                perms="sys:dept:delete"
                type="danger"
                @click="handleDelete(scope.row)"
              />
            </template>
          </el-table-column>		
	</el-table>	
  </div>
</template>

<script>
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import { format } from "@/utils/datetime"
export default {
	components: {
		KtTable,
		KtButton
	},
	data() {
		return {
			size: 'small',
			filters: {
				name: ''
			},
			columns: [
				{prop:"id", label:"ID", minWidth:60},
				{prop:"userName", label:"用户名", minWidth:100},
				// {prop:"operation", label:"操作", minWidth:120},
				{prop:"method", label:"方法", minWidth:180},
				{prop:"params", label:"参数", minWidth:220},
				{prop:"ip", label:"IP", minWidth:120},
				{prop:"time", label:"耗时", minWidth:80},
				{prop:"createBy", label:"创建人", minWidth:100},
				{prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
				// {prop:"lastUpdateBy", label:"更新人", minWidth:100},
				// {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
			],
			pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},
      showOperation:false
		}
	},
	methods: {
		// 获取分页数据
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			this.pageRequest.columnFilters = {userName: {name:'userName', value:this.filters.name}}
			this.$api.log.findPage(this.pageRequest).then((res) => {
				this.pageResult = res.data
			}).then(data!=null?data.callback:'')
		},
		// 时间格式化
      	dateFormat: function (row, column, cellValue, index){
          	return format(row[column.property])
      	}
	},
	mounted() {
	}
}
</script>

<style scoped>

</style>