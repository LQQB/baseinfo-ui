<template>

        <div>
         
           <el-table :data="selectedTestUserData.content" :row-style="{height:'20px'}" v-loading="getSelectedUserloading" :element-loading-text="$t('action.loading')"
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
          <kt-button icon="fa fa-trash" label="移除" perms="sys:testbatch:testuser:unrelated" :size="size" type="danger" @click="handleTestBatchUnrelateUser(scope.$index, scope.row)" />
        </template>
      </el-table-column>
          </el-table> 
      <!--分页栏-->
    <div style="padding:5px;height:30px;background:#eef1f6">
      <kt-button 
         label="关联考试对象" 
         perms="sys:testbatch:testuser:related" 
         :size="size"  
         @click="handleRelateTestUser"
         style="float:left;"/>
      <el-pagination layout="total, prev, pager, next, jumper" 
        :current-page="pageRequest.pageNum" :page-size="pageRequest.pageSize" :total="selectedTestUserData.totalSize" style="float:right;">
      </el-pagination>
    </div>
    <related-test-user-dialog ref="relatedTestUserDialog" :testBatchId="selectedTestBatchId" @handleRelatedTestUser="handleRelatedTestUser"> </related-test-user-dialog>
    </div>    
     
</template>

<script>
import KtButton from "@/views/Core/KtButton"
import RelatedTestUserDialog from "./RelatedTestUserDialog"
export default {
  name: 'RelatedTestUser',
  components:{
      KtButton,
      RelatedTestUserDialog
	},
  props: {

    selectedTestBatchId: {
      type: Number,
      default: -1
    },
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
      this.getTestUserByTestBatch(this.selectedTestBatchId)
    },

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
      selectedTestUserData:[],
      getSelectedUserloading: false,
      testSubjectHeight:  0,
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
    handleRelateTestUser: function(){
      this.$refs.relatedTestUserDialog.setDialogVisible(true)
    },
    handleRelatedTestUser: function(){
      this.$refs.relatedTestUserDialog.setDialogVisible(false)
      this.getTestUserByTestBatch(this.selectedTestBatchId)

    },
    // 分页查询
    findPage: function () {
        this.loading = true
        let callback = res => {
          this.loading = false
        }
      this.$emit('findPage', {pageRequest:this.pageRequest, callback:callback})
    },
    getTestUserByTestBatch: function(testBatchId){
      this.pageRequest.columnFilters = {testBatchId: {name:'testBatchId', value:testBatchId}}
      this.getSelectedUserloading = true
      this.$api.user.findByTestBatch(this.pageRequest).then((res) => {
        this.getSelectedUserloading = false
				this.selectedTestUserData = res.data
			},(error) => {
        this.getSelectedUserloading = false
        this.$message({message: '获取考试对象操作失败, ' + error, type: 'error'})
      })
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

    handleTestBatchUnrelateUser: function(index,row){
      this.$confirm('确认移除被关联的考试对象吗？', '提示', {
				type: 'warning'
      }).then(() =>{
      let rtbuId = row.rtbuId
      let rtbId = row.rtbId
      let params = {'rtbuId': rtbuId}
      this.getSelectedUserloading = true
      this.$api.testBatch.unRelatedTestUser(params).then((res) => {
        this.getSelectedUserloading = false
        this.getTestUserByTestBatch(rtbId)
        this.$message({ message: '操作成功', type: 'success' })
			},(error) => {
        this.getSelectedUserloading = false
        this.$message({message: '移除考试对象关联操作失败, ' + error, type: 'error'})
      })
      })

    },
  },
  mounted() {
 //可以配置装载组件的时候不要加载数据
    //this.refreshPageRequest(1)
    this.getTestUserByTestBatch(this.selectedTestBatchId)
        this.$nextTick(function () {
      
      // this.testBatchTableHeight =  window.innerHeight - this.offsetDis(this.$refs.testBatchTable.$el).top - 35;
      //this.testBatchTableHeight =  window.innerHeight - 126 - 35 - 10 - 9;
      this.testSubjectHeight = window.innerHeight - 126 - 35 - 10 - 9 - 80; 
            // 监听窗口大小变化
            let self = this;
            window.onresize = function() {
             // this.testBatchTableHeight =  window.innerHeight - 126 - 35 - 10 - 9;
              this.testSubjectHeight = window.innerHeight - 126 - 35 - 10 - 9 - 80; 
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