<template>
   <div>
           <el-table ref="testSubjectTable" :data="selectedTestSubjectData" :row-style="{height:'20px'}" 
                    v-loading="getSelectedTestSubjectloading"  :element-loading-text="$t('action.loading')"
                     style="width:100%;" :height="tableHeight" :max-height="tableHeight" :highlightCurrentRow="true" size="mini"
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
          <kt-button icon="fa fa-trash" label="移除" perms="sys:testbatch:testsubject:unrelated" :size="size" type="danger" @click="handleDeleteRelatedTestSubject(scope.$index, scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <!--分页栏-->
<div class="toolbar" style="padding:5px;height:30px;background:#eef1f6">
      <kt-button 
                label="关联考试课目" 
                @click="handleRelateTestSubject"
                perms="sys:testbatch:testsubject:relate" 
                :size="size"  
                style="float:left;"/>
      
    </div>
    <related-test-subject-dialog ref="relatedTestSubjectDialog" :testBatchId="selectedTestBatchId" @handleRelatedTestSubject="handleRelatedTestSubject"> </related-test-subject-dialog>
   </div>
        
        
</template>

<script>
import KtButton from "@/views/Core/KtButton"
import RelatedTestSubjectDialog from "./RelatedTestSubjectDialog"
export default {
  name: 'TestBatchRelatedObject',
  components:{
      KtButton,
      RelatedTestSubjectDialog
	},
  props: {

    selectedTestBatchId: {
      type: Number,
      default: -1
    },
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
  watch:{
    selectedTestBatchId: function(){
      this.getTestSubjectByTestBatch(this.selectedTestBatchId)
    },
    autoLoad: function(){
      if (this.autoLoad){
        this.refreshPageRequest(1)
      }
    }
  },
  computed:{
    columnArray: function() {
      return this.columns.filter(function(item) {
        if (typeof(item.show) == 'undefined' || (item.show)){
          return item
         }
       })
     } 
  },
  data() {
    return {
      selectedTestSubjectData: [],
      getSelectedTestSubjectloading: false,
      tableHeight:  0,
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
    handleRelatedTestSubject: function(){
      this.$refs.relatedTestSubjectDialog.setDialogVisible(false)
      this.getTestSubjectByTestBatch(this.selectedTestBatchId)

    },
    handleRelateTestSubject: function(){
      this.$refs.relatedTestSubjectDialog.setDialogVisible(true)
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
  mounted() {
    //可以配置装载组件的时候不要加载数据
    //this.refreshPageRequest(1)
    this.getTestSubjectByTestBatch(this.selectedTestBatchId)
        this.$nextTick(function () {
      
      // this.testBatchTableHeight =  window.innerHeight - this.offsetDis(this.$refs.testBatchTable.$el).top - 35;
      //this.testBatchTableHeight =  window.innerHeight - 126 - 35 - 10 - 9;
      this.tableHeight = window.innerHeight - 126 - 35 - 10 - 9 - 80; 
            // 监听窗口大小变化
            let self = this;
            window.onresize = function() {
             // this.testBatchTableHeight =  window.innerHeight - 126 - 35 - 10 - 9;
              this.tableHeight = window.innerHeight - 126 - 35 - 10 - 9 - 80; 
            }
        })
  }
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

  .el-table .cell {
    padding-left: 3px !important;
    padding-right: 3px !important;
  }
</style>