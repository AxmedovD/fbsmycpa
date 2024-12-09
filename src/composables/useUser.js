import { ref, onMounted } from 'vue'
import { getUserProfile } from '@/services/userService'
import { useRouter } from 'vue-router'

const user = ref(null)
const loading = ref(true)
const error = ref(null)

export function useUser() {
  const router = useRouter()

  const fetchUser = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await getUserProfile()
      user.value = response
    } catch (err) {
      error.value = 'Failed to load user profile'
      console.error('Error fetching user:', err)
      if (err.message === 'Authentication expired' || err.message === 'No authentication token found') {
        router.push('/auth/login')
      }
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    if (!user.value) {
      fetchUser()
    }
  })

  return {
    user,
    loading,
    error,
    fetchUser
  }
}