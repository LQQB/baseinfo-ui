<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.name" placeholder="用户名"></el-input>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:role:view" type="primary" @click="findPage(null)"/>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:user:add" type="primary" @click="handleAdd" />
			</el-form-item>
		</el-form>
	</div>
	<!--表格内容栏-->
	<kt-table :height="tableHeight" permsEdit="sys:user:edit" permsDelete="sys:user:delete"
		:data="pageResult" :columns="filterColumns"
		@findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
	</kt-table>
	<!--新增编辑界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="70%" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size"
			label-position="right">
			<el-row>
				<el-col :span="8">
			<el-form-item label="ID" prop="id" v-if="false">
				<el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="账户名" prop="name">
				<el-input v-model="dataForm.name" auto-complete="off"></el-input>
			</el-form-item>
			</el-col>
			<el-col :span="8">
			<el-form-item label="密码" prop="password">
				<el-input v-model="dataForm.password" type="password" auto-complete="off"></el-input>
			</el-form-item>
			</el-col>
			<el-col :span="8">
				<el-form-item label="所属单位" prop="deptName">
				<popup-tree-input 
					:data="deptData" 
					:props="deptTreeProps" 
					:prop="dataForm.deptName" 
					:nodeKey="''+dataForm.deptId" 
					:currentChangeHandle="deptTreeCurrentChangeHandle">
				</popup-tree-input>
			</el-form-item>
			</el-col>
			</el-row>
            <el-row>
				<el-col :span="8">
  			       <el-form-item label="性别" prop="sex">
					  <el-radio v-model="dataForm.sex" label="1">男</el-radio>
                      <el-radio v-model="dataForm.sex" label="2">女</el-radio>
			        </el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="政治面貌" prop="politicalStatus">
						<el-select v-model="dataForm.politicalStatus" placeholder="请选择">
							<el-option
                              v-for="item in politicalStatus"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="年龄" prop="age">
						<el-input v-model="dataForm.age" auto-complete="off"></el-input>
					</el-form-item>
				</el-col>
            </el-row>
            <el-row>
				<el-col :span="8">
					<el-form-item label="籍贯" prop="birthPlace">
						<el-select v-model="dataForm.native" placeholder="请选择">
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="职别" prop="officeRank">
						<el-select v-model="dataForm.native" placeholder="请选择">
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="军衔" prop="militaryRank">
						<el-select v-model="dataForm.native" placeholder="请选择">
						</el-select>
					</el-form-item>
				</el-col>
            </el-row> 
			<el-row>
				<el-col :span="8">
					<el-form-item label="人员类别" prop="personType">
						<el-select v-model="dataForm.personType" placeholder="请选择">
                            <el-option
                              v-for="item in personType"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
            <el-row>
				<el-col :span="8">
				<el-form-item label="身高" prop="height">
					<el-input v-model="dataForm.height" auto-complete="off"></el-input>
				</el-form-item>
				</el-col>
				<el-col :span="8">
				<el-form-item label="体重" prop="weight">
					<el-input v-model="dataForm.weight" auto-complete="off"></el-input>
				</el-form-item>
				</el-col>
				<el-col :span="8">
				<el-form-item label="视力" prop="vision">
					<el-input v-model="dataForm.vision" auto-complete="off"></el-input>
				</el-form-item>
				</el-col>
            </el-row>	
			<el-form-item label="角色" prop="userRoles" v-if="!operation">
				<el-select v-model="dataForm.userRoles" multiple placeholder="请选择"
					 style="width: 100%;">
					<el-option v-for="item in roles" :key="item.id"
						:label="item.remark" :value="item.id">
					</el-option>
				</el-select>
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
import PopupTreeInput from "@/components/PopupTreeInput"
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
import { format } from "@/utils/datetime"
export default {
	components:{
		PopupTreeInput,
		KtTable,
		KtButton,
		TableColumnFilterDialog
	},
	data() {
		return {
			size: 'small',
			filters: {
				name: ''
			},
			columns: [],
			filterColumns: [],
			pageRequest: { pageNum: 1, pageSize: 10 },
			pageResult: {},

			operation: false, // true:新增, false:编辑
			dialogVisible: false, // 新增编辑界面是否显示
			editLoading: false,
			dataFormRules: {
				name: [
					{ required: true, message: '请输入用户名', trigger: 'blur' }
				],
				password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
				],
				deptName: [
					{ required: true, message: '请选择单位', trigger: 'blur' }
				]
			},
			// 新增编辑界面数据
			dataForm: {
				id: 0,
				name: '',
				password: '123456',
				deptId: 1,
				deptName: '',
				email: 'test@qq.com',
				mobile: '13889700023',
				status: 1,
				userRoles: []
			},
			deptData: [],
			deptTreeProps: {
				label: 'name',
				children: 'children'
			},
			roles: [],
			psOptions: [],
			personType:[
				{label: '新兵', value: '1'},
				{label: '学兵', value: '2'},
				{label: '干部', value: '3'}
			],
			politicalStatus:[
				{label: '党员', value: '1'},
				{label: '团员', value: '2'},
				{label: '群众', value: '3'}
			],
			tableHeight: window.innerHeight - 175 - 30 - 10 - 10 - 10
		}
	},
	methods: {
		// 获取分页数据
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			this.pageRequest.columnFilters = {name: {name:'name', value:this.filters.name}}
			this.$api.user.findPage(this.pageRequest).then((res) => {
				this.pageResult = res.data
				this.findUserRoles()
			}).then(data!=null?data.callback:'')
		},
		// 加载用户角色信息
		findUserRoles: function () {
			this.$api.role.findAll().then((res) => {
				// 加载角色集合
				this.roles = res.data	
			})
		},
		// 批量删除
		handleDelete: function (data) {
			this.$api.user.batchDelete(data.params).then(data!=null?data.callback:'')
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
		// 显示编辑界面
		handleEdit: function (params) {
			this.dialogVisible = true
			this.operation = false
			this.dataForm = Object.assign({}, params.row)
			let userRoles = []
			for(let i=0,len=params.row.userRoles.length; i<len; i++) {
				userRoles.push(params.row.userRoles[i].roleId)
			}
			this.dataForm.userRoles = userRoles
		},
		// 编辑
		submitForm: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
						let params = Object.assign({}, this.dataForm)
						let userRoles = []
						for(let i=0,len=params.userRoles.length; i<len; i++) {
							let userRole = {
								userId: params.id,
								roleId: params.userRoles[i]
							}
							userRoles.push(userRole)
						}
						params.userRoles = userRoles
						this.$api.user.save(params).then((res) => {
							this.editLoading = false
							if(res.code == 200) {
								this.$message({ message: '操作成功', type: 'success' })
								this.dialogVisible = false
								this.$refs['dataForm'].resetFields()
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
							}
							this.findPage(null)
						},(error) => {
							this.editLoading = false
							this.$message({message: '操作失败, ' + error, type: 'error'})
						})
					})
				}
			})
		},
		// 获取部门列表
		findDeptTree: function () {
			this.$api.dept.findDeptTree().then((res) => {
				this.deptData = res.data
			})
		},
		// 菜单树选中
      	deptTreeCurrentChangeHandle (data, node) {
        	this.dataForm.deptId = data.id
        	this.dataForm.deptName = data.name
		},
		// 时间格式化
      	dateFormat: function (row, column, cellValue, index){
          	return format(row[column.property])
      	},
		// 处理表格列过滤显示
      	displayFilterColumnsDialog: function () {
			this.$refs.tableColumnFilterDialog.setDialogVisible(true)
      	},
		// 处理表格列过滤显示
      	handleFilterColumns: function (data) {
			this.filterColumns = data.filterColumns
			this.$refs.tableColumnFilterDialog.setDialogVisible(false)
      	},
		// 处理表格列过滤显示
      	initColumns: function () {
			this.columns = [
				{prop:"id", label:"ID", minWidth:50,show: false},
				{prop:"name", label:"账户名", minWidth:120},
				{prop:"deptName", label:"所属单位", minWidth:120},
				{prop:"sex", label:"性别", minWidth:120, formatter: this.sexFormatter},
				{prop:"politicalStatus", label:"政治面貌", minWidth:120, formatter: this.politicalStatusFormatter},
				{prop:"age", label:"年龄", minWidth:120},
				{prop:"birthPlace", label:"籍贯", minWidth:120},
				{prop:"officeRank", label:"职别", minWidth:120},
				{prop:"militaryRank", label:"军衔", minWidth:120},
				{prop:"personType", label:"人员类别", minWidth:120},
				{prop:"height", label:"身高", minWidth:120},
				{prop:"weight", label:"体重", minWidth:120},
				{prop:"vision", label:"视力", minWidth:120},
				{prop:"roleNames", label:"角色", minWidth:100},
				{prop:"status", label:"状态", minWidth:70},
				// {prop:"createBy", label:"创建人", minWidth:120},
				// {prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
				// {prop:"lastUpdateBy", label:"更新人", minWidth:100},
				// {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
			]
			// this.filterColumns = JSON.parse(JSON.stringify(this.columns));
			this.filterColumns = this.columns;
      	},
        sexFormatter: function(row, column, cellValue, index) {
           return row.sex === "1" ? '男' : row.sex === "2" ? '女' : '未知'
		 },
		politicalStatusFormatter: function(row, column, cellValue, index) {
           return row.politicalStatus === "1" ? '党员' : row.politicalStatus === "2" ? '团员' : row.politicalStatus === '3' ? '群众' :'未知'
		},
		//初始化下拉框的数据
		initData: function() {
		   //政治面貌
		   this.$api.dict.getValue("plan_type").then((res) => {
				this.psOptions = res.data
				
			});
		}
	},
	mounted() {
		this.findDeptTree()
		this.initColumns()
		this.initData()
	}
}
</script>

<style scoped>

</style>