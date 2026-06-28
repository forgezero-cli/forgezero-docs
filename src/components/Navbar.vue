<template>
  <header class="fixed top-0 inset-x-0 z-50 h-16 border-b border-border dark:border-slate-800 bg-surface/90 dark:bg-slate-950/90 backdrop-blur-md">
    <div class="h-full px-4 sm:px-6 flex items-center gap-4">
      <button
        type="button"
        class="lg:hidden p-2 -ml-2 rounded-lg text-ink-muted hover:bg-surface-muted dark:hover:bg-slate-800 transition-colors"
        aria-label="Toggle navigation menu"
        @click="$emit('toggle-sidebar')"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <RouterLink to="/" class="flex items-center gap-2.5 shrink-0">
        <div class="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
          <span class="text-white font-bold text-sm font-mono">fz</span>
        </div>
        <span class="font-semibold text-ink dark:text-white hidden sm:block">ForgeZero</span>
      </RouterLink>

      <div class="flex-1 max-w-xl mx-auto">
        <SearchInput />
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <ThemeToggle />
        <a
          href="https://github.com/forgezero-cli/ForgeZero"
          target="_blank"
          rel="noopener noreferrer"
          class="p-2 rounded-lg text-ink-muted hover:bg-surface-muted dark:hover:bg-slate-800 transition-colors"
          aria-label="View on GitHub"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.395-.135-.345-.72-1.395-1.23-1.875-.42-.405-1.02-.705 0-.72 1.005-.015 1.62 1.23 1.845 1.74 1.065 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>
      </div>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import SearchInput from '@/components/SearchInput.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

defineProps({
  sidebarOpen: Boolean,
})

defineEmits(['toggle-sidebar'])
</script>
