<template>
  <div class="page-container">
  <el-row>
    <el-col :span="8">
    <fieldset style="border-Color: #eef1f6;border-width: 0.5px; text-align: left;  border-radius: 5px; font-size:12px; ">
       <legend>大专业</legend>
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.name" placeholder="名称"></el-input>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:dept:view" type="primary" @click="findTreeData(null)"/>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:dept:add" type="primary" @click="handleAddSpecial"/>
			</el-form-item>
		</el-form>
	</div>
	<!--大专业表格树内容栏-->
    <el-table :data="specialTableData" stripe size="mini" style="width: 100%;" :row-style="{height:'20px'}"
      rowKey="id" v-loading="loading" element-loading-text="$t('action.loading')" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
      <el-table-column
        prop="id" header-align="center" align="center" width="110" label="ID" v-if="false">
      </el-table-column>

      <el-table-column
        prop="labelCn" header-align="center" align="center" width="110" label="名称">
        <template slot-scope="scope">
          <el-input v-model="scope.row.labelCn" :disabled="!scope.row.disabled"></el-input>
        </template>
      </el-table-column>


      <el-table-column
        fixed="right" header-align="center" align="center" width="185" :label="$t('action.operation')">
        <template slot-scope="scope">
          <el-button v-if="scope.row.edit" type="success" size="mini"
                     icon="el-icon-circle-check-outline" @click="confirmEdit(scope.row)">保存
          </el-button>
          <el-button v-else type="primary" size="mini"  @click="startEdit(scope.row)">编辑
          </el-button>
          <el-button v-if="scope.row.edit" class="cancel-btn" size="mini" icon="el-icon-refresh"
                     type="warning" @click="cancelEdit(scope.row)">取消
          </el-button>  
        </template>      
      </el-table-column>
    </el-table>
    </fieldset>  
      
    </el-col>  
    <el-col :span="8">
       <fieldset style="border-Color: #eef1f6;border-width: 0.5px; text-align: left;  border-radius: 5px; font-size:12px; ">
       <legend>大课目</legend>
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.name" placeholder="名称"></el-input>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:dept:view" type="primary" @click="findTreeData(null)"/>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:dept:add" type="primary" @click="handleAdd"/>
			</el-form-item>
		</el-form>
	</div>
	<!--表格树内容栏-->
    <el-table :data="bigKemuTableData" stripe size="mini" style="width: 100%;"
      rowKey="id" v-loading="loading" element-loading-text="$t('action.loading')">
      <el-table-column
        prop="id" header-align="center" align="center" width="110" label="ID" v-if="false">
      </el-table-column>
      <table-tree-column 
        prop="labelCn" header-align="center" treeKey="id" width="150" label="名称">
      </table-tree-column>
      <el-table-column
        fixed="right" header-align="center" align="center" width="185" :label="$t('action.operation')">
        <template slot-scope="scope">
          <el-button v-if="scope.row.edit" type="success" size="mini"
         icon="el-icon-circle-check-outline" @click="confirmEdit(scope.row)">保存
          </el-button>
          <el-button v-else type="primary" size="mini"
    @click="startEdit(scope.row)">编辑
          </el-button>
          <el-button v-if="scope.row.edit" class="cancel-btn" size="mini" icon="el-icon-refresh"
    type="warning" @click="cancelEdit(scope.row)">取消
          </el-button>

          
          
        </template>
      </el-table-column>
    </el-table>
    </fieldset> 
    </el-col>
    <el-col :span="8">
       <fieldset style="border-Color: #eef1f6;border-width: 0.5px; text-align: left;  border-radius: 5px; font-size:12px; ">
       <legend>小课目</legend>
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.name" placeholder="名称"></el-input>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:dept:view" type="primary" @click="findTreeData(null)"/>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:dept:add" type="primary" @click="handleAdd"/>
			</el-form-item>
		</el-form>
	</div>
	<!--表格树内容栏-->
    <el-table :data="smallKemuTableData" stripe size="mini" style="width: 100%;"
      rowKey="id" v-loading="loading" element-loading-text="$t('action.loading')">
      <el-table-column
        prop="id" header-align="center" align="center" width="110" label="ID" v-if="false">
      </el-table-column>
      <table-tree-column 
        prop="name" header-align="center" treeKey="id" width="150" label="名称">
      </table-tree-column>
      <el-table-column
        fixed="right" header-align="center" align="center" width="185" :label="$t('action.operation')">
        <template slot-scope="scope">
          <kt-button icon="fa fa-edit" :label="$t('action.edit')" perms="sys:dept:edit" @click="handleEdit(scope.row)"/>
          <kt-button icon="fa fa-trash" :label="$t('action.delete')" perms="sys:dept:delete" type="danger" @click="handleDelete(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>
    </fieldset> 
    </el-col>
  </el-row>  

  </div>
