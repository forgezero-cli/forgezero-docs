<template>
  <div ref="containerRef" class="relative">
    <button
      type="button"
      class="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-border dark:border-slate-700 bg-surface-muted dark:bg-slate-900 text-ink-muted dark:text-slate-400 hover:border-border-strong transition-colors"
      @click="openSearch"
    >
      <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <span class="flex-1 text-left truncate">Search docs...</span>
      <kbd class="hidden sm:inline text-xs px-1.5 py-0.5 rounded bg-surface dark:bg-slate-800 border border-border dark:border-slate-700 font-mono">⌘K</kbd>
    </button>

    <Teleport to="body">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
        @keydown.escape="closeSearch"
      >
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="closeSearch" />
        <div class="relative w-full max-w-lg bg-surface dark:bg-slate-900 rounded-xl shadow-2xl border border-border dark:border-slate-700 overflow-hidden">
          <div class="flex items-center gap-3 px-4 border-b border-border dark:border-slate-700">
            <svg class="w-5 h-5 text-ink-faint shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref="inputRef"
              v-model="query"
              type="search"
              placeholder="Search documentation..."
              class="flex-1 py-4 bg-transparent text-ink dark:text-white placeholder:text-ink-faint outline-none"
              @keydown.down.prevent="moveSelection(1)"
              @keydown.up.prevent="moveSelection(-1)"
              @keydown.enter.prevent="selectResult(selectedIndex)"
            />
            <button
              type="button"
              class="text-xs text-ink-faint hover:text-ink-muted px-2 py-1 rounded border border-border dark:border-slate-700"
              @click="closeSearch"
            >
              ESC
            </button>
          </div>
          <ul v-if="results.length" class="max-h-80 overflow-y-auto py-2">
            <li v-for="(result, index) in results" :key="result.id">
              <button
                type="button"
                class="w-full px-4 py-2.5 text-left transition-colors"
                :class="index === selectedIndex ? 'bg-accent-muted dark:bg-blue-950' : 'hover:bg-surface-muted dark:hover:bg-slate-800'"
                @click="selectResult(index)"
                @mouseenter="selectedIndex = index"
              >
                <p class="text-sm font-medium text-ink dark:text-slate-200 truncate">
                  {{ result.title || result.text }}
                </p>
                <p v-if="result.text && result.title" class="text-xs text-ink-faint dark:text-slate-500 truncate mt-0.5">
                  {{ result.text }}
                </p>
              </button>
            </li>
          </ul>
          <p v-else-if="query.trim()" class="px-4 py-8 text-center text-sm text-ink-faint">
            No results found
          </p>
          <p v-else class="px-4 py-6 text-center text-sm text-ink-faint">
            Type to search across all documentation
          </p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useSearch } from '@/composables/useSearch'

const router = useRouter()
const { query, results, isOpen, openSearch, closeSearch } = useSearch()
const inputRef = ref(null)
const selectedIndex = ref(0)

watch(query, () => {
  selectedIndex.value = 0
})

watch(isOpen, async (open) => {
  if (open) {
    await nextTick()
    inputRef.value?.focus()
  }
})

function moveSelection(delta) {
  const max = results.value.length - 1
  selectedIndex.value = Math.max(0, Math.min(max, selectedIndex.value + delta))
}

function selectResult(index) {
  const result = results.value[index]
  if (!result) return
  closeSearch()
  router.push({
    name: 'doc-section',
    params: { slug: result.slug },
    hash: result.hash ? `#${result.hash}` : undefined,
  })
}

function handleGlobalKeydown(event) {
  if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
    event.preventDefault()
    openSearch()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>
