<template>
    <!-- 新增修改界面 -->
    <el-dialog title="关联单位与考试对象"  width="80%" :visible.sync="dialogVisible" 
    :close-on-click-modal="false" style="backgroud-color:red;" append-to-body>
    <div>
      <el-tree
        :props="props"
        :load="loadNode"       
         show-checkbox
        @check-change="handleCheckChange">
      </el-tree>
    </div>  
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
    align: {  // 文本对齐方式
      type: String,
      default: 'left'
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
      this.$emit('handleRelatedTestSubject', {relatedTestSubject: JSON.parse(JSON.stringify(this.selections))})
    },
    handleRelateTestSubject: function(){

    },
    // 设置可见性
    setDialogVisible: function (visible) {
      this.dialogVisible = visible
    },
    // 分页查询
    findPage: function () {
      this.loading = true
			this.$api.testSubject.findPage(this.pageRequest).then((res) => {
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
      console.log("selectionChange" + selections)
    }
  },
  mounted() {
    this.refreshPageRequest(1)
  }
}
</script>

<style>
 .el-table--mini td, .el-table--mini th {
   padding: 3px 0 !important;
 }

</style>