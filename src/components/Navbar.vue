<template>
  <header class="fixed top-0 inset-x-0 z-50 h-14 border-b border-surface-200 dark:border-surface-700 bg-white/90 dark:bg-surface-900/90 backdrop-blur-sm">
    <div class="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 max-w-7xl mx-auto">
      <div class="flex items-center gap-4">
        <button
          type="button"
          class="lg:hidden p-2 -ml-2 rounded-lg text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-200"
          aria-label="Toggle navigation menu"
          @click="$emit('toggle-sidebar')"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <RouterLink to="/" class="flex items-center gap-2.5 shrink-0 group">
          <div class="w-8 h-8 rounded-md bg-brand-600 flex items-center justify-center transition-colors">
            <span class="text-white font-semibold text-sm font-mono">FZ</span>
          </div>
          <div class="hidden sm:flex flex-col">
            <span class="font-medium text-surface-900 dark:text-surface-50 leading-4">ForgeZero</span>
            <span class="text-xs text-surface-600 dark:text-surface-400 font-medium">Documentation</span>
          </div>
        </RouterLink>
      </div>

      <div class="hidden md:flex flex-1 max-w-md mx-4">
        <SearchInput />
      </div>

      <div class="flex items-center gap-1 shrink-0">
        <button
          type="button"
          class="md:hidden p-2 rounded-lg text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          aria-label="Open search"
          @click="showMobileSearch = true"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        <ThemeToggle />

        <a
          href="https://github.com/forgezero-cli/ForgeZero"
          target="_blank"
          rel="noopener noreferrer"
          class="p-2 rounded-lg text-surface-600 hover:text-brand-600 hover:bg-surface-100 dark:hover:bg-surface-800 dark:text-surface-400 dark:hover:text-brand-400 transition-colors duration-200"
          aria-label="View on GitHub"
          title="View on GitHub"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.395-.135-.345-.72-1.395-1.23-1.875-.42-.405-1.02-.705 0-.72 1.005-.015 1.62 1.23 1.845 1.74 1.065 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>
      </div>
    </div>

    <transition
      enter-active-class="animate-fade-in"
      leave-active-class="animate-fade-in"
      :duration="150"
    >
      <div v-if="showMobileSearch" class="md:hidden border-t border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-3">
        <SearchInput mobile @close="showMobileSearch = false" />
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import SearchInput from '@/components/SearchInput.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

defineProps({
  sidebarOpen: Boolean,
})

defineEmits(['toggle-sidebar'])

const showMobileSearch = ref(false)
</script>
