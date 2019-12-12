<template>
<el-upload
                name="file"
                class="upload-demo"
                style="display: inline"
                :headers="headers"
                :data="uploadParams"
                :action="uploadUrl"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :on-success="onSuccess"
                :on-error="onError"
              >
                <el-button
                  :disabled="!hasPerms(perms)"
                  :icon="icon"
                  :size="size"
                  :type="type"
                  :loading="loading"
                >上传</el-button>
              </el-upload>

</template>

<script>
import { hasPermission } from '@/permission/index.js'
import Cookies from "js-cookie";
export default {
  name: 'KtUploadButton',
  props: {
    icon: {  // 按钮显示图标
      type: String,
      default: 'el-icon-upload2'
    },
    size: {  // 按钮尺寸
      type: String,
      default: 'mini'
    },
    type: {  // 按钮类型
      type: String,
      default: null
    },
    loading: {  // 按钮加载标识
      type: Boolean,
      default: false
    },
    disabled: {  // 按钮是否禁用
      type: Boolean,
      default: false
    },
    perms: {  // 按钮权限标识，外部使用者传入
      type: String,
      default: null
    },
    uploadUrl: {
      type: String,
      default: null
    },
    uploadParams: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      headers: {
        token: Cookies.get("token")
      }
    }
  },
  methods: {
    handleClick: function () {
      // 按钮操作处理函数
      this.$emit('click', {})
    }, 
    hasPerms: function (perms) {
      // 根据权限标识和外部指示状态进行权限判断
      return hasPermission(perms) & !this.disabled
    },
    beforeUpload: function(file){
      this.$emit('before-upload', {})
    },
    onSuccess: function(){
      this.$emit('on-success', {})
    },
    onError: function(){
      this.$emit('on-error', {})
    }
    
  },
  mounted() {
  }
}
</script>

<style scoped>
  .el-button--mini {
    padding: 7px 5px !important;
  }
</style>