<template>
  <header
    class="fixed inset-x-0 top-0 z-50 border-b border-white/[0.05] bg-[#0B0B0C]/75 backdrop-blur-md backdrop-saturate-150"
  >
    <div
      class="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
    >
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="rounded-full border border-white/[0.08] bg-[#0B0B0C]/80 p-2 text-zinc-300 backdrop-blur-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Toggle navigation menu"
          @click="$emit('toggle-sidebar')"
        >
          <svg
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <RouterLink
          to="/"
          class="flex items-center gap-3 rounded-full border border-white/[0.08] bg-[#0B0B0C]/80 px-3 py-2 text-sm text-zinc-100 backdrop-blur-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-white/10"
        >
          <div
            class="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold tracking-[0.3em] text-white"
          >
            FZ
          </div>
          <div class="hidden sm:block">
            <div class="font-medium">ForgeZero</div>
            <div class="text-[11px] uppercase tracking-[0.2em] text-zinc-400">
              Docs
            </div>
          </div>
        </RouterLink>
      </div>

      <div class="hidden flex-1 max-w-md md:block">
        <SearchInput />
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="rounded-full border border-white/[0.08] bg-[#0B0B0C]/80 p-2 text-zinc-300 backdrop-blur-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-white/10 hover:text-white md:hidden"
          aria-label="Open search"
          @click="showMobileSearch = true"
        >
          <svg
            class="h-5 w-5"
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
        </button>

        <ThemeToggle />

        <div class="group relative inline-flex items-center">
          <a
            href="https://coderlegion.com/user/alexvoste"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-full border border-white/[0.08] bg-[#0B0B0C]/80 p-2 text-white/[0.45] backdrop-blur-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:scale-[1.05] hover:bg-white/10 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
            aria-label="Open AlexVoste's CoderLegion journal"
            title="AlexVoste's blog"
          >
            <svg
              class="h-4.5 w-4.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7" />
              <path d="M7 3v18" />
              <path d="M10 7h4" />
              <path d="M10 11h4" />
              <path d="M10 15h2" />
            </svg>
          </a>

          <span
            class="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/[0.08] bg-[#0B0B0C]/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-zinc-300 opacity-0 backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100"
          >
            Dev Journal
          </span>
        </div>

        <a
          href="https://github.com/forgezero-cli/ForgeZero"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-full border border-white/[0.08] bg-[#0B0B0C]/80 p-2 text-zinc-300 backdrop-blur-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-white/10 hover:text-white"
          aria-label="View on GitHub"
          title="View on GitHub"
        >
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.395-.135-.345-.72-1.395-1.23-1.875-.42-.405-1.02-.705 0-.72 1.005-.015 1.62 1.23 1.845 1.74 1.065 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
            />
          </svg>
        </a>
      </div>
    </div>

    <transition
      enter-active-class="animate-fade-in"
      leave-active-class="animate-fade-in"
      :duration="150"
    >
      <div
        v-if="showMobileSearch"
        class="border-t border-white/10 bg-black/70 px-4 py-3 md:hidden"
      >
        <SearchInput mobile @close="showMobileSearch = false" />
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import SearchInput from "@/components/SearchInput.vue";
import ThemeToggle from "@/components/ThemeToggle.vue";

defineProps({ sidebarOpen: Boolean });
defineEmits(["toggle-sidebar"]);

const showMobileSearch = ref(false);
</script>
