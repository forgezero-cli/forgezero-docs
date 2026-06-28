<template>
  <aside
    class="fixed top-16 bottom-0 left-0 z-40 w-72 border-r border-border dark:border-slate-800 bg-surface dark:bg-slate-950 transform transition-transform duration-200 lg:translate-x-0 overflow-y-auto"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <nav class="p-4 space-y-6" aria-label="Documentation navigation">
      <div v-for="group in navigation" :key="group.label">
        <h2 class="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-ink-faint dark:text-slate-500">
          {{ group.label }}
        </h2>
        <ul class="space-y-0.5">
          <li v-for="item in group.items" :key="item.slug">
            <RouterLink
              :to="{ name: 'doc-section', params: { slug: item.slug } }"
              class="block px-3 py-2 text-sm rounded-lg transition-colors truncate"
              :class="item.slug === activeSlug
                ? 'bg-accent-muted dark:bg-blue-950 text-accent dark:text-blue-300 font-medium'
                : 'text-ink-muted dark:text-slate-400 hover:bg-surface-muted dark:hover:bg-slate-800 hover:text-ink dark:hover:text-slate-200'"
              @click="$emit('close')"
            >
              {{ formatTitle(item.title) }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </nav>
  </aside>

  <div
    v-if="open"
    class="fixed inset-0 z-30 bg-black/40 lg:hidden"
    @click="$emit('close')"
  />
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { content } from '@/composables/useSearch'

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
