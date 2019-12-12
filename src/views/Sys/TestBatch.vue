<template>
  <div class="page-container">

   <el-container>
     <!-- 左边是一个部门树 -->
     <el-aside width="180px">
        <el-tree :data="tableTreeDdata" :props="popupTreeProps" @node-click="handleNodeClick">></el-tree>
     </el-aside>
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
				<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:dept:add" type="primary" @click="handleAdd"/>
			</el-form-item>
		</el-form>
	</div>
 </el-header>
    <el-main>	<!--表格树内容栏-->
    <test-batch-table :height="200" :data="pageResult" :columns="filterColumns"	@findPage="findPage" 
                      @handleCurrentChange="handleTestBatchSelected"
                      @handleRelate="handleRelate"> 
    </test-batch-table>
    <div>
     <el-row>
        <el-col :span="12">
      <fieldset style="border-Color: #eef1f6;border-width: 0.5px; text-align: left;  border-radius: 5px; font-size:12px; ">
        <legend>已关联考试课目</legend>
          <el-table ref="testSubjectTable" :data="selectedTestSubjectData" :row-style="{height:'20px'}" 
                    v-loading="getSelectedTestSubjectloading"  :element-loading-text="$t('action.loading')"
                     style="width:100%;" :height="testSubjectHeight" :max-height="testSubjectHeight" :highlightCurrentRow="true" size="mini"
                     :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                     @current-change="handleTestSubjectSelected">
            <el-table-column header-align="center" align="center" label="关联id" prop="rtbsId" v-if="false">
            </el-table-column>  
            <el-table-column header-align="center" align="center" label="课目id" prop="id" v-if="false">
            </el-table-column>       
            <el-table-column header-align="center" align="center" label="课目名称" prop="labelCn">
            </el-table-column>
            <el-table-column header-align="center" align="center" label="格式" prop="gradeFormatLabelCn">
            </el-table-column>
            <el-table-column header-align="center" align="center" label="评定方式" prop="gradeJudgeFormatLabelCn">
            </el-table-column>
      <el-table-column :label="$t('action.operation')" width="185" fixed="right" header-align="center" align="center">
        <template slot-scope="scope">
          <kt-button icon="fa fa-edit" label="设定" perms="sys.testbatch.testsubject.relate" :size="size" @click="handleEdit(scope.$index, scope.row)" />
          <kt-button icon="fa fa-trash" :label="$t('action.delete')" perms="sys.testbatch.unrelate" :size="size" type="danger" @click="handleDeleteRelatedTestSubject(scope.$index, scope.row)" />
        </template>
      </el-table-column>
    </el-table>

      </fieldset>
        </el-col>
         <el-col :span="12">
    <fieldset style="border-Color: #eef1f6;border-width: 0.5px; text-align: left;  border-radius: 5px; font-size:12px; ">
        <legend>已选定考试对象</legend>
           <el-table :data="selectedTestUserData" :row-style="{height:'20px'}" v-loading="getSelectedUserloading" :element-loading-text="$t('action.loading')"
                     style="width:100%;" :header-cell-style="{background:'#eef1f6',color:'#606266'}" size="mini" 
                     :height="testSubjectHeight" :max-height="testSubjectHeight">
            <el-table-column header-align="center" align="center" label="账号名" prop="name">
            </el-table-column>
            <el-table-column header-align="center" align="center" label="所属单位" prop="deptName">
            </el-table-column>
      <el-table-column :label="$t('action.operation')" width="185" fixed="right" header-align="center" align="center">
        <template slot-scope="scope">
          <kt-button icon="fa fa-trash" :label="$t('action.delete')" perms="sys.testbatch.testsubject.testuser.unrelate" :size="size" type="danger" @click="handleDelete(scope.$index, scope.row)" />
        </template>
      </el-table-column>
          </el-table> 
      </fieldset>
        </el-col>
     </el-row>   
    </div>

        <!-- 新增修改界面 -->
    <el-dialog :title="!dataForm.id ? '新增' : '修改'" width="40%" :visible.sync="dialogVisible" 
    :close-on-click-modal="false" @open="dialogOpened">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="submitForm()" 
        label-width="120px" :size="size" style="text-align:left;">
         <el-form-item label="ID" prop="id" v-if="false">
				   <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
			   </el-form-item>
			   <el-form-item label="考试批次名称" prop="labeCn">
				   <el-input v-model="dataForm.labelCn" auto-complete="off"></el-input>
			   </el-form-item>      
          <el-form-item label="所属培训批次" prop="relatedTrainBatchId">
				   <el-select v-model="dataForm.relatedTrainBatchId" placeholder="请选择">
							<el-option
                              v-for="item in trainBatchItemS"
                              :key="item.id"
                              :label="item.labelCn"
                              :value="item.id">
                            </el-option>
						</el-select>
			   </el-form-item>  
         <el-form-item label="所属单位" prop="relatedDeptId">
				   <el-input v-model="dataForm.relatedDeptId" auto-complete="off"></el-input>
			   </el-form-item> 
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :size="size"  @click="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size"  type="primary" @click="submitForm()">{{$t('action.comfirm')}}</el-button>
      </span>
    </el-dialog>
    </el-main>
  </el-container>
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
export default {
	components:{
    PopupTreeInput,
    KtButton,
    TestBatchTable,
    TableTreeColumn,
    FaIconTooltip
	},
	data() {
		return {
      size: 'mini',
      filterColumns: [],
      getSelectedTestSubjectloading: false,
      getSelectedUserloading: false,
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
      dataRule: {
        name: [
          { required: true, message: '单位名称不能为空', trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: '上级单位不能为空', trigger: 'change' }
        ]
      },
      selectedDeptId: -1,
      trainBatchItemS: [],
      popupTreeData: [],
      popupTreeProps: {
				label: 'name',
				children: 'children'
      },
      selectedTestSubjectData: [],
      selectedTestUserData: [],
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
        {prop:"relatedDeptName", label:"单位", minWidth:100},
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

    dialogOpened: function(){
        this.$api.trainBatch.findAll().then((res) => {
				this.trainBatchItemS = res.data
			});
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
			this.dialogVisible = true
			this.dataForm = {
        id: 0,
        name: '',
        parentId: 0,
        parentName: '',
        orderNum: 0
      }
		},
		// 显示编辑界面
		handleEdit: function (row) {
      this.dialogVisible = true
      Object.assign(this.dataForm, row);
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
      let rtbsId = row.rtbsId
      let params = {'rtbsId': rtbsId}
      this.getSelectedTestSubjectloading = true
      this.$api.testSubject.deleteRelatedTestSubject(params).then((res) => {
        this.getSelectedTestSubjectloading = false
        //this.selectedTestSubjectData = res.data
        this.$message({ message: '操作成功', type: 'success' })
			},(error) => {
        this.getSelectedTestSubjectloading = false
        this.$message({message: '删除考试课目关联操作失败, ' + error, type: 'error'})
      })

    },
    handleTestBatchSelected: function(currentRow,oldCurrentRow){
      let testBatchId = currentRow.val.id
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
    handleTestSubjectSelected: function(currentRow,oldCurrentRow){
      let params = {'rtbsId': currentRow.rtbsId}
      this.getSelectedUserloading = true
      this.$api.user.findAllByRTBSId(params).then((res) => {
        this.getSelectedUserloading = false
				this.selectedTestUserData = res.data
			},(error) => {
        this.getSelectedUserloading = false
        this.$message({message: '获取考试对象操作失败, ' + error, type: 'error'})
      })
    },

    getElementToPageTop: function (el) {
      if(el.parentElement) {
    return this.getElementToPageTop(el.parentElement) + el.offsetTop
  }
  return el.offsetTop
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

</style>