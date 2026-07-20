<template>
  <aside class="hidden xl:block w-56 shrink-0">
    <div
      class="sticky top-28 rounded-[22px] border border-white/[0.05] bg-[#0D0D0D]/60 p-4 backdrop-blur-md"
    >
      <p
        class="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500"
      >
        On this page
      </p>
      <nav aria-label="Table of contents" class="mt-4">
        <ul class="space-y-2">
          <li v-for="heading in headings" :key="heading.id">
            <a
              :href="`#${heading.id}`"
              class="block text-sm leading-6 transition-colors"
              :class="[
                heading.level === 3 ? 'pl-3' : '',
                activeId === heading.id
                  ? 'text-white'
                  : 'text-zinc-500 hover:text-zinc-200',
              ]"
              @click.prevent="scrollTo(heading.id)"
            >
              {{ heading.content }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";

defineProps({ headings: { type: Array, default: () => [] } });

const activeId = ref("");

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
    activeId.value = id;
  }
}

function updateActiveHeading() {
  const headingEls = document.querySelectorAll(".doc-content [id]");
  let current = "";
  for (const el of headingEls) {
    const rect = el.getBoundingClientRect();
    if (rect.top <= 100) current = el.id;
  }
  if (current) activeId.value = current;
}

onMounted(() => {
  window.addEventListener("scroll", updateActiveHeading, { passive: true });
  updateActiveHeading();
});

onUnmounted(() => window.removeEventListener("scroll", updateActiveHeading));
</script>
