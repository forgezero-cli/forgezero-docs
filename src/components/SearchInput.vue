<template>
  <div ref="containerRef" class="relative w-full">
    <button
      v-if="!mobile"
      type="button"
      class="w-full flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-surface-300 bg-surface-50 text-surface-600 hover:border-surface-400 dark:border-surface-600 dark:bg-surface-800 dark:text-surface-400 dark:hover:border-surface-500 transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-transparent"
      @click="openSearch"
    >
      <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <span class="flex-1 text-left truncate">Search docs...</span>
      <kbd class="hidden sm:inline text-xs px-2 py-1 rounded bg-surface-100 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 font-mono text-surface-500 dark:text-surface-400">⌘K</kbd>
    </button>

    <div v-if="mobile" class="flex items-center gap-2 px-0 py-0">
      <div class="flex-1 flex items-center gap-2 px-3 py-2 rounded-md border border-surface-300 bg-surface-50 dark:border-surface-600 dark:bg-surface-700">
        <svg class="w-4 h-4 shrink-0 text-surface-500 dark:text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref="inputRef"
          v-model="query"
          type="search"
          placeholder="Search..."
          class="flex-1 bg-transparent text-surface-900 dark:text-surface-100 placeholder:text-surface-500 dark:placeholder:text-surface-400 outline-none"
          @keydown.down.prevent="moveSelection(1)"
          @keydown.up.prevent="moveSelection(-1)"
          @keydown.enter.prevent="selectResult(selectedIndex)"
          @focus="showResults = true"
        />
        <button
          v-if="query"
          type="button"
          class="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 px-1"
          @click="query = ''"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <button
        type="button"
        class="text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-200 px-2"
        @click="$emit('close')"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <Teleport to="body">
      <div
        v-if="isOpen && !mobile"
        class="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4"
        @keydown.escape="closeSearch"
      >
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" @click="closeSearch" />
        <div class="relative w-full max-w-xl bg-white dark:bg-surface-800 rounded-xl shadow-lg border border-surface-200 dark:border-surface-700 overflow-hidden animate-slide-in">
          <div class="flex items-center gap-3 px-4 border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-700">
            <svg class="w-5 h-5 text-surface-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref="inputRef"
              v-model="query"
              type="search"
              placeholder="Search documentation..."
              class="flex-1 py-3 bg-transparent text-surface-900 dark:text-surface-50 placeholder:text-surface-500 dark:placeholder:text-surface-400 outline-none text-sm"
              @keydown.down.prevent="moveSelection(1)"
              @keydown.up.prevent="moveSelection(-1)"
              @keydown.enter.prevent="selectResult(selectedIndex)"
            />
            <button
              type="button"
              class="text-xs text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 px-2 py-1 rounded border border-surface-300 dark:border-surface-600 font-mono"
              @click="closeSearch"
            >
              ESC
            </button>
          </div>

          <div v-if="results.length || query.trim()" class="max-h-96 overflow-y-auto">
            <ul v-if="results.length" class="py-2">
              <li v-for="(result, index) in results" :key="result.id">
                <button
                  type="button"
                  class="w-full px-4 py-3 text-left transition-colors duration-150 hover:bg-surface-100 dark:hover:bg-surface-700"
                  :class="index === selectedIndex ? 'bg-brand-50 dark:bg-surface-700' : ''"
                  @click="selectResult(index)"
                  @mouseenter="selectedIndex = index"
                >
                  <div class="flex items-start gap-2">
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate">
                        {{ result.title || result.text }}
                      </p>
                      <p v-if="result.text && result.title" class="text-xs text-surface-600 dark:text-surface-400 truncate mt-1 line-clamp-1">
                        {{ result.text }}
                      </p>
                    </div>
                    <span v-if="result.type" class="badge badge-primary text-xs shrink-0">
                      {{ result.type }}
                    </span>
                  </div>
                </button>
              </li>
            </ul>
            <div v-else class="px-4 py-8 text-center">
              <p class="text-sm text-surface-500 dark:text-surface-400">
                No results found for "{{ query }}"
              </p>
            </div>
          </div>
          <div v-else class="px-4 py-12 text-center">
            <svg class="w-12 h-12 mx-auto mb-3 text-surface-300 dark:text-surface-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p class="text-sm text-surface-600 dark:text-surface-400">
              Start typing to search the documentation
            </p>
          </div>
        </div>
      </div>

      <transition v-if="mobile && showResults">
        <div v-if="(isOpen || showResults) && query.trim()" class="fixed inset-x-0 top-24 z-50 px-4 py-2">
          <div class="bg-white dark:bg-surface-800 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700 max-h-64 overflow-y-auto">
            <ul v-if="results.length">
              <li v-for="(result, index) in results" :key="result.id">
                <button
                  type="button"
                  class="w-full px-4 py-2.5 text-left hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors border-b border-surface-100 dark:border-surface-700 last:border-0"
                  @click="selectResult(index)"
                >
                  <p class="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
                    {{ result.title || result.text }}
                  </p>
                  <p v-if="result.text && result.title" class="text-xs text-surface-600 dark:text-surface-400 truncate mt-0.5">
                    {{ result.text }}
                  </p>
                </button>
              </li>
            </ul>
            <div v-else class="px-4 py-4 text-center text-sm text-surface-500 dark:text-surface-400">
              No results found
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useSearch } from '@/composables/useSearch'

defineProps({
  mobile: Boolean,
})

defineEmits(['close'])

const router = useRouter()
const { query, results, isOpen, openSearch, closeSearch } = useSearch()
const inputRef = ref(null)
const containerRef = ref(null)
const selectedIndex = ref(0)
const showResults = ref(false)

watch(query, () => {
  selectedIndex.value = 0
})

watch(isOpen, async (open) => {
  if (open) {
    await nextTick()
    inputRef.value?.focus()
  }
})

watch([query, results], () => {
  showResults.value = query.value.trim().length > 0
})

function moveSelection(delta) {
  const max = results.value.length - 1
  selectedIndex.value = Math.max(0, Math.min(max, selectedIndex.value + delta))
}

function selectResult(index) {
  const result = results.value[index]
  if (!result) return
  closeSearch()
  showResults.value = false
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

function handleClickOutside(event) {
  if (containerRef.value && !containerRef.value.contains(event.target)) {
    showResults.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
  document.removeEventListener('click', handleClickOutside)
})
</script>
