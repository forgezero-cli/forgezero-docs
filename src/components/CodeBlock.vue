<template>
  <div class="relative group rounded-md overflow-hidden border border-surface-200 dark:border-surface-700 mb-6 doc-code-block">
    <div class="flex items-center justify-between px-4 py-2 bg-surface-50 dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700">
      <span class="text-xs font-mono text-surface-600 dark:text-surface-400 uppercase tracking-widest font-semibold">{{ language }}</span>
      <button
        type="button"
        class="flex items-center gap-1.5 text-xs font-medium text-surface-600 dark:text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-200"
        :aria-label="copied ? 'Code copied!' : 'Copy code'"
        @click="copyCode"
      >
        <svg v-if="!copied" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <svg v-else class="w-4 h-4 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        {{ copied ? 'Copied!' : 'Copy' }}
      </button>
    </div>
    <pre class="overflow-x-auto p-4 bg-surface-50 dark:bg-surface-800 text-sm leading-relaxed text-surface-900 dark:text-surface-100"><code ref="codeRef" class="hljs font-mono" v-html="highlighted" /></pre>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTheme } from '@/composables/useTheme'
import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import c from 'highlight.js/lib/languages/c'
import cpp from 'highlight.js/lib/languages/cpp'
import go from 'highlight.js/lib/languages/go'
import json from 'highlight.js/lib/languages/json'
import makefile from 'highlight.js/lib/languages/makefile'
import objectivec from 'highlight.js/lib/languages/objectivec'
import plaintext from 'highlight.js/lib/languages/plaintext'
import shell from 'highlight.js/lib/languages/shell'
import wasm from 'highlight.js/lib/languages/wasm'
import yaml from 'highlight.js/lib/languages/yaml'
import 'highlight.js/styles/atom-one-light.css'

hljs.registerLanguage('bash', bash)
hljs.registerLanguage('sh', shell)
hljs.registerLanguage('shell', shell)
hljs.registerLanguage('c', c)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('go', go)
hljs.registerLanguage('json', json)
hljs.registerLanguage('makefile', makefile)
hljs.registerLanguage('objc', objectivec)
hljs.registerLanguage('objective-c', objectivec)
hljs.registerLanguage('plaintext', plaintext)
hljs.registerLanguage('text', plaintext)
hljs.registerLanguage('wasm', wasm)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('yml', yaml)
hljs.registerLanguage('toml', yaml)
hljs.registerLanguage('gloria', plaintext)
hljs.registerLanguage('asm', plaintext)
hljs.registerLanguage('nasm', plaintext)
hljs.registerLanguage('fasm', plaintext)

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: 'text',
  },
})

const { isDark } = useTheme()
const codeRef = ref(null)
const copied = ref(false)

const langMap = {
  '': 'text',
  console: 'bash',
  ini: 'yaml',
  conf: 'yaml',
  fz: 'yaml',
}

const resolvedLang = computed(() => langMap[props.language] || props.language || 'text')

const highlighted = computed(() => {
  const lang = resolvedLang.value
  if (hljs.getLanguage(lang)) {
    return hljs.highlight(props.content, { language: lang }).value
  }
  return hljs.highlightAuto(props.content).value
})

watch(isDark, () => {
  if (isDark.value) {
    document.querySelector('link[href*="atom-one-light"]')?.remove()
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/atom-one-dark.min.css'
    document.head.appendChild(link)
  } else {
    document.querySelector('link[href*="atom-one-dark"]')?.remove()
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/atom-one-light.min.css'
    document.head.appendChild(link)
  }
})

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.content)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

onMounted(() => {
  if (codeRef.value) {
    hljs.highlightElement(codeRef.value)
  }
})
</script>
