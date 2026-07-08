import content from '@/data/content.json'
import Fuse from 'fuse.js'
import { computed, ref } from 'vue'

const fuse = new Fuse(content.searchIndex, {
  keys: ['title', 'text'],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 1,
  ignoreLocation: true,
  distance: 100,
})

export function useSearch() {
  const query = ref('')
  const isOpen = ref(false)

  const results = computed(() => {
    if (!query.value.trim()) return []
    const trimmed = query.value.trim()
    return fuse.search(trimmed).slice(0, 15).map((r) => ({
      ...r.item,
      score: r.score,
    }))
  })

  function openSearch() {
    isOpen.value = true
  }

  function closeSearch() {
    isOpen.value = false
    query.value = ''
  }

  function clearQuery() {
    query.value = ''
  }

  return { query, results, isOpen, openSearch, closeSearch, clearQuery }
}

export function getSectionBySlug(slug) {
  return content.sections.find((s) => s.slug === slug)
}

export function getSectionHeadings(section) {
  return section.blocks.filter((b) => b.type === 'heading' && b.level >= 2 && b.level <= 3)
}

export function getAllSections() {
  return content.sections
}

export function buildSectionTree() {
  const sections = content.sections
  const tree = []
  
  for (const section of sections) {
    tree.push({
      id: section.id,
      title: section.title,
      slug: section.slug,
      level: 1,
    })
  }
  
  return tree
}

export { content }
