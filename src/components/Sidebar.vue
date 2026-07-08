<template>
  <aside
    class="fixed top-16 bottom-0 left-0 z-40 w-72 border-r border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 transform transition-transform duration-200 lg:translate-x-0 overflow-y-auto"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <nav class="p-6 space-y-8" aria-label="Documentation navigation">
      <div v-for="(group, groupIndex) in navigation" :key="groupIndex" class="space-y-3">
        <h2 class="px-3 text-xs font-bold uppercase tracking-widest text-surface-600 dark:text-surface-400">
          {{ group.label }}
        </h2>
        <ul class="space-y-1.5">
          <li v-for="item in group.items" :key="item.slug">
            <RouterLink
              :to="{ name: 'doc-section', params: { slug: item.slug } }"
              class="block px-3 py-2 text-sm rounded-lg font-medium transition-all duration-150 truncate"
              :class="item.slug === activeSlug
                ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 shadow-sm'
                : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-brand-600 dark:hover:text-brand-400'"
              @click="$emit('close')"
            >
              {{ formatTitle(item.title) }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </nav>

    <div class="sticky bottom-0 p-6 border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50 backdrop-blur-sm">
      <div class="text-xs text-surface-600 dark:text-surface-400 space-y-1">
        <p class="font-semibold text-surface-900 dark:text-surface-100">ForgeZero</p>
        <p>Documentation</p>
        <p class="pt-2">
          <a href="https://github.com/forgezero-cli/ForgeZero" target="_blank" rel="noopener" class="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
            View on GitHub →
          </a>
        </p>
      </div>
    </div>
  </aside>

  <div
    v-if="open"
    class="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
    @click="$emit('close')"
  />
</template>

<script setup>
import { content } from '@/composables/useSearch'
import { RouterLink } from 'vue-router'

defineProps({
  open: Boolean,
  activeSlug: String,
})

defineEmits(['close'])

const navigation = content.navigation

function formatTitle(title) {
  return title.replace(/^\d+\.\s*/, '')
}
</script>
