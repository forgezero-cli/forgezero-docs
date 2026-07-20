<template>
  <div ref="containerRef" class="relative w-full">
    <button
      v-if="!mobile"
      type="button"
      class="flex w-full items-center gap-2 rounded-full border border-white/[0.08] bg-[#0B0B0C]/80 px-4 py-2.5 text-sm text-zinc-400 shadow-[0_8px_32px_0_rgba(255,255,255,0.03)] backdrop-blur-2xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:scale-[1.005] hover:border-white/10 hover:bg-[#0D0D0F]/90 hover:text-white"
      @click="openSearch"
    >
      <svg
        class="h-4 w-4 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <span class="flex-1 text-left">Search docs...</span>
      <kbd
        class="rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-[11px] text-zinc-500"
        >⌘K</kbd
      >
    </button>

    <div
      v-if="mobile"
      class="flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#0B0B0C]/80 px-3 py-2.5 shadow-[0_8px_32px_0_rgba(255,255,255,0.03)] backdrop-blur-2xl"
    >
      <svg
        class="h-4 w-4 shrink-0 text-zinc-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        ref="inputRef"
        v-model="query"
        type="search"
        placeholder="Search..."
        class="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
        @keydown.down.prevent="moveSelection(1)"
        @keydown.up.prevent="moveSelection(-1)"
        @keydown.enter.prevent="selectResult(selectedIndex)"
        @focus="showResults = true"
      />
      <button
        v-if="query"
        type="button"
        class="text-zinc-400 hover:text-white"
        @click="query = ''"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <Teleport to="body">
      <div
        v-if="isOpen && !mobile"
        class="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[20vh]"
        @keydown.escape="closeSearch"
      >
        <div
          class="fixed inset-0 bg-black/40 backdrop-blur-xl"
          @click="closeSearch"
        />
        <div
          class="relative w-full max-w-xl overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#0B0B0C]/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_8px_32px_0_rgba(255,255,255,0.03)] backdrop-blur-3xl"
        >
          <div
            class="flex items-center gap-3 border-b border-white/[0.06] bg-white/[0.03] px-4 py-3"
          >
            <svg
              class="h-5 w-5 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref="inputRef"
              v-model="query"
              type="search"
              placeholder="Search documentation..."
              class="flex-1 bg-transparent py-1 text-sm text-white outline-none placeholder:text-zinc-500"
              @keydown.down.prevent="moveSelection(1)"
              @keydown.up.prevent="moveSelection(-1)"
              @keydown.enter.prevent="selectResult(selectedIndex)"
            />
            <button
              type="button"
              class="rounded-full border border-white/[0.08] px-2 py-1 text-[11px] text-zinc-500"
              @click="closeSearch"
            >
              ESC
            </button>
          </div>

          <div
            v-if="results.length || query.trim()"
            class="max-h-96 overflow-y-auto"
          >
            <ul v-if="results.length" class="py-2">
              <li v-for="(result, index) in results" :key="result.id">
                <button
                  type="button"
                  class="relative w-full px-4 py-3 text-left transition-all duration-200 hover:bg-gradient-to-r hover:from-white/[0.05] hover:to-transparent"
                  :class="
                    index === selectedIndex
                      ? 'bg-gradient-to-r from-white/[0.05] to-transparent'
                      : ''
                  "
                  @click="selectResult(index)"
                  @mouseenter="selectedIndex = index"
                >
                  <div class="flex items-start gap-2">
                    <div
                      v-if="index === selectedIndex"
                      class="mt-1 h-5 w-[2px] rounded-full bg-white/70"
                    />
                    <div class="min-w-0 flex-1">
                      <p class="truncate text-sm font-medium text-white">
                        {{ result.title || result.text }}
                      </p>
                      <p
                        v-if="result.text && result.title"
                        class="mt-1 truncate text-xs text-zinc-500"
                      >
                        {{ result.text }}
                      </p>
                    </div>
                    <span
                      v-if="result.type"
                      class="rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-500"
                      >{{ result.type }}</span
                    >
                  </div>
                </button>
              </li>
            </ul>
            <div v-else class="px-4 py-8 text-center text-sm text-zinc-500">
              No results found for "{{ query }}"
            </div>
          </div>
          <div v-else class="px-4 py-12 text-center text-sm text-zinc-500">
            Start typing to search the documentation
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useSearch } from "@/composables/useSearch";

defineProps({ mobile: Boolean });
defineEmits(["close"]);

const router = useRouter();
const { query, results, isOpen, openSearch, closeSearch } = useSearch();
const inputRef = ref(null);
const containerRef = ref(null);
const selectedIndex = ref(0);
const showResults = ref(false);

watch(query, () => {
  selectedIndex.value = 0;
});
watch(isOpen, async (open) => {
  if (open) {
    await nextTick();
    inputRef.value?.focus();
  }
});
watch([query, results], () => {
  showResults.value = query.value.trim().length > 0;
});

function moveSelection(delta) {
  const max = results.value.length - 1;
  selectedIndex.value = Math.max(0, Math.min(max, selectedIndex.value + delta));
}

function selectResult(index) {
  const result = results.value[index];
  if (!result) return;
  closeSearch();
  showResults.value = false;
  router.push({
    name: "doc-section",
    params: { slug: result.slug },
    hash: result.hash ? `#${result.hash}` : undefined,
  });
}

function handleGlobalKeydown(event) {
  if ((event.metaKey || event.ctrlKey) && event.key === "k") {
    event.preventDefault();
    openSearch();
  }
}

function handleClickOutside(event) {
  if (containerRef.value && !containerRef.value.contains(event.target)) {
    showResults.value = false;
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleGlobalKeydown);
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleGlobalKeydown);
  document.removeEventListener("click", handleClickOutside);
});
</script>
