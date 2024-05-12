import { userGetInfoService } from '@/api/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户模块
export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('')

    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }

    // 获取用户基本信息
    const user = ref({})

    const getUser = async () => {
      const res = await userGetInfoService()
      user.value = res.data.data
    }

    return {
      token,

      setToken,
      removeToken,

      user,
      getUser
    }
  },
  {
    persist: true
  }
)
