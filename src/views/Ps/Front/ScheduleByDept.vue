<template>
    <div>
      <el-container>
      <el-aside width="180px">
        <el-tree :data="treeData" 
                 :props="popupTreeProps" 
                 @node-click="handleNodeClick"
                 ref="tree"
                 ></el-tree>
      </el-aside> 
      <el-main>
        <el-tabs type="border-card" v-model="activeName" @tab-click="tabClick">
         <el-tab-pane v-for='item in scheduleCategoryTabs' :label='item.label' :key='item.category' :name='item.category'>
	    <!--表格内容栏-->
	      <ps-table-download :height="350" :data="item.pageResult" @findPage="findPage" :columns="filterColumns" 
        :autoLoad='item.load'
        permsDownload="permsDownload"
        @handleDownload="handleDownload">
	      </ps-table-download>
      </el-tab-pane>
    </el-tabs>
      </el-main>
      </el-container>
     </div>   
</template>
<script>
import PsTableDownload from "@/views/Ps/PsTableDownload"
import {download} from "@/utils/download";
export default {
  components: {
    PsTableDownload
  },
  name: 'ScheduleByDept',
  data() {
    return {
      activeName: "1",
      treeData: [],
      popupTreeProps: {
				label: 'name',
				children: 'children'
			},
      scheduleCategoryTabs: [
        {label: '年度计划',category: '1',load: true,pageResult: {}},
        {label: '阶段计划',category: '2',load: false,pageResult: {}},
        {label: '具体工作计划',category: '3',load: false,pageResult: {}},
        {label: '综合计划',category: '4',load: false,pageResult: {}},
        {label: '各专业计划',category: '5',load: false,pageResult: {}},
        {label: '月计划',category: '6',load: false,pageResult: {}},
        {label: '周计划',category: '7',load: false,pageResult: {}}
      ],
      loading: false,  // 加载标识
      selectedDeptId: -1,//被选中部门的id
      columns: [],
      filterColumns: [],
      // 分页信息
			pageRequest: {
				pageNum: 1,
        pageSize: 10
      },
    }
  },
  methods: {
    tabClick: function(tab){
      this.key = tab.key
      for(let i = 0; i < this.scheduleCategoryTabs.length; i++){
        if (this.scheduleCategoryTabs[i].label == tab.label){
          this.selectedTab = this.scheduleCategoryTabs[i]
          this.selectedTab.load = true
          break;
        }
      }

    },
    handleNodeClick(data) {
       this.selectedDeptId = data.id
       this.findPage(null)
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
    handleDownload(data){
       let url = "/sysSchedule/download"
       download(url,data.row)
    },
    findPage: function(data){
      if(data !== null) {
				this.pageRequest = data.pageRequest
			}
      this.pageRequest.columnFilters = {deptId: {name:'deptId',value:this.selectedDeptId},category:{name:'category',value:this.activeName}}
			this.$api.sysSchedule.findPage(this.pageRequest).then((res) => {
        this.selectedTab.pageResult = res.data
			},(error) => {
        this.$message({message: '操作失败, ' + error, type: 'error'})}).then(data!=null?data.callback:'')

    },
    // 处理表格列过滤显示
    initColumns: function () {
			this.columns = [
				{prop:"id", label:"ID", minWidth:50, show: false},
				{prop:"category", label:"类别", minWidth:120, show: false},
        {prop:"filename", label:"文件名", minWidth:120},
        {prop:"path", label:"路径", minWidth:120, show: false},
        {prop:"relatedUserId", label:"上传用户ID", minWidth:120, show: false},
        {prop:"relatedUserName", label:"上传者", minWidth:120},
        {prop:"relatedDeptId", label:"部门ID", minWidth:120, show: false},
        {prop:"relatedDeptName", label:"部门", minWidth:120},
				{prop:"createDate", label:"上传日期", minWidth:100}
			]
			this.filterColumns = JSON.parse(JSON.stringify(this.columns));
    },
  },
  mounted() {
    //this.refreshPageRequest(1)
    this.findTreeData()
    this.initColumns()
    this.selectedTab = this.scheduleCategoryTabs[0]
  }
}
</script>