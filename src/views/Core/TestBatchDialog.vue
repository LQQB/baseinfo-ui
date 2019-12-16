<template>
    <!-- 新增修改界面 -->
    <el-dialog :title="!dataForm.id ? '新增' : '修改'"  width="90%" :visible.sync="dialogVisible" 
    :close-on-click-modal="false" @open="dialogOpened" style="backgroud-color:red;">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="submitForm()" 
        label-width="120px" :size="size" style="text-align:left;">
        <el-form-item label="ID" prop="id" v-if="false">
				   <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
			   </el-form-item>
         <el-row>
            <el-col :span="10">
              			   <el-form-item label="考试批次名称" prop="labelCn">
				   <el-input v-model="dataForm.labelCn" auto-complete="off"></el-input>
			   </el-form-item> 
            </el-col>  
            <el-col :span="8">
         
     
          <el-form-item label="所属培训批次" prop="relatedTrainBatchId">
				   <el-select v-model="dataForm.relatedTrainBatchId" placeholder="请选择" style="width:300px">
							<el-option
                              v-for="item in trainBatchItemS"
                              :key="item.id"
                              :label="item.labelCn"
                              :value="item.id">
                            </el-option>
						</el-select>
			   </el-form-item>  
            </el-col>
         </el-row>  

         
      </el-form>
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
    <div style="padding:5px;height:30px;background:#eef1f6">
      <kt-button type="primary" label="关联考试课目" perms="sys:testbatch:add" @click="handleRelateTestSubject"></kt-button>
    </div>
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
    <div style="padding:5px;height:30px;background:#eef1f6">
      <kt-button type="primary" label="关联单位" perms="sys:testbatch:add" @click="handleRelateTestDeptUser"></kt-button>
    </div>
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

      <span slot="footer" class="dialog-footer">
        <el-button :size="size"  @click="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size"  type="primary" @click="submitForm()">{{$t('action.comfirm')}}</el-button>
      </span>
      <related-test-subject-dialog ref="relatedTestSubjectDialog" 
                                   @selectionChange="relatedTestSubjectSelections"
                                   @handleRelatedTestSubject="handleRelatedTestSubject"> 
      </related-test-subject-dialog> 
      <related-test-dept-user-dialog ref="relatedTestDeptUserDialog" 
                                   > 
      </related-test-dept-user-dialog> 

    </el-dialog>
</template>

