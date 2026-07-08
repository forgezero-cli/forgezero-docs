<template>
  <aside class="hidden xl:block fixed top-16 right-0 bottom-0 w-56 overflow-y-auto border-l border-border dark:border-slate-800 bg-surface dark:bg-slate-950 p-6">
    <p class="text-xs font-semibold uppercase tracking-wider text-ink-faint dark:text-slate-500 mb-4">
      On this page
    </p>
    <nav aria-label="Table of contents">
      <ul class="space-y-2">
        <li v-for="heading in headings" :key="heading.id">
          <a
            :href="`#${heading.id}`"
            class="block text-sm transition-colors"
            :class="[
              heading.level === 3 ? 'pl-3' : '',
              activeId === heading.id
                ? 'text-accent dark:text-blue-300 font-medium'
                : 'text-ink-muted dark:text-slate-400 hover:text-ink dark:hover:text-slate-200',
            ]"
            @click.prevent="scrollTo(heading.id)"
          >
            {{ heading.content }}
          </a>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

defineProps({
  headings: {
    type: Array,
    default: () => [],
  },
})

const activeId = ref('')

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    history.replaceState(null, '', `#${id}`)
    activeId.value = id
  }
}

function updateActiveHeading() {
  const headingEls = document.querySelectorAll('.doc-content [id]')
  let current = ''
  for (const el of headingEls) {
    const rect = el.getBoundingClientRect()
    if (rect.top <= 100) current = el.id
  }
  if (current) activeId.value = current
}

onMounted(() => {
  window.addEventListener('scroll', updateActiveHeading, { passive: true })
  updateActiveHeading()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveHeading)
})
</script>
