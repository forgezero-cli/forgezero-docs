<template>
  <div class="relative group rounded-xl overflow-hidden border border-border dark:border-slate-700 mb-6">
    <div class="flex items-center justify-between px-4 py-2 bg-slate-900 dark:bg-slate-950 border-b border-slate-700">
      <span class="text-xs font-mono text-slate-400 uppercase tracking-wide">{{ language }}</span>
      <button
        type="button"
        class="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        :aria-label="copied ? 'Copied' : 'Copy code'"
        @click="copyCode"
      >
        <svg v-if="!copied" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <svg v-else class="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        {{ copied ? 'Copied' : 'Copy' }}
      </button>
    </div>
    <pre class="overflow-x-auto p-4 bg-slate-900 dark:bg-slate-950 text-sm leading-relaxed"><code ref="codeRef" class="hljs font-mono" v-html="highlighted" /></pre>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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
import 'highlight.js/styles/github-dark.css'

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

async function copyCode() {
  await navigator.clipboard.writeText(props.content)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

onMounted(() => {
  if (codeRef.value) {
    hljs.highlightElement(codeRef.value)
  }
})
</script>
