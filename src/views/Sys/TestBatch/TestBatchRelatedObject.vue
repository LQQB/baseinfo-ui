<template>
    <fieldset style="border-Color: #eef1f6;border-width: 0.5px; text-align: left;  border-radius: 5px; font-size:12px; ">
        <legend>{{selectedTestBatchName}}-{{relatedObjectLabel}}</legend>
        
         
          
      
   <el-tabs type="border-card" @tab-click="testSubjectUserTabClcik"  v-model="activeName"> 
     <el-tab-pane label="考试课目">
        <related-test-subject :selectedTestBatchId="selectedTestBatchId"></related-test-subject>
     </el-tab-pane>  
      <el-tab-pane label="考试对象">
        <related-test-user :selectedTestBatchId="selectedTestBatchId"></related-test-user>
      </el-tab-pane>  
        </el-tabs>  
   </fieldset>
</template>

<script>
import KtButton from "@/views/Core/KtButton"
import RelatedTestSubject from "./RelatedTestSubject"
import RelatedTestUser from "./RelatedTestUser"
export default {
  name: 'TestBatchRelatedObject',
  components:{
      KtButton,
      RelatedTestSubject,
      RelatedTestUser,
	},
  props: {
    selectedTestBatchName: {
      type: String,
      default: ""
    } ,
    selectedTestBatchId: {
      type: Number,
      default: -1
    } , 
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
      testUserPageRequest: { pageNum: 1, pageSize: 10 },
      relatedObjectLabel: "考试课目",
      activeName: "0",
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
    testSubjectUserTabClcik: function(tab) {
      this.relatedObjectLabel = tab.label
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
    if ((typeof(this.autoLoad) == 'undefined') || this.autoLoad){
      this.refreshPageRequest(1)
    }
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