import { ref } from 'vue'
import { getUserProfile } from '@/services/userService'
import { useRouter } from 'vue-router'

// Create refs for user state
const user = ref(null)
const loading = ref(false)
const error = ref(null)
const userStore = ref(null)

export function useUser() {
  const router = useRouter()

  const clearUserData = () => {
    user.value = null
    loading.value = false
    error.value = null
    userStore.value = null
    localStorage.removeItem('authToken')
  }

  const fetchUser = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await getUserProfile()
      user.value = response
      userStore.value = response.store
    } catch (err) {
      error.value = 'Failed to load user profile'
      console.error('Error fetching user:', err)
      if (err.message === 'Authentication expired' || err.message === 'No authentication token found') {
        clearUserData()
        router.push('/auth/login')
      }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    clearUserData()
    router.push('/auth/login')
  }

  return {
    user,
    loading,
    error,
    userStore,
    fetchUser,
    logout,
    clearUserData
  }
}