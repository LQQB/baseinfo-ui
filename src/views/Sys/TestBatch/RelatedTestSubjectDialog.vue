<template>
    <!-- 新增修改界面 -->
    <el-dialog title="关联考试课目"  width="40%" :visible.sync="dialogVisible"  @open="openDialog"
    :close-on-click-modal="false">

<div>
     <el-row>
        <el-col :span="24">

          <el-table ref="testSubjectTable" :data="pageResult.content" :row-style="{height:'20px'}" 
                    v-loading="loading"  :element-loading-text="$t('action.loading')"
                     style="width:100%;" :height="300" :max-height="300" :highlightCurrentRow="true" size="mini"
                     :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                     @selection-change="selectionChange">
            <el-table-column type="selection" width="40"></el-table-column>         
            <el-table-column header-align="center" align="center" label="课目id" prop="id" v-if="false">
            </el-table-column>
            <el-table-column header-align="center" align="center" label="课目名称" prop="labelCn">
            </el-table-column>
            <el-table-column header-align="center" align="center" label="格式" prop="gradeFormatLabelCn">
            </el-table-column>
            <el-table-column header-align="center" align="center" label="评定方式" prop="gradeJudgeFormatLabelCn">
            </el-table-column>
      
    </el-table>
        <!--分页栏-->
    <div style="padding:5px;height:30px;background:#eef1f6">
      <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest" 
        :current-page="pageRequest.pageNum" :page-size="pageRequest.pageSize" :total="pageResult.totalSize" style="float:right;">
      </el-pagination>
    </div>

        </el-col>
     </el-row>   
    </div>

      <span slot="footer" class="dialog-footer">
        <el-button :size="size"  @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size"  type="primary" @click.native="confirmForm">{{$t('action.comfirm')}}</el-button>
      </span>
    </el-dialog>
</template>

<script>
import KtButton from "@/views/Core/KtButton"
export default {
  name: 'RelatedTestSubjectDialog',
  components:{
			KtButton
	},
  props: {
    size: { // 尺寸样式
      type: String,
      default: 'mini'
    },
    testBatchId: {
      type: Number,
      default: '-1'
    },
  },

  data() {
    return {
      dialogVisible: false,
      // 分页信息
			pageRequest: {
				pageNum: 1,
        pageSize: 10
      },
      pageResult: {},
      loading: false,  // 加载标识
      selections: []  // 列表选中列
    }
  },
  methods: {
    confirmForm: function(){
      //添加考试批次与考试课目的关联
      let testSubjectIdS = []
      this.selections.forEach(item => testSubjectIdS.push(item.id))
      let params={testBatchId: this.testBatchId, testSubject:testSubjectIdS}
      this.$api.testBatch.relatedTestSubject(params).then((res)=>{
        this.$emit('handleRelatedTestSubject', {})
      },(error) => {
        this.$message({message: '操作失败, ' + error, type: 'error'})
      })
      
    },
    // 设置可见性
    setDialogVisible: function (visible) {
      this.dialogVisible = visible
    },
    // 分页查询
    findPage: function () {
      this.loading = true
      this.pageRequest.columnFilters = {testBatchId: {name:'testBatchId', value:this.testBatchId}}
			this.$api.testSubject.findUnRelatedByTestBatchId(this.pageRequest).then((res) => {
        this.pageResult = res.data
        this.loading = false
			},(error) => {
        this.loading = false
        console.log(error)
      })
      
    },
    // 换页刷新
		refreshPageRequest: function (pageNum) {
      this.pageRequest.pageNum = pageNum
      this.findPage()
    },
    // 选择切换
    selectionChange: function (selections) {
      this.selections = selections
    },
    openDialog: function(){
      this.refreshPageRequest(1)
    }
  },
}
</script>

<style>
 .el-table--mini td, .el-table--mini th {
   padding: 3px 0 !important;
 }

</style>