import { ref, computed } from 'vue'
import Fuse from 'fuse.js'
import content from '@/data/content.json'

const fuse = new Fuse(content.searchIndex, {
  keys: ['title', 'text'],
  threshold: 0.35,
  includeScore: true,
  minMatchCharLength: 2,
})

export function useSearch() {
  const query = ref('')
  const isOpen = ref(false)

  const results = computed(() => {
    if (!query.value.trim()) return []
    return fuse.search(query.value.trim()).slice(0, 12).map((r) => r.item)
  })

  function openSearch() {
    isOpen.value = true
  }

  function closeSearch() {
    isOpen.value = false
    query.value = ''
  }

  return { query, results, isOpen, openSearch, closeSearch }
}

export function getSectionBySlug(slug) {
  return content.sections.find((s) => s.slug === slug)
}

export function getSectionHeadings(section) {
  return section.blocks.filter((b) => b.type === 'heading' && b.level >= 2 && b.level <= 3)
}

export { content }
