<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :size="size">
			<el-form-item>
				<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:user:add" type="primary" @click="handleAdd"/>
			</el-form-item>
		</el-form>
	</div>
	<!--表格内容栏-->
	<kt-table :height="350" 
		:data="pageResult" :columns="filterColumns"
		@findPage="findPage">
	</kt-table>
	<!--新增编辑界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size"
			label-position="right">
			<el-form-item label="ID" prop="id" v-if="false">
				<el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="批次名称" prop="labeCn">
				<el-input v-model="dataForm.labelCn" auto-complete="off"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
			<el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
		</div>
	</el-dialog>	
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
				{prop:"labelCn", label:"批次名称", minWidth:100},
				{prop:"createByLabel", label:"创建者", minWidth:220},
				{prop:"createDate", label:"创建日期", minWidth:180},
			],
			filterColumns: [],
			// 新增编辑界面数据
			dataForm: {
				id: 0,
				labelCn: ''
			},
			pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},
	  showOperation:false,
	  editLoading: false,
	  dialogVisible: false, // 新增编辑界面是否显示
	  operation: false, // true:新增, false:编辑
	  dataFormRules: {
				labelCn: [
					{ required: true, message: '请输入批次名称', trigger: 'blur' }
				]
			},
		}
	},
	methods: {
		// 获取分页数据
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			//this.pageRequest.columnFilters = {userName: {name:'userName', value:this.filters.name}}
			this.$api.trainBatch.findPage(this.pageRequest).then((res) => {
				this.pageResult = res.data
			}).then(data!=null?data.callback:'')
		},
        initColumns: function(){
			this.columns = [
				{prop:"id", label:"ID", minWidth:50,show: false},
				{prop:"labelCn", label:"批次名称", minWidth:220},
				{prop:"createByLabelCn", label:"创建者", minWidth:100},
				{prop:"createDate", label:"创建日期", minWidth:120},
			]
			this.filterColumns = JSON.parse(JSON.stringify(this.columns));
		},
		// 显示新增界面
		handleAdd: function () {
			this.dialogVisible = true
			this.operation = true
			this.dataForm = {
				id: 0,
				labelCn: ''
			}
		},
		// 编辑
		submitForm: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
						let params = Object.assign({}, this.dataForm)
						this.$api.trainBatch.save(params).then((res) => {
							this.editLoading = false
							if(res.code == 200) {
								this.$message({ message: '操作成功', type: 'success' })
								this.dialogVisible = false
								this.$refs['dataForm'].resetFields()
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
							}
							this.findPage(null)
						})
					})
				}
			})
		},
	},
	mounted() {
		this.initColumns()
	}
}
</script>

<style scoped>

</style>