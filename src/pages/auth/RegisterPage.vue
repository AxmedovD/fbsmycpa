<template>
  <AuthLayout>
    <template #title>Create your account</template>
    
    <form class="space-y-6" @submit.prevent="handleSubmit">
      <div v-if="error" class="p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
        {{ error }}
      </div>

      <Input
        id="name"
        label="Full name"
        type="text"
        v-model="name"
        placeholder="Enter your full name"
        required
      />

      <Input
        id="email"
        label="Email address"
        type="email"
        v-model="email"
        placeholder="Enter your email"
        required
      />

      <Input
        id="store"
        label="Store name"
        type="text"
        v-model="store"
        placeholder="Enter your store name"
        required
      />

      <Input
        id="password"
        label="Password"
        type="password"
        v-model="password"
        placeholder="Create a password"
        required
      />

      <Input
        id="confirmPassword"
        label="Confirm password"
        type="password"
        v-model="confirmPassword"
        placeholder="Confirm your password"
        required
      />

      <Button variant="primary" class="w-full" :disabled="loading">
        {{ loading ? 'Creating account...' : 'Create account' }}
      </Button>

      <div class="text-sm text-center">
        <router-link to="/auth/login" class="font-medium text-blue-600 hover:text-blue-500">
          Already have an account? Sign in
        </router-link>
      </div>
    </form>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import { register } from '@/services/authService'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const store = ref('')
const error = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  try {
    // Basic validation
    if (password.value !== confirmPassword.value) {
      error.value = 'Passwords do not match'
      return
    }

    loading.value = true
    error.value = ''
    
    const response = await register(
      name.value,
      email.value,
      password.value,
      confirmPassword.value,
      store.value
    )
    
    // Store the token if returned from registration
    if (response.token) {
      localStorage.setItem('authToken', response.token)
    }
    
    // Redirect to login page or dashboard depending on your flow
    router.push('/auth/login')
  } catch (err) {
    error.value = err.message || 'Failed to register. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>