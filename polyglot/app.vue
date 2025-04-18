<template>
  <main>
    <div class="upload-card">
      <h1>🌍Polyglot</h1>
      <div class="upload-box" @dragover.prevent @drop.prevent="handleDrop">
        <input 
          type="file" 
          id="fileInput" 
          @change="handleFile"
          class="visually-hidden"
        >
        <label for="fileInput" class="upload-label">
          <span v-if="!file">点击选择文件 或拖放到此处</span>
          <span v-else>已选择文件: {{ file.name }}</span>
        </label>
      </div>
      
      <button 
        @click="submitFile" 
        :disabled="!file || isLoading"
        :class="{ loading: isLoading }"
      >
        {{ isLoading ? '验证中...' : '开始验证' }}
      </button>

      <div class="result" :class="{ success: isSuccess, error: isError }">
        {{ message }}
      </div>
    </div>
  </main>
</template>

<script setup>
const file = ref(null)
const message = ref('')
const isLoading = ref(false)
const isSuccess = ref(false)
const isError = ref(false)

const handleFile = (e) => {
  file.value = e.target.files[0]
}

const handleDrop = (e) => {
  file.value = e.dataTransfer.files[0]
}

const submitFile = async () => {
  if (!file.value) return
  
  isLoading.value = true
  isSuccess.value = false
  isError.value = false
  
  try {
    const formData = new FormData()
    formData.append('file', file.value)
    
    const { data } = await useFetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    message.value = data.value
    isSuccess.value = true
  } catch (err) {
    message.value = `错误: ${err.data?.message || '服务器异常'}`
    isError.value = true
  } finally {
    isLoading.value = false
  }
}
</script>

<style>
/* 基础重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

main {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #1a1a1a;
  font-family: system-ui, sans-serif;
  padding: 1rem;
}

.upload-card {
  background: #2d2d2d;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  width: 100%;
  max-width: 500px;
  color: #fff;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #00c8a3;
  font-size: 1.8rem;
}

.upload-box {
  border: 2px dashed #444;
  border-radius: 0.5rem;
  padding: 2rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.upload-box:hover {
  border-color: #00c8a3;
  background: rgba(0,200,163,0.05);
}

.upload-label {
  display: block;
  text-align: center;
  cursor: pointer;
  color: #888;
  transition: color 0.3s ease;
}

.upload-label:hover {
  color: #00c8a3;
}

button {
  width: 100%;
  padding: 1rem;
  background: #00c8a3;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: 
    background-color 0.3s ease,
    transform 0.2s ease;
}

button:hover:not(:disabled) {
  background: #00b393;
  transform: translateY(-2px);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.result {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  font-weight: 500;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

.result.success {
  background: rgba(0,200,163,0.15);
  color: #00c8a3;
  border: 1px solid #00c8a3;
}

.result.error {
  background: rgba(255,80,80,0.15);
  color: #ff5050;
  border: 1px solid #ff5050;
}

@keyframes fadeIn {
  to { opacity: 1; }
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  border: 0;
}

@media (max-width: 480px) {
  .upload-card {
    padding: 1.5rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
}
</style>
