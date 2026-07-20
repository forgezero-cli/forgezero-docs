<template>
  <article class="doc-content">
    <header class="mb-8 border-b border-white/10 pb-6">
      <p
        class="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-zinc-400"
      >
        ForgeZero (fz)
      </p>
      <h1
        class="text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl"
      >
        {{ section.title }}
      </h1>
    </header>
    <DocRenderer :blocks="section.blocks" />

    <div class="mt-16 border-t border-white/[0.06] pt-6 text-right">
      <p class="text-[10px] uppercase tracking-[0.22em] text-white/[0.25]">
        Developed by AlexVoste for Engineers. Licensed under GPLv3.
      </p>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import DocRenderer from "@/components/DocRenderer.vue";
import { getSectionBySlug } from "@/composables/useSearch";

const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
});

const route = useRoute();

const section = computed(() => {
  const slug = props.slug || route.params.slug;
  return getSectionBySlug(slug) || { title: "Not Found", blocks: [] };
});
</script>
