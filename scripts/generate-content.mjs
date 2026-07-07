import { marked } from 'marked'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const readmePath = join(root, 'README.md')
const docsPath = join(root, 'docs')
const contentsPath = join(docsPath, 'CONTENTS')
const outputPath = join(root, 'src', 'data', 'content.json')


function slugify(text) {
  return text
    .replace(/^\d+\.\s*/, '')
    .replace(/[`'"]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function headingId(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

function detectAlertVariant(text) {
  const lower = text.toLowerCase()
  if (lower.startsWith('**warning:**') || lower.startsWith('warning:')) return 'warning'
  if (lower.startsWith('**note:**') || lower.startsWith('note:')) return 'note'
  if (lower.startsWith('**tip:**') || lower.startsWith('tip:')) return 'tip'
  if (lower.startsWith('**conclusion:**') || lower.startsWith('conclusion:')) return 'info'
  return 'note'
}

function stripAlertPrefix(text) {
  return text.replace(/^\*\*(Note|Warning|Tip|Conclusion):\*\*\s*/i, '').replace(/^(Note|Warning|Tip|Conclusion):\s*/i, '')
}

function blockquoteContent(tokens) {
  if (!tokens?.length) return ''
  return tokens
    .map((token) => {
      if (token.type === 'paragraph') return inlineTokensToHtml(token.tokens)
      if (token.type === 'text') return token.text
      return token.raw || ''
    })
    .join(' ')
}

function inlineTokensToHtml(tokens) {
  if (!tokens) return ''
  let html = ''
  for (const token of tokens) {
    switch (token.type) {
      case 'text':
        html += token.text
        break
      case 'strong':
        html += `<strong>${inlineTokensToHtml(token.tokens)}</strong>`
        break
      case 'em':
        html += `<em>${inlineTokensToHtml(token.tokens)}</em>`
        break
      case 'codespan':
        html += `<code class="inline-code">${token.text}</code>`
        break
      case 'link':
        html += `<a href="${token.href}"${token.title ? ` title="${token.title}"` : ''} class="doc-link">${inlineTokensToHtml(token.tokens)}</a>`
        break
      case 'del':
        html += `<del>${inlineTokensToHtml(token.tokens)}</del>`
        break
      case 'br':
        html += '<br />'
        break
      default:
        if (token.raw) html += token.raw
        else if (token.text) html += token.text
    }
  }
  return html
}

function tokenToBlocks(tokens) {
  const blocks = []
  for (const token of tokens) {
    switch (token.type) {
      case 'heading':
        blocks.push({
          type: 'heading',
          level: token.depth,
          content: token.text,
          id: headingId(token.text),
        })
        break
      case 'paragraph':
        blocks.push({
          type: 'paragraph',
          content: inlineTokensToHtml(token.tokens),
        })
        break
      case 'code':
        blocks.push({
          type: 'code',
          language: token.lang || 'text',
          content: token.text,
        })
        break
      case 'blockquote': {
        const raw = blockquoteContent(token.tokens)
        blocks.push({
          type: 'alert',
          variant: detectAlertVariant(token.text),
          content: stripAlertPrefix(raw),
        })
        break
      }
      case 'table':
        blocks.push({
          type: 'table',
          headers: token.header.map((cell) => inlineTokensToHtml(cell.tokens)),
          rows: token.rows.map((row) => row.map((cell) => inlineTokensToHtml(cell.tokens))),
        })
        break
      case 'list':
        blocks.push({
          type: 'list',
          ordered: token.ordered,
          items: token.items.map((item) => ({
            content: inlineTokensToHtml(item.tokens?.[0]?.tokens || []),
            nested: item.tokens?.slice(1) ? tokenToBlocks(item.tokens.slice(1)) : [],
          })),
        })
        break
      case 'hr':
        blocks.push({ type: 'hr' })
        break
      case 'html':
        if (token.block) {
          blocks.push({ type: 'html', content: token.text })
        }
        break
      case 'space':
        break
      default:
        if (token.raw?.trim()) {
          blocks.push({ type: 'paragraph', content: token.raw.trim() })
        }
    }
  }
  return blocks
}

function parseSectionContent(content) {
  const cleaned = content
    .replace(/^---\s*$/gm, '')
    .replace(/<div align="center">[\s\S]*?<\/div>/g, '')
    .replace(/<p align="center">[\s\S]*?<\/p>/g, '')
    .trim()
  if (!cleaned) return []
  return tokenToBlocks(marked.lexer(cleaned))
}

function extractSections(readme) {
  const sectionRegex = /^## (\d+\.\s*.+)$/gm
  const matches = [...readme.matchAll(sectionRegex)]
  const introEnd = matches[0]?.index ?? readme.length
  const introRaw = readme.slice(0, introEnd)
  const introContent = introRaw
    .replace(/^# ForgeZero.*$/m, '')
    .replace(/^## Table of Contents[\s\S]*?^---$/m, '')
    .trim()

  const sections = []

  if (introContent) {
    sections.push({
      id: 'introduction',
      number: 0,
      title: 'Introduction',
      slug: 'introduction',
      blocks: parseSectionContent(introContent),
    })
  }

  const usedSlugs = new Set(sections.map((s) => s.slug))

  for (let i = 0; i < matches.length; i++) {
    const title = matches[i][1]
    const start = matches[i].index + matches[i][0].length
    const end = i + 1 < matches.length ? matches[i + 1].index : readme.length
    const body = readme.slice(start, end).trim()
    const numberMatch = title.match(/^(\d+)\./)
    const number = numberMatch ? parseInt(numberMatch[1], 10) : i + 1

    let slug = slugify(title)
    if (usedSlugs.has(slug)) {
      slug = `${slug}-${number}`
    }
    usedSlugs.add(slug)

    sections.push({
      id: slug,
      number,
      title,
      slug,
      blocks: parseSectionContent(body),
    })
  }

  return sections
}

function buildSearchIndex(sections) {
  const index = []
  for (const section of sections) {
    index.push({
      id: section.id,
      title: section.title,
      slug: section.slug,
      type: 'section',
      text: section.title,
    })
    for (const block of section.blocks) {
      if (block.type === 'heading') {
        index.push({
          id: `${section.id}-${block.id}`,
          title: block.content,
          slug: section.slug,
          hash: block.id,
          type: 'heading',
          text: `${section.title} — ${block.content}`,
        })
      }
      if (block.type === 'paragraph') {
        const plain = block.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
        if (plain.length > 20) {
          index.push({
            id: `${section.id}-p-${index.length}`,
            title: section.title,
            slug: section.slug,
            type: 'content',
            text: plain.slice(0, 200),
          })
        }
      }
      if (block.type === 'code') {
        index.push({
          id: `${section.id}-code-${index.length}`,
          title: section.title,
          slug: section.slug,
          type: 'code',
          text: block.content.slice(0, 150),
        })
      }
    }
  }
  return index
}

function buildNavigation(sections) {
  const groupRanges = [
    { label: 'Getting Started', from: 0, to: 4 },
    { label: 'Core Usage', from: 5, to: 9 },
    { label: 'Languages', from: 10, to: 13 },
    { label: 'Advanced', from: 14, to: 21 },
    { label: 'Security & Tools', from: 22, to: 29 },
    { label: 'Reference', from: 30, to: 33 },
    { label: 'Architecture', from: 34, to: 39 },
    { label: 'Community', from: 40, to: 42 },
  ]

  const numbered = sections.filter((s) => s.number > 0)

  return groupRanges
    .map((group) => ({
      label: group.label,
      items: [
        ...(group.from === 0 ? [sections.find((s) => s.slug === 'introduction')].filter(Boolean) : []),
        ...numbered
          .filter((s) => s.number >= group.from && s.number <= group.to)
          .map((s) => ({ title: s.title, slug: s.slug, id: s.id })),
      ],
    }))
    .filter((g) => g.items.length > 0)
}

function readMarkdownDocsIndex() {
  const raw = readFileSync(contentsPath, 'utf-8')
  // Extract list of doc names/filenames under CONTENTS
  // Example lines:
  // INSTALL
  // CLI-REFERENCE
  // YOUTUBE.md
  const lines = raw.split(/\r?\n/)

  const start = Math.max(0, lines.findIndex((l) => l.trim() === '') )

  // Find the first line that looks like a doc entry (uppercase word or starts with YOUTUBE)
  // but only after we encounter the header block `CONTENTS` in the file.
  const headerIdx = lines.findIndex((l) => l.trim() === 'CONTENTS')
  const scanLines = headerIdx >= 0 ? lines.slice(headerIdx + 1) : lines

  const entries = []
  for (const l of scanLines) {
    const t = l.trim()
    if (!t) continue
    if (/^READING ORDER/i.test(t)) break
    if (/^[A-Z0-9][A-Z0-9 \-()]+$/i.test(t)) {
      entries.push(t)
    }
  }

  return entries
}

function extractSectionsFromDocs() {
  const docOrder = readMarkdownDocsIndex()

  // Build sections in the order defined by docs/CONTENTS.
  // Each doc file becomes one section with:
  // - slug: slugify(filenameWithoutExt)
  // - title: from the filename (or first H1 if present)
  const usedSlugs = new Set()
  const sections = []

  function uniqueSlug(base, fallbackNumber) {
    let slug = base
    if (!slug) slug = `section-${fallbackNumber}`
    if (usedSlugs.has(slug)) slug = `${slug}-${fallbackNumber}`
    usedSlugs.add(slug)
    return slug
  }

  // Map common docs to deterministic `number` ranges expected by buildNavigation.
  // If we can't infer, we default to sequential numbers.
  const numberByDocName = new Map([
    ['INSTALL', 3],
    ['CLI-REFERENCE', 7],
    ['WORKFLOW', 4],
    ['ARCHITECTURE', 18],
    ['LANGUAGES', 5],
    ['INTERNALS', 18],
    ['YOUTUBE.md', 42],
  ])

  for (let i = 0; i < docOrder.length; i++) {
    const entry = docOrder[i]
    const name = entry.replace(/\.md$/i, '')

    const possiblePaths = [
      join(docsPath, entry),
      join(docsPath, `${entry}.md`),
      join(docsPath, name),
      join(docsPath, `${name}.md`),
    ]

    let contentPath = null
    for (const p of possiblePaths) {
      try {
        readFileSync(p, 'utf-8')
        contentPath = p
        break
      } catch {
        // ignore
      }
    }
    if (!contentPath) continue

    const md = readFileSync(contentPath, 'utf-8')

    // Title: first level-1 header like `# something`
    const m = md.match(/^#\s+(.+)$/m)
    const title = m ? m[1].trim() : entry.replace(/\.[^.]+$/, '').trim()

    const baseSlug = slugify(title.replace(/^\d+\.[\s-]*/, '').trim())
    const number = numberByDocName.get(entry) ?? numberByDocName.get(name) ?? i + 1

    const slug = uniqueSlug(baseSlug || slugify(name), number)

    const blocks = parseSectionContent(md)

    sections.push({
      id: slug,
      number,
      title,
      slug,
      blocks,
    })
  }

  // Ensure we always have an introduction section for the routes.
  if (!sections.some((s) => s.slug === 'introduction')) {
    const introMd = readFileSync(join(root, 'README.md'), 'utf-8')
    const extracted = extractSections(introMd)
    const intro = extracted.find((s) => s.slug === 'introduction')
    if (intro) sections.unshift(intro)
  }

  return sections
}

const sections = extractSectionsFromDocs()

// Дополняем недостающие секции из README.md, чтобы документация была полной.
// docs/CONTENTS задаёт порядок и набор основных страниц, а README добивает пробелы.
const readme = readFileSync(readmePath, 'utf-8')
const readmeSections = extractSections(readme)

const existingSlugs = new Set(sections.map((s) => s.slug))
for (const s of readmeSections) {
  if (!existingSlugs.has(s.slug)) {
    sections.push(s)
    existingSlugs.add(s.slug)
  }
}

const navigation = buildNavigation(sections)
const searchIndex = buildSearchIndex(sections)

// If navigation logic didn't include an introduction, keep a safe fallback.
if (!navigation.some((g) => g.items?.some?.((it) => it.slug === 'introduction'))) {
  const intro = sections.find((s) => s.slug === 'introduction')
  if (intro) {
    const gettingStarted = navigation.find((g) => g.label === 'Getting Started')
    if (gettingStarted) {
      if (!gettingStarted.items.some((it) => it.slug === 'introduction')) {
        gettingStarted.items.unshift({ title: intro.title, slug: intro.slug, id: intro.id })
      }
    }
  }
}



const output = {
  meta: {
    title: 'ForgeZero Documentation',
    version: '5.1.0',
    description: 'Zero-overhead build tool for assembly, C, and Gloria',
  },
  sections,
  navigation,
  searchIndex,
}

mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(outputPath, JSON.stringify(output, null, 2))
console.log(`Generated ${sections.length} sections to ${outputPath}`)