</template>

<script>
import KtButton from "@/views/Core/KtButton"
import TableTreeColumn from '@/views/Core/TableTreeColumn'
import PopupTreeInput from "@/components/PopupTreeInput"
import FaIconTooltip from "@/components/FaIconTooltip"
import { format } from "@/utils/datetime"
export default {
	components:{
    PopupTreeInput,
    KtButton,
    TableTreeColumn,
    FaIconTooltip
	},
	data() {
		return {
			size: 'small',
			loading: false,
			filters: {
				name: ''
      },
      specialTableData: [],
      bigKemuTableData: [],
      smallKemuTableData: [],
      dialogVisible: false,
      dataForm: {
        id: 0,
        name: '',
        parentId: 0,
        parentName: '',
        orderNum: 0
      },
      dataRule: {
        name: [
          { required: true, message: '单位名称不能为空', trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: '上级单位不能为空', trigger: 'change' }
        ]
      },
      popupTreeData: [],
      popupTreeProps: {
				label: 'name',
				children: 'children'
			}
		}
	},
	methods: {
		// 获取数据
    findSpecialData: function () {
      this.loading = true
			this.$api.trainResource.findAllSpecial().then((res) => {
        res.data.forEach(element => {
          element['edit'] = false
          element['disabled'] = false
        })
        this.specialTableData = res.data
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
		// 显示新增界面
		handleAddSpecial: function () {
			let specialData = {
        id: 0,
        labelCn: '',
        parentId: 0,
        orderNum: 0,
        edit: true,
        disabled: false
      }
      this.specialTableData.unshift(specialData)
		},
		// 显示编辑界面
		startEdit: function (row) {
      //this.dialogVisible = true
      //Object.assign(this.dataForm, row);
      //<el-input v-model="scope.row.labelCn" :disabled="!scope.row.disabled"></el-input>
      row.edit = !row.edit
      row.disabled = true
    },
    
// 保存
confirmEdit: function (row) {
      row.edit = false;
      row.originalValue = row.address;
      if (row.tel == null || row.address == null) {
        this.loadAppConfigs();
        return;
      }
      let name= this.params.name;
      const p = {...row, name};

      // 调用更新方法
     // updateXXXXx(p);
      this.$message({
        message: '已修改!',
        type: 'success'
      });
      row.disabled = false;
      if (row.id === undefined) {
        // 重新加载该页面
      }
},

    // 取消
cancelEdit: function(row) {
      row.address = row.originalValue;
      row.edit = false;
      row.disabled = false;
      this.$message({
        message: '已取消修改!',
        type: 'warning'
      });
      if (row.id === undefined) {

        // 重新加载该页面
      }
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
    // 获取删除的包含子单位的id列表
    getDeleteIds (ids, row) {
      ids.push({id:row.id})
      if(row.children != null) {
        for(let i=0, len=row.children.length; i<len; i++) {
          this.getDeleteIds(ids, row.children[i])
        }
      }
      return ids
    },
      // 单位树选中
    handleTreeSelectChange (data, node) {
      this.dataForm.parentId = data.id
      this.dataForm.parentName = data.name
    },
    // 表单提交
    submitForm () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
						let params = Object.assign({}, this.dataForm)
						this.$api.dept.save(params).then((res) => {
              this.editLoading = false
              if(res.code == 200) {
								this.$message({ message: '操作成功', type: 'success' })
                this.dialogVisible = false
                this.$refs['dataForm'].resetFields()
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
							}
							this.findTreeData()
						})
					})
				}
      })
    },
		// 时间格式化
    dateFormat: function (row, column, cellValue, index){
      return format(row[column.property])
    }
    
	},
	mounted() {
    this.findSpecialData()
	}
}
</script>

<style scoped>
input[disabled], input:disabled, input.disabled {
    color: #000000;
    -webkit-text-fill-color: #000000;
    -webkit-opacity: 1;
    opacity: 1;
    font-weight: 900;
    
  }


</style>

<style>
 
input {
  height: 30px !important;
  line-height: 30px !important;
}

.el-table--mini td {
  padding: 3px 0 !important;
}
</style>