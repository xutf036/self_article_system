<script setup>
import { artAddChannelService, artEditChannelService } from '@/api/article'
import { ref } from 'vue'

const dialogVisible = ref(false)
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})
const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { pattern: /^\S{1,10}$/, message: '分类名称必须是 1-10 位非空字符', trigger: 'blur' }
  ],
  cate_alias: [
    { required: true, message: '请输入分类昵称', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类昵称必须是 1-15 位字母或数字', trigger: 'blur' }
  ]
}

// 向外暴露一个 open 方法，控制对话框的显示和隐藏
// 根据 open 方法传递过来的参数，来确定是 添加分类 / 编辑分类
// 因为 添加分类 不需要数据，所以传过来的是空数据
// 而   编辑分类 意味着要将之前的分类信息先回显，需要先将之前的分类信息传过来
const open = (row) => {
  dialogVisible.value = true
  formModel.value = row
  // console.log(formModel.value)
}

const formRef = ref()
const emit = defineEmits('success')
const onSubmit = async () => {
  // 发起请求之前先对表单数据进行预校验
  await formRef.value.validate()
  const isEdit = formModel.value.id
  if (isEdit) {
    // 编辑文章分类逻辑
    await artEditChannelService(formModel.value)
    ElMessage.success('文章分类更新成功！')
  } else {
    // 添加文章分类逻辑
    await artAddChannelService(formModel.value)
    ElMessage.success('文章分类添加成功！')
  }
  // 添加分类 / 编辑分类完成后关闭 dialog 对话框
  dialogVisible.value = false
  // 完成后告知父组件（文章分类页）重新渲染文章分类表格
  emit('success')
}

defineExpose({
  open
})
</script>
<template>
  <el-dialog v-model="dialogVisible" :title="formModel.id ? '编辑分类' : '添加分类'" width="30%">
    <el-form ref="formRef" :model="formModel" :rules="rules" style="padding-right: 30px" label-width="100px">
      <el-form-item label="分类名称" prop="cate_name">
        <el-input v-model="formModel.cate_name" placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input v-model="formModel.cate_alias" placeholder="请输入分类别名"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>
