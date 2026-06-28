<template>
  <article class="doc-content">
    <header class="mb-8 pb-6 border-b border-border dark:border-slate-800">
      <p class="text-sm font-medium text-accent mb-2">ForgeZero (fz)</p>
      <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-ink dark:text-white">
        {{ section.title }}
      </h1>
    </header>
    <DocRenderer :blocks="section.blocks" />
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DocRenderer from '@/components/DocRenderer.vue'
import { getSectionBySlug } from '@/composables/useSearch'

const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
})

const route = useRoute()

const section = computed(() => {
  const slug = props.slug || route.params.slug
  return getSectionBySlug(slug) || { title: 'Not Found', blocks: [] }
})
</script>
