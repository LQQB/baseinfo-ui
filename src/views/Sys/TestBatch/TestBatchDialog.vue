+<template>
    <!-- 新增修改界面 -->
    <el-dialog :title="!dataForm.id ? '新增' : '修改'"  width="40%" :visible.sync="dialogVisible" 
    :close-on-click-modal="false" @open="dialogOpened">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="submitForm()" 
        label-width="120px" :size="size" style="text-align:left;">
        <el-form-item label="ID" prop="id" v-if="false">
				   <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
			   </el-form-item>
         <el-form-item label="考试批次名称" prop="labelCn">
				   <el-input v-model="dataForm.labelCn" auto-complete="off"></el-input>
			   </el-form-item> 
          <el-form-item label="所属培训批次" prop="relatedTrainBatchId">
				   <el-select v-model="dataForm.relatedTrainBatchId" placeholder="请选择" style="width:300px">
							<el-option
                              v-for="item in trainBatchItemS"
                              :key="item.id"
                              :label="item.labelCn"
                              :value="item.id">
                            </el-option>
						</el-select>
			   </el-form-item> 
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :size="size"  @click="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size"  :loading="editLoading" type="primary" @click="submitForm()">{{$t('action.comfirm')}}</el-button>
      </span>
    </el-dialog>
</template>

<script>
import KtButton from "@/views/Core/KtButton"
export default {
  name: 'TestBatchDialog',
  components:{
      KtButton
	},
  props: {
    formData: {
      type: Object,
      default: function(){
        return {}
      }
    },
    size: { // 尺寸样式
      type: String,
      default: 'mini'
    },
  },

  data() {
    return {
      dialogVisible: false,
      trainBatchItemS: [],
      dataRule: {
        labelCn: [
          { required: true, message: '考试批次名称不能为空', trigger: 'blur' }
        ],
        relatedTrainBatchId: [
          { required: true, message: '所属培训批次不能为空', trigger: 'change' }
        ]
      },
      dataForm: this.formData,
      editLoading: false,  // 加载标识
    }
  },
  methods: {
    // 设置可见性
    setDialogVisible: function (visible) {
      this.dialogVisible = visible
    },
    dialogOpened: function(){
        this.$api.trainBatch.findAll().then((res) => {
				this.trainBatchItemS = res.data
			});
        },
        // 表单提交
    submitForm () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
            let params = Object.assign({}, this.dataForm)
			this.$api.testBatch.save(params).then((res) => {
             this.editLoading = false
             if(res.code == 200) {
				this.$message({ message: '操作成功', type: 'success' })
                this.$refs.dataForm.resetFields()
                this.$emit('submitForm', {})
			} else {
				this.$message({message: '操作失败, ' + res.msg, type: 'error'})
				}
			
			},(error) => {
              this.editLoading = false
              this.$message({message: '操作失败, ' + error, type: 'error'})
            })
					})
				}
      })
    },    

  },
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

</style