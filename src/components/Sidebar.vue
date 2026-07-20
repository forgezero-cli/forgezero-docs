<template>
  <aside
    class="fixed inset-y-0 left-0 z-40 w-[18rem] border-r border-white/[0.05] bg-[#0B0B0C]/75 px-4 py-3 backdrop-blur-xl backdrop-saturate-150 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="premium-panel-soft flex h-full flex-col p-4">
      <div class="mb-5 border-b border-white/10 pb-4">
        <p class="chip">Navigation</p>
        <p class="mt-3 text-sm leading-7 text-zinc-400">
          Browse sections from the core language reference and architecture
          guide.
        </p>
      </div>

      <nav
        class="flex-1 space-y-6 overflow-y-auto pr-1"
        aria-label="Documentation navigation"
      >
        <div class="space-y-2">
          <h2
            class="px-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500"
          >
            Experience
          </h2>
          <ul class="space-y-1.5">
            <li>
              <RouterLink
                :to="{ name: 'terminal-view' }"
                class="block rounded-full px-3 py-2.5 text-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                :class="
                  activeView === 'terminal'
                    ? 'border border-white/[0.12] bg-white/[0.08] text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] backdrop-blur-md drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]'
                    : 'border border-transparent text-zinc-400 hover:-translate-y-0.5 hover:bg-white/[0.03] hover:text-white hover:backdrop-blur-md'
                "
                @click="$emit('close')"
              >
                ⚡️ Terminal
              </RouterLink>
            </li>
          </ul>
        </div>

        <div
          v-for="(group, groupIndex) in navigation"
          :key="groupIndex"
          class="space-y-2"
        >
          <h2
            class="px-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500"
          >
            {{ group.label }}
          </h2>
          <ul class="space-y-1.5">
            <li v-for="item in group.items" :key="item.slug">
              <RouterLink
                :to="{ name: 'doc-section', params: { slug: item.slug } }"
                class="block rounded-2xl px-3 py-2.5 text-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                :class="
                  item.slug === activeSlug
                    ? 'border-l-2 border-white/60 bg-white/[0.06] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_8px_32px_0_rgba(255,255,255,0.03)] backdrop-blur-md'
                    : 'border border-transparent text-zinc-400 hover:-translate-y-0.5 hover:bg-white/[0.03] hover:text-white hover:backdrop-blur-md'
                "
                @click="$emit('close')"
              >
                {{ formatTitle(item.title) }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </nav>

      <div class="mt-4 border-t border-white/10 pt-4">
        <p class="text-xs uppercase tracking-[0.3em] text-zinc-500">
          ForgeZero
        </p>
        <p class="mt-2 text-sm text-zinc-400">Documentation</p>
        <a
          href="https://github.com/forgezero-cli/ForgeZero"
          target="_blank"
          rel="noopener"
          class="mt-3 inline-flex text-sm text-zinc-200 hover:-translate-y-0.5 hover:text-white"
        >
          View repository →
        </a>
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
import { content } from "@/composables/useSearch";
import { RouterLink } from "vue-router";

defineProps({ open: Boolean, activeSlug: String, activeView: String });
defineEmits(["close"]);

const navigation = content.navigation;

function formatTitle(title) {
  return title.replace(/^\d+\.\s*/, "");
}
</script>
