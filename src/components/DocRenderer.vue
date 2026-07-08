<template>
  <div>
    <template v-for="(block, index) in blocks" :key="index">
      <component
        :is="headingTag(block.level)"
        v-if="block.type === 'heading'"
        :id="block.id"
      >
        {{ block.content }}
      </component>

      <p v-else-if="block.type === 'paragraph'" v-html="block.content" />

      <CodeBlock
        v-else-if="block.type === 'code'"
        :content="block.content"
        :language="block.language"
      />

      <AlertBlock
        v-else-if="block.type === 'alert'"
        :variant="block.variant"
        :content="block.content"
      />

      <div v-else-if="block.type === 'table'" class="overflow-x-auto mb-6">
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

      <component
        :is="block.ordered ? 'ol' : 'ul'"
        v-else-if="block.type === 'list'"
      >
        <li v-for="(item, li) in block.items" :key="li">
          <span v-html="item.content" />
          <DocRenderer v-if="item.nested?.length" :blocks="item.nested" />
        </li>
      </component>

      <hr v-else-if="block.type === 'hr'" />

      <div
        v-else-if="block.type === 'html'"
        class="mb-4 prose-html"
        v-html="sanitizeHtml(block.content)"
      />
    </template>
  </div>
</template>

<script setup>
import AlertBlock from '@/components/AlertBlock.vue'
import CodeBlock from '@/components/CodeBlock.vue'

defineProps({
  blocks: {
    type: Array,
    default: () => [],
  },
})

function headingTag(level) {
  if (level <= 2) return 'h2'
  if (level === 3) return 'h3'
  return 'h4'
}

function sanitizeHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
}
</script>
