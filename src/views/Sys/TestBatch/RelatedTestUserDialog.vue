<template>
    <!-- 新增修改界面 -->
    <el-dialog title="关联考试对象"  width="80%" :visible.sync="dialogVisible" 
    :close-on-click-modal="false" :destroy-on-close="true" @close="close">
    <el-container>
      <el-aside width="180px">
        <el-tree :data="treeData" 
                 :props="popupTreeProps" 
                 @node-click="handleNodeClick"
                 ref="tree"
                 ></el-tree>
      </el-aside> 
      <el-main>
        <el-row>
          <el-col :span="16">
          <el-table ref="testUserTable" :data="pageResult.content" :row-style="{height:'20px'}" 
                    v-loading="loading"  :element-loading-text="$t('action.loading')"
                     style="width:100%;" :height="300" :max-height="300" :highlightCurrentRow="true" size="mini"
                     :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                     @selection-change="selectionChange">
            <el-table-column type="selection" width="40"></el-table-column>         
            <el-table-column header-align="center" align="center" label="用户id" prop="id" v-if="false">
            </el-table-column>
            <el-table-column header-align="center" align="center" label="账户名" prop="name">
            </el-table-column>
            <el-table-column header-align="center" align="center" label="所属单位" prop="deptName">
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
      </el-main>
    </el-container>


      <span slot="footer" class="dialog-footer">
        <el-button :size="size"  @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size"  type="primary" @click.native="confirmForm">{{$t('action.comfirm')}}</el-button>
      </span>
    </el-dialog>
</template>

<script>
import KtButton from "@/views/Core/KtButton"
export default {
  name: 'RelatedTestUserDialog',
  components:{
			KtButton
	},
  props: {
    testBatchId: {
      type: Number,
      default: '-1'
    },
    size: { // 尺寸样式
      type: String,
      default: 'mini'
    },
  },

  data() {
    return {
      popupTreeProps: {
				label: 'name',
				children: 'children'
			},
      dialogVisible: false,
      treeData: [],
      // 分页信息
			pageRequest: {
				pageNum: 1,
        pageSize: 10
      },
      pageResult: {},
      loading: false,  // 加载标识
      selectedDeptId: -1,//被选中部门的id
    }
  },
  methods: {

    handleNodeClick(data) {
       this.selectedDeptId = data.id
       this.findPage()
      },

    		// 获取数据
    findTreeData: function () {
      this.loading = true
			this.$api.dept.findDeptTree().then((res) => {
        this.treeData = res.data
        this.popupTreeData = this.getParentMenuTree(res.data)
        this.loading = false
			})
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
    confirmForm: function(){

      //添加考试批次与考试用户的关联
      let testUserIdS = []
      this.selections.forEach(item => testUserIdS.push(item.id))
      let params={testBatchId: this.testBatchId, testUser:testUserIdS}
      this.$api.testBatch.relatedTestUser(params).then((res)=>{
        this.$emit('handleRelatedTestUser', {})
      },(error) => {
        this.$message({message: '操作失败, ' + error, type: 'error'})
      })
    },
    handleRelateTestSubject: function(){

    },
    // 设置可见性
    setDialogVisible: function (visible) {
      this.dialogVisible = visible
    },
    // 分页查询
    findPage: function (deptId,testBatchId) {
      this.loading = true
      this.pageRequest.columnFilters = {testBatchId: {name:'testBatchId', value:this.testBatchId},deptId: {name:'deptId',value:this.selectedDeptId}}
			this.$api.user.findUnRelatedByTestBatchId(this.pageRequest).then((res) => {
        this.pageResult = res.data
        this.loading = false
			},(error) => {
        this.loading = false
        this.$message({message: '操作失败, ' + error, type: 'error'})
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
    close: function(){
       this.pageResult = {}
    }
  },
  mounted() {
    //this.refreshPageRequest(1)
    this.findTreeData()
  }
}
</script>

<style>
 .el-table--mini td, .el-table--mini th {
   padding: 3px 0 !important;
 }

</style>