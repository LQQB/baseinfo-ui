<template>
  <div class="page-container">

   <el-container>
     <el-aside style="width:60%;">
       <div class="toolbar" style="float:left;padding-top:5px;padding-bottom:5px;padding-left:0px;height:30px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.name" placeholder="名称"></el-input>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:testbatch:view" type="primary" />
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:testbatch:add" type="primary" @click="handleAdd"/>
			</el-form-item>
		</el-form>
	</div>
<test-batch-table 
   ref="testBatchTable"
   :height="testBatchTableHeight" 
   :max-height="testBatchTableHeight"
   :data="pageResult" 
   :columns="filterColumns"	
   @findPage="findPage" 
                      @handleCurrentChange="handleTestBatchSelected"
                      @handleEdit="handleEdit"> 
    </test-batch-table>
     </el-aside> 
    <test-batch-dialog ref="testBatchDialog" :formData="dataForm" @submitForm="submitForm"></test-batch-dialog>
    <el-main>	
       <test-batch-related-object 
            :selectedTestBatchId="selectedTestBatchId" 
            :selectedTestBatchName="selectedTestBatchName"></test-batch-related-object>
    </el-main>
 
</el-container>
  </div>
</template>

<script>
import KtButton from "@/views/Core/KtButton"
import TestBatchTable from "./TestBatch/TestBatchTable"
import FaIconTooltip from "@/components/FaIconTooltip"
import { format } from "@/utils/datetime"
import TestBatchRelatedObject from "./TestBatch/TestBatchRelatedObject"
import TestBatchDialog from "./TestBatch/TestBatchDialog"

export default {
	components:{
    KtButton,
    TestBatchTable,
    FaIconTooltip,
    TestBatchRelatedObject,
    TestBatchDialog
	},
	data() {
		return {
      size: 'mini',
      filterColumns: [],
      pageResult: {},
      pageRequest: { pageNum: 1, pageSize: 10 },
			filters: {
				name: ''
      },

      dialogVisible: false,
      dataForm: {
        id: 0,
        labelCn: '',
        relatedTrainBatchId: 0
      },
      testBatchTableHeight: 0,
      
      selectedTestBatchName: "",
      
      selectedTestBatchId: -1,
		}
	},
	methods: {

    initColumns: function(){
			this.columns = [
				{prop:"id", label:"ID", minWidth:50,show: false},
        {prop:"labelCn", label:"批次名称", minWidth:120},
        {prop:"relatedTrainBatchLabelCn", label:"培训批次", minWidth:180},
			]
			this.filterColumns = JSON.parse(JSON.stringify(this.columns));
    },
    
    		// 获取分页数据
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			this.$api.testBatch.findPage(this.pageRequest).then((res) => {
				this.pageResult = res.data
			}).then(data!=null?data.callback:'')
    },

		// 显示新增界面
		handleAdd: function () {
      this.$refs.testBatchDialog.setDialogVisible(true)
      this.$refs.testBatchDialog.dataForm = {
        id: 0,
        labelCn: '',
        relatedTrainBatchId: ''
      }
		},
		// 显示编辑界面
		handleEdit: function (row) {
      this.$refs.testBatchDialog.setDialogVisible(true)
      Object.assign(this.$refs.testBatchDialog.dataForm, row.row)
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

    // 表单提交
    submitForm () {
      this.$refs.testBatchDialog.setDialogVisible(false)
      this.findPage(null)
    },
    handleTestBatchSelected: function(currentRow,oldCurrentRow){
      if (currentRow.val == null)
      {
        this.selectedTestBatchId = -1
        this.selectedTestBatchName = "未选中考试批次"
      }else{
        this.selectedTestBatchId = currentRow.val.id
        this.selectedTestBatchName = currentRow.val.labelCn
      }

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
    this.initColumns()
    this.$nextTick(function () {
      console.log(this.offsetDis(this.$refs.testBatchTable.$el).top)
      // this.testBatchTableHeight =  window.innerHeight - this.offsetDis(this.$refs.testBatchTable.$el).top - 35;
      this.testBatchTableHeight =  window.innerHeight - 126 - 35 - 10 - 9;
            // 监听窗口大小变化
            let self = this;
            window.onresize = function() {
              this.testBatchTableHeight =  window.innerHeight - 126 - 35 - 10 - 9;
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

