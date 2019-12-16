<template>
  <div class="page-container">

   <el-container>
   
 <el-header>	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:5px;padding-left:0px;height:30px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.name" placeholder="名称"></el-input>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:dept:view" type="primary" @click="findTreeData(null)"/>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:testbatch:add" type="primary" @click="handleAdd"/>
			</el-form-item>
		</el-form>
	</div>
 </el-header>
    <el-main>	<!--表格树内容栏-->
    <test-batch-table :height="200" :data="pageResult" :columns="filterColumns"	@findPage="findPage" 
                      @handleCurrentChange="handleTestBatchSelected"
                      @handleRelate="handleRelate"
                      @handleEdit="handleEdit"> 
    </test-batch-table>
    <div>
     <el-row>
        <el-col :span="8">
      <fieldset style="border-Color: #eef1f6;border-width: 0.5px; text-align: left;  border-radius: 5px; font-size:12px; ">
        <legend>已关联考试课目</legend>
          <el-table ref="testSubjectTable" :data="selectedTestSubjectData" :row-style="{height:'20px'}" 
                    v-loading="getSelectedTestSubjectloading"  :element-loading-text="$t('action.loading')"
                     style="width:100%;" :height="testSubjectHeight" :max-height="testSubjectHeight" :highlightCurrentRow="true" size="mini"
                     :header-cell-style="{background:'#eef1f6',color:'#606266'}">
            <el-table-column header-align="center" align="center" label="关联id" prop="rtbsId" v-if="false">
            </el-table-column>  
            <el-table-column header-align="center" align="center" label="课目id" prop="id" v-if="false">
            </el-table-column>
            <el-table-column header-align="center" align="center" label="考试批次id" prop="rtbId" v-if="false">
            </el-table-column>              
            <el-table-column header-align="center" align="center" label="课目名称" prop="labelCn">
            </el-table-column>
            <el-table-column header-align="center" align="center" label="格式" prop="gradeFormatLabelCn">
            </el-table-column>
            <el-table-column header-align="center" align="center" label="评定方式" prop="gradeJudgeFormatLabelCn">
            </el-table-column>
      <el-table-column :label="$t('action.operation')" width="85" fixed="right" header-align="center" align="center">
        <template slot-scope="scope">
          <kt-button icon="fa fa-trash" label="移除" perms="sys.testbatch.testsubject.unrelate" :size="size" type="danger" @click="handleDeleteRelatedTestSubject(scope.$index, scope.row)" />
        </template>
      </el-table-column>
    </el-table>

      </fieldset>
        </el-col>

 <el-col :span="8">
    <fieldset style="border-Color: #eef1f6;border-width: 0.5px; text-align: left;  border-radius: 5px; font-size:12px; margin-left:2px; margint-right:2px; ">
        <legend>已选定单位</legend>
           <el-table :data="selectedDeptData" :row-style="{height:'20px'}" v-loading="getSelectedUserloading" :element-loading-text="$t('action.loading')"
                     style="width:100%;" :header-cell-style="{background:'#eef1f6',color:'#606266'}" size="mini" 
                     :height="testSubjectHeight" :max-height="testSubjectHeight">
            <el-table-column header-align="center" align="center" label="单位名称" prop="name">
            </el-table-column>
            <el-table-column header-align="center" align="center" label="关联id" prop="rtbsId" v-if="false">
            </el-table-column>
      <el-table-column :label="$t('action.operation')" width="185" fixed="right" header-align="center" align="center">
        <template slot-scope="scope">
          <kt-button icon="fa fa-trash" label="移除" perms="sys.testbatch.dept.unrelate" :size="size" type="danger" @click="handleTestBatchUnrelateDept(scope.$index, scope.row)" />
        </template>
      </el-table-column>
          </el-table> 
      </fieldset>
  </el-col>


  <el-col :span="8">
    <fieldset style="border-Color: #eef1f6;border-width: 0.5px; text-align: left;  border-radius: 5px; font-size:12px; ">
        <legend>已选定考试对象</legend>
           <el-table :data="selectedTestUserData" :row-style="{height:'20px'}" v-loading="getSelectedUserloading" :element-loading-text="$t('action.loading')"
                     style="width:100%;" :header-cell-style="{background:'#eef1f6',color:'#606266'}" size="mini" 
                     :height="testSubjectHeight" :max-height="testSubjectHeight">
            <el-table-column header-align="center" align="center" label="账号名" prop="name">
            </el-table-column>
            <el-table-column header-align="center" align="center" label="所属单位" prop="deptName">
            </el-table-column>
            <el-table-column header-align="center" align="center" label="关联ID" prop="rtbuid" v-if="false">
            </el-table-column>
      <el-table-column :label="$t('action.operation')" width="185" fixed="right" header-align="center" align="center">
        <template slot-scope="scope">
          <kt-button icon="fa fa-trash" label="移除" perms="sys.testbatch.user.unrelate" :size="size" type="danger" @click="handleTestBatchUnrelateUser(scope.$index, scope.row)" />
        </template>
      </el-table-column>
          </el-table> 
      </fieldset>
    </el-col>
     </el-row>   
    </div>
    		<!--对话框显示列界面-->
		<test-batch-dialog ref="testBatchDialog"> </test-batch-dialog> 
    
    </el-main>
 
