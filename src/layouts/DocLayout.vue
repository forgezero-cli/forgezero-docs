<template>
  <div class="safe-area min-h-screen bg-transparent text-zinc-100">
    <Navbar
      :sidebar-open="sidebarOpen"
      @toggle-sidebar="sidebarOpen = !sidebarOpen"
    />
    <div class="flex min-h-screen flex-col pt-36 md:pt-40 lg:pt-44">
      <div
        class="mx-auto flex w-full max-w-7xl flex-1 gap-16 px-4 pb-16 pt-2 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24"
      >
        <Sidebar
          :open="sidebarOpen"
          :active-slug="activeSlug"
          :active-view="activeView"
          @close="sidebarOpen = false"
        />

        <div class="flex-1 min-w-0 lg:pl-72">
          <div
            class="mx-auto flex max-w-6xl flex-col xl:grid xl:grid-cols-[minmax(0,1fr)_14rem] xl:gap-16"
          >
            <main class="min-w-0">
              <div class="mx-auto max-w-3xl space-y-16 px-1 py-2 lg:px-4">
                <div class="hero-card overflow-hidden">
                  <div
                    class="absolute inset-0 z-0 bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(255,255,255,0.05)_0%,transparent_62%)]"
                  />
                  <div
                    class="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
                  >
                    <div class="max-w-2xl">
                      <p class="chip mb-4">ForgeZero / Documentation</p>
                      <h1
                        class="gradient-text text-4xl font-semibold tracking-[-0.035em] sm:text-5xl lg:text-[3.25rem]"
                      >
                        High-performance build documentation, designed to feel
                        effortless.
                      </h1>
                      <p
                        class="mt-4 max-w-xl text-sm leading-7 text-zinc-500 sm:text-base"
                      >
                        Explore the architecture, CLI, workflow, and internals
                        of the lightning-fast build system in a polished,
                        premium workspace.
                      </p>
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <span class="chip">Fast</span>
                      <span class="chip">Secure</span>
                      <span class="chip">Portable</span>
                    </div>
                  </div>
                </div>
                <div
                  v-if="activeSection.title"
                  class="relative mb-8 overflow-hidden rounded-[24px] border-t border-white/[0.15] border-x border-white/[0.05] border-b border-white/[0.02] bg-white/[0.03] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.3)] backdrop-blur-2xl md:p-8"
                >
                  <div
                    class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.03),transparent_50%)]"
                  />
                  <Transition name="section-header" mode="out-in">
                    <div
                      :key="activeSlug + activeView"
                      class="relative z-10 opacity-100 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    >
                      <p
                        class="mb-3 text-[11px] font-medium uppercase tracking-[0.32em] text-zinc-400"
                      >
                        Active section
                      </p>
                      <h2
                        class="bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-2xl font-semibold tracking-[-0.03em] text-transparent sm:text-3xl"
                      >
                        {{ activeSection.title }}
                      </h2>
                    </div>
                  </Transition>
                </div>
                <PremiumHeroExperience v-if="activeView !== 'terminal'" />
                <TerminalView v-if="activeView === 'terminal'" />
                <RouterView v-else />
              </div>
            </main>

            <TableOfContents v-if="headings.length" :headings="headings" />
          </div>
        </div>
      </div>
    </div>
    <ScrollToTop />
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import TableOfContents from "@/components/TableOfContents.vue";
import ScrollToTop from "@/components/ScrollToTop.vue";
import PremiumHeroExperience from "@/components/PremiumHeroExperience.vue";
import TerminalView from "@/components/TerminalView.vue";
import { getSectionBySlug, getSectionHeadings } from "@/composables/useSearch";

const route = useRoute();
const sidebarOpen = ref(false);
const activeSlug = computed(() => route.params.slug || "");
const activeView = computed(() =>
  route.name === "terminal-view" ? "terminal" : "docs",
);

const headings = computed(() => {
  if (activeView.value === "terminal") {
    return [];
  }

  const section = getSectionBySlug(activeSlug.value);
  return section ? getSectionHeadings(section) : [];
});

const activeSection = computed(() => {
  if (activeView.value === "terminal") {
    return { title: "Terminal" };
  }

  if (!activeSlug.value) {
    return { title: "Documentation" };
  }

  return getSectionBySlug(activeSlug.value) || { title: "Documentation" };
});

watch([() => route.params.slug, () => route.name], () => {
  sidebarOpen.value = false;
});

function updateSpotlight(event) {
  const hero = document.querySelector(".hero-card");
  if (!hero) return;
  const rect = hero.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  hero.style.setProperty("--mouse-x", `${x}%`);
  hero.style.setProperty("--mouse-y", `${y}%`);
}

onMounted(() => {
  window.addEventListener("mousemove", updateSpotlight);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", updateSpotlight);
});
</script>
