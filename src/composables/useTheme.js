import { ref, watch, onMounted } from 'vue'

const STORAGE_KEY = 'forgedocs-theme'

export function useTheme() {
  const isDark = ref(false)

  function applyTheme(dark) {
    isDark.value = dark
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
  }

  function toggleTheme() {
    applyTheme(!isDark.value)
  }

  onMounted(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      applyTheme(stored === 'dark')
      return
    }
    applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches)
  })

  watch(isDark, (dark) => {
    document.documentElement.classList.toggle('dark', dark)
  })

  return { isDark, toggleTheme }
}