</el-container>
  </div>
</template>

<script>
import KtButton from "@/views/Core/KtButton"
import TestBatchTable from "@/views/Core/table/TestBatchTable"
import TableTreeColumn from '@/views/Core/TableTreeColumn'
import PopupTreeInput from "@/components/PopupTreeInput"
import FaIconTooltip from "@/components/FaIconTooltip"
import { format } from "@/utils/datetime"
import TestBatchDialog from "@/views/Core/TestBatchDialog"
export default {
	components:{
    PopupTreeInput,
    KtButton,
    TestBatchTable,
    TableTreeColumn,
    FaIconTooltip,
    TestBatchDialog
	},
	data() {
		return {
      size: 'mini',
      filterColumns: [],
      getSelectedTestSubjectloading: false,
      getSelectedUserloading: false,
      getSelectedDeptloading: false,
      pageResult: {},
      pageRequest: { pageNum: 1, pageSize: 10 },
			filters: {
				name: ''
      },
      tableTreeDdata: [],
      dialogVisible: false,
      dataForm: {
        id: 0,
        labelCn: '',
        relatedDeptId: 0,
        relatedTrainBatchId: 0
      },
      selectedDeptId: -1,
      popupTreeData: [],
      popupTreeProps: {
				label: 'name',
				children: 'children'
      },
      selectedTestSubjectData: [],
      selectedTestUserData: [],
      selectedDeptData: [],
      testSubjectHeight:  0
		}
	},
	methods: {
		// 获取数据
    findTreeData: function () {
      this.loading = true
			this.$api.dept.findDeptTree().then((res) => {
        this.tableTreeDdata = res.data
        this.popupTreeData = this.getParentMenuTree(res.data)
        this.loading = false
			})
    },
    initColumns: function(){
			this.columns = [
				{prop:"id", label:"ID", minWidth:50,show: false},
        {prop:"labelCn", label:"批次名称", minWidth:120},
        {prop:"relatedTrainBatchLabelCn", label:"培训批次", minWidth:180},
        {prop:"createByLabelCn", label:"创建者", minWidth:100},
				{prop:"createDate", label:"创建日期", minWidth:120},
			]
			this.filterColumns = JSON.parse(JSON.stringify(this.columns));
    },
    
    		// 获取分页数据
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			this.pageRequest.columnFilters = {deptId: {name:'deptId', value:this.selectedDeptId}}
			this.$api.testBatch.findPage(this.pageRequest).then((res) => {
				this.pageResult = res.data
			}).then(data!=null?data.callback:'')
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
      //获取部门id
      let deptId = obj.id
      if (deptId !== this.selectedDeptId) {
        this.selectedDeptId = deptId 
        this.findPage(null)
      }
    },
		// 显示新增界面
		handleAdd: function () {
      this.$refs.testBatchDialog.setDialogVisible(true)
      this.$refs.testBatchDialog.dataForm = {
        id: 0,
        labelCn: '',
        relatedTrainBatchId: ''
      }
      this.$refs.testBatchDialog.selectedTestSubjectData = []
      this.$refs.testBatchDialog.selectedDeptData = []
      this.$refs.testBatchDialog.selectedTestUserData = []
			// this.dialogVisible = true
			// this.dataForm = {
      //   id: 0,
      //   name: '',
      //   parentId: 0,
      //   parentName: '',
      //   orderNum: 0
      // }
		},
		// 显示编辑界面
		handleEdit: function (row) {
      this.$refs.testBatchDialog.setDialogVisible(true)
      Object.assign(this.$refs.testBatchDialog.dataForm, row.row)
      Object.assign(this.$refs.testBatchDialog.outterSelectedTestSubjectData, this.selectedTestSubjectData)
      Object.assign(this.$refs.testBatchDialog.outterSelectedDeptData, this.selectedDeptData)
      Object.assign(this.$refs.testBatchDialog.outterSelectedTestUserData, this.selectedTestUserData)

		},
    // 删除
    handleDelete (row) {
      this.$confirm('确认删除选中记录吗？', '提示', {
				type: 'warning'
      }).then(() => {
        let params = this.getDeleteIds([], row)
        this.$api.dept.batchDelete(params).then( res => {
          this.findTreeData()
          this.$message({message: '删除成功', type: 'success'})
        })
      })
    },
    // 获取删除的包含子单位的id列表
    getDeleteIds (ids, row) {
      ids.push({id:row.id})
      if(row.children != null) {
        for(let i=0, len=row.children.length; i<len; i++) {
          this.getDeleteIds(ids, row.children[i])
        }
      }
      return ids
    },
      // 单位树选中
    handleTreeSelectChange (data, node) {
      this.dataForm.parentId = data.id
      this.dataForm.parentName = data.name
    },
    // 表单提交
    submitForm () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
            let params = Object.assign({}, this.dataForm)
            params.relatedDeptId = this.selectedDeptId
						this.$api.testBatch.save(params).then((res) => {
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
		// 时间格式化
    dateFormat: function (row, column, cellValue, index){
      return format(row[column.property])
    },
    handleRelate: function(index,row){

    },
    handleDeleteRelatedTestSubject: function(index,row){
      this.$confirm('确认移除被关联的考试课目吗？', '提示', {
				type: 'warning'
      }).then(() =>{
      let rtbsId = row.rtbsId
      let rtbId = row.rtbId
      let params = {'rtbsId': rtbsId}
      this.getSelectedTestSubjectloading = true
      this.$api.testSubject.deleteRelatedTestSubject(params).then((res) => {
        this.getSelectedTestSubjectloading = false
        this.getTestSubjectByTestBatch(rtbId)
        this.$message({ message: '操作成功', type: 'success' })
			},(error) => {
        this.getSelectedTestSubjectloading = false
        this.$message({message: '移除考试课目关联操作失败, ' + error, type: 'error'})
      })
      })

    },
    handleTestBatchSelected: function(currentRow,oldCurrentRow){
      let testBatchId = currentRow.val.id
      this.getTestSubjectByTestBatch(testBatchId)
      this.getDeptByTestBatch(testBatchId)
      this.getUserByTestBatch(testBatchId)

    },
    getTestSubjectByTestBatch: function(testBatchId){
      let params = {'testBatchId': testBatchId}
      this.getSelectedTestSubjectloading = true
      this.$api.testSubject.findAllByTestBatchId(params).then((res) => {
        this.getSelectedTestSubjectloading = false
				this.selectedTestSubjectData = res.data
			},(error) => {
        this.getSelectedTestSubjectloading = false
        this.$message({message: '获取已关联考试课目操作失败, ' + error, type: 'error'})
      })

    },
    getDeptByTestBatch: function(testBatchId){
      let params = {'testBatchId': testBatchId}
      this.getSelectedDeptloading = true
      this.$api.dept.findByTestBatch(params).then((res) => {
        this.getSelectedDeptloading = false
				this.selectedDeptData = res.data
			},(error) => {
        this.getSelectedDeptloading = false
        this.$message({message: '获取已选定单位操作失败, ' + error, type: 'error'})
      })

    },
    getUserByTestBatch: function(testBatchId){
      let params = {'testBatchId': testBatchId}
      this.getSelectedUserloading = true
      this.$api.user.findByTestBatch(params).then((res) => {
        this.getSelectedUserloading = false
				this.selectedTestUserData = res.data
			},(error) => {
        this.getSelectedUserloading = false
        this.$message({message: '获取考试对象操作失败, ' + error, type: 'error'})
      })
    },


offsetDis: function(obj) {
		var l = 0, t = 0;
		while(obj) {
			l = l + obj.offsetLeft + obj.clientLeft;
			t = t + obj.offsetTop + obj.clientTop;
			obj = obj.offsetParent;
		}
		return {left: l, top: t};
	}

	},
	mounted() {
    this.findTreeData()
    this.initColumns()
    this.$nextTick(function () {
        this.testSubjectHeight = window.innerHeight - this.offsetDis(this.$refs.testSubjectTable.$el).top - 28;
            // 监听窗口大小变化
            let self = this;
            window.onresize = function() {
                this.testSubjectHeight = window.innerHeight - this.offsetDis(this.$refs.testSubjectTable.$el).top - 28;
            }
        })
	}
}
</script>

<style scoped>
 .el-header {
   height: 35px !important;
 }

 .el-main {
   padding-top: 10px !important;
 }

 .el-table--mini td, .el-table--mini th {
   padding: 3px 0 !important;
 }

.dialogCustomClass {
  width:80%;
}



</style>

<style>
.el-dialog__header {
  background-color: !important;
}
</style>