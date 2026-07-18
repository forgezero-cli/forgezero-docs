<template>
  <div class="min-h-screen flex flex-col bg-surface dark:bg-slate-950">
    <Navbar
      :sidebar-open="sidebarOpen"
      @toggle-sidebar="sidebarOpen = !sidebarOpen"
    />
    <div class="flex flex-1 pt-16">
      <Sidebar
        :open="sidebarOpen"
        :active-slug="activeSlug"
        @close="sidebarOpen = false"
      />
      <main class="flex-1 min-w-0 lg:pl-72 xl:pr-56">
        <div class="max-w-3xl mx-auto px-6 py-8 lg:px-10">
          <RouterView />
        </div>
      </main>
      <TableOfContents
        v-if="headings.length"
        :headings="headings"
      />
    </div>
    <ScrollToTop />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import TableOfContents from '@/components/TableOfContents.vue'
import ScrollToTop from '@/components/ScrollToTop.vue'
import { getSectionBySlug, getSectionHeadings } from '@/composables/useSearch'

const route = useRoute()
const sidebarOpen = ref(false)

const activeSlug = computed(() => route.params.slug || '')

const headings = computed(() => {
  const section = getSectionBySlug(activeSlug.value)
  return section ? getSectionHeadings(section) : []
})

watch(() => route.params.slug, () => {
  sidebarOpen.value = false
})
</script>
