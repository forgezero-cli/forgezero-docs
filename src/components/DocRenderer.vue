<template>
  <div class="space-y-3">
    <template v-for="(block, index) in blocks" :key="index">
      <component :is="headingTag(block.level)" v-if="block.type === 'heading'" :id="block.id" class="doc-heading" :class="headingClasses(block.level)">
        {{ block.content }}
      </component>

      <p v-else-if="block.type === 'paragraph'" class="doc-p" v-html="block.content" />

      <CodeBlock v-else-if="block.type === 'code'" :content="block.content" :language="block.language" />

      <AlertBlock v-else-if="block.type === 'alert'" :variant="block.variant" :content="block.content" />

      <div v-else-if="block.type === 'table'" class="mb-6 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03] p-2">
        <table class="doc-table">
          <thead>
            <tr>
              <th v-for="(header, hi) in block.headers" :key="hi" v-html="header" />
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, ri) in block.rows" :key="ri">
              <td v-for="(cell, ci) in row" :key="ci" v-html="cell" />
            </tr>
          </tbody>
        </table>
      </div>

      <component :is="block.ordered ? 'ol' : 'ul'" v-else-if="block.type === 'list'" :class="block.ordered ? 'doc-ol' : 'doc-ul'">
        <li v-for="(item, li) in block.items" :key="li" class="doc-li">
          <span v-html="item.content" />
          <DocRenderer v-if="item.nested?.length" :blocks="item.nested" />
        </li>
      </component>

      <hr v-else-if="block.type === 'hr'" class="my-8 border-white/10" />

      <div v-else-if="block.type === 'html'" class="mb-4 prose-html" v-html="sanitizeHtml(block.content)" />
    </template>
  </div>
</template>

<script setup>
import AlertBlock from '@/components/AlertBlock.vue'
import CodeBlock from '@/components/CodeBlock.vue'

defineProps({ blocks: { type: Array, default: () => [] } })

function headingTag(level) {
  if (level <= 2) return 'h2'
  if (level === 3) return 'h3'
  return 'h4'
}

function headingClasses(level) {
  if (level <= 2) return 'doc-h2'
  if (level === 3) return 'doc-h3'
  return 'doc-h4'
}

function sanitizeHtml(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/on\w+="[^"]*"/gi, '')
}
</script>