<script>
import KtButton from "@/views/Core/KtButton"
import RelatedTestSubjectDialog from "@/views/Core/RelatedTestSubjectDialog"
import RelatedTestDeptUserDialog from "@/views/Core/RelatedTestDeptUserDialog"
export default {
  name: 'TestBatchDialog',
  components:{
      KtButton,
      RelatedTestSubjectDialog,
      RelatedTestDeptUserDialog,
	},
  props: {
    outterSelectedTestSubjectData:{
       type: Array,
       default:function(){
            return []
        }
    },
    outterSelectedDeptData:{
      type: Array,
      default:function(){
            return []
        }
    },
    outterSelectedTestUserData:{
      type: Array,
      default:function(){
            return []
        }
    },
    formData: {
      type: Object,
      default: function(){
        return {}
      }
    },
    columns: Array, // 表格列配置
    data: Object, // 表格分页数据
    permsEdit: String,  // 编辑权限标识
    permsDelete: String,  // 删除权限标识
    size: { // 尺寸样式
      type: String,
      default: 'mini'
    },
    align: {  // 文本对齐方式
      type: String,
      default: 'left'
    },
    maxHeight: {  // 表格最大高度
      type: Number,
      default: 420
    },
    height: {  // 表格最大高度
      type: Number,
      default: 250
    },
    showOperation: {  // 是否显示操作组件
      type: Boolean,
      default: true
    },
    border: {  // 是否显示边框
      type: Boolean,
      default: false
    },
    stripe: {  // 是否显示斑马线
      type: Boolean,
      default: true
    },
    highlightCurrentRow: {  // // 是否高亮当前行
      type: Boolean,
      default: true
    },
    showOverflowTooltip: {  // 是否单行显示
      type: Boolean,
      default: true
    },
    showBatchDelete: {  // 是否显示操作组件
      type: Boolean,
      default: true
    }
  },

  computed:{
    outterDataForm: function(){
      //this.dataForm = this.outterDataForm;
    }
  },
  data() {
    return {
      dialogVisible: false,
      trainBatchItemS: [],
      dataRule: {
        labelCn: [
          { required: true, message: '考试批次名称不能为空', trigger: 'blur' }
        ],
        relatedTrainBatchId: [
          { required: true, message: '所属培训批次不能为空', trigger: 'change' }
        ]
      },
      getSelectedTestSubjectloading: false,
      getSelectedUserloading: false,
      getSelectedDeptloading: false,
      testSubjectHeight: 200,
      dataForm: this.formData,
      selectedTestSubjectData: this.outterSelectedTestSubjectData,
      selectedDeptData: this.outterSelectedDeptData,
      selectedTestUserData: this.outterSelectedTestUserData,
      // 分页信息
			pageRequest: {
				pageNum: 1,
        pageSize: 10
      },
      loading: false,  // 加载标识
      selections: []  // 列表选中列
    }
  },
  methods: {
    handleRelateTestDeptUser: function(){
      this.$refs.relatedTestDeptUserDialog.setDialogVisible(true)
    },
    handleRelateTestSubject: function(){
      this.$refs.relatedTestSubjectDialog.setDialogVisible(true)
    },
    handleRelatedTestSubject: function(data){
      this.selectedTestSubjectData = data.relatedTestSubject
      this.$refs.relatedTestSubjectDialog.setDialogVisible(false)
    },
    relatedTestSubjectSelections:function(selections){
      this.selections.map(item => console.log(item.toString()))
			
    },
    // 设置可见性
    setDialogVisible: function (visible) {
      this.dialogVisible = visible
    },
    dialogOpened: function(){
        this.$api.trainBatch.findAll().then((res) => {
				this.trainBatchItemS = res.data
			});
		},
    // 分页查询
    findPage: function () {
        this.loading = true
        let callback = res => {
          this.loading = false
        }
      this.$emit('findPage', {pageRequest:this.pageRequest, callback:callback})
    },
    // 选择切换
    selectionChange: function (selections) {
      this.selections = selections
      console.log("selectionChange" + selections)
      this.$emit('selectionChange', {selections:selections})
    },
    // 选择切换
    handleCurrentChange: function (val) {
      console.log("handleCurrentChange" + val.id)
      this.$emit('handleCurrentChange', {val:val})
    },
    // 换页刷新
		refreshPageRequest: function (pageNum) {
      this.pageRequest.pageNum = pageNum
      this.findPage()
    },
    // 编辑
		handleEdit: function (index, row) {
      this.$emit('handleEdit', {index:index, row:row})
		},
    // 删除
		handleDelete: function (index, row) {
			this.delete(row.id)
		},
		// 批量删除
		handleBatchDelete: function () {
			let ids = this.selections.map(item => item.id).toString()
			this.delete(ids)
		},
		// 删除操作
		delete: function (ids) {
			this.$confirm('确认删除选中记录吗？', '提示', {
				type: 'warning'
			}).then(() => {
				let params = []
				let idArray = (ids+'').split(',')
				for(var i=0; i<idArray.length; i++) {
					params.push({'id':idArray[i]})
        }
        this.loading = true
        let callback = res => {
          if(res.code == 200) {
            this.$message({message: '删除成功', type: 'success'})
            this.findPage()
          } else {
            this.$message({message: '操作失败, ' + res.msg, type: 'error'})
          }
          this.loading = false
        }
        this.$emit('handleDelete', {params:params, callback:callback})
			}).catch(() => {
			})
		}
  },
}
</script>

<style>
.clearfix:after {
content: "\0020";
display: block;
height: 0;
clear: both;
}

 .el-table--mini td, .el-table--mini th {
   padding: 3px 0 !important;
 }

</style>