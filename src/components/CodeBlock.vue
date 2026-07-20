<template>
  <div class="doc-code-block">
    <div class="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-2">
      <span class="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-400">{{ language }}</span>
      <button type="button" class="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300 transition-colors hover:text-white" :aria-label="copied ? 'Code copied!' : 'Copy code'" @click="copyCode">
        <span v-if="!copied">Copy</span>
        <span v-else>Copied</span>
      </button>
    </div>
    <pre class="overflow-x-auto bg-transparent p-4 text-sm leading-7 text-zinc-100"><code ref="codeRef" class="hljs font-mono" v-html="highlighted" /></pre>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
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
import 'highlight.js/styles/atom-one-dark.min.css'

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

const props = defineProps({ content: { type: String, required: true }, language: { type: String, default: 'text' } })
const { isDark } = useTheme()
const codeRef = ref(null)
const copied = ref(false)

const langMap = { '': 'text', console: 'bash', ini: 'yaml', conf: 'yaml', fz: 'yaml' }
const resolvedLang = computed(() => langMap[props.language] || props.language || 'text')

const highlighted = computed(() => {
  const lang = resolvedLang.value
  if (hljs.getLanguage(lang)) return hljs.highlight(props.content, { language: lang }).value
  return hljs.highlightAuto(props.content).value
})

watch(isDark, () => {
  document.querySelector('link[href*="atom-one-dark"]')?.remove()
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/atom-one-dark.min.css'
  document.head.appendChild(link)
})

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.content)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

onMounted(() => {
  if (codeRef.value) hljs.highlightElement(codeRef.value)
})
</script>
