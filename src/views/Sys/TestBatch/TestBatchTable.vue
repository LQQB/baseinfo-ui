<template>
  <div>
    <!--表格栏-->
    <el-table :data="data.content" :highlight-current-row="highlightCurrentRow" :row-style="{height:'20px'}" 
          @current-change="handleCurrentChange" v-loading="loading" :element-loading-text="$t('action.loading')" :border="true" :stripe="stripe"
          :show-overflow-tooltip="showOverflowTooltip" :max-height="maxHeight" :height="height" :size="size" :align="align" style="width:100%;" 
          :header-cell-style="{background:'#eef1f6',color:'#606266'}">
      <el-table-column v-for="column in columnArray" header-align="center" align="center"
        :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth" 
        :fixed="column.fixed" :key="column.prop" :type="column.type" :formatter="column.formatter">
      </el-table-column>
      <el-table-column :label="$t('action.operation')" ::min-width="185" fixed="right" header-align="center" align="center">
        <template slot-scope="scope">
          <kt-button icon="fa fa-edit" :label="$t('action.edit')" perms="sys:testbatch:edit" :size="size" @click="handleEdit(scope.$index, scope.row)" />
          <kt-button icon="fa fa-trash" :label="$t('action.delete')" perms="sys:testbatch:delete" :size="size" type="danger" @click="handleDelete(scope.$index, scope.row)" />
          <kt-button icon="fa fa-trash" label="下载成绩模板" perms="sys:testbatch:grademodel:download" :size="size" type="danger" @click="handleDownload(scope.$index, scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <!--分页栏-->
    <div style="padding:5px;height:30px;background:#eef1f6">
      <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest" 
        :current-page="pageRequest.pageNum" :page-size="pageRequest.pageSize" :total="data.totalSize" style="float:right;">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import KtButton from "@/views/Core/KtButton"
import {download} from "@/utils/download";
export default {
  name: 'KtTable',
  components:{
			KtButton
	},
  props: {
    autoLoad: {
      type: Boolean, //是否自动加载数据
      default: true

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
      // 分页信息
			pageRequest: {
				pageNum: 1,
        pageSize: 10
      },
      loading: false,  // 加载标识
    }
  },
  methods: {
    // 分页查询
    findPage: function () {
        this.loading = true
        let callback = res => {
          this.loading = false
        }
      this.$emit('findPage', {pageRequest:this.pageRequest, callback:callback})
    },
    // 选择切换
    handleCurrentChange: function (val) {
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
    
    // 下载考试成绩模板
		handleDownload: function (index, row) {
      let url = "/testBatch/download"
			download(url,row)
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