<template>
  <section class="space-y-8">
    <div class="flex flex-wrap items-center gap-2">
      <span class="micro-sticker">Suckless</span>
      <span class="micro-sticker">TinyCC</span>
      <span class="micro-sticker">Linux-first</span>
      <span class="micro-sticker">C99</span>
    </div>

    <div class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div class="grid gap-6 sm:grid-cols-2">
        <article
          v-for="(card, index) in cards"
          :key="card.title"
          class="glass-card group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:border-white/20"
          :class="[card.className, index === 1 ? 'sm:row-span-2' : '']"
        >
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_65%)] opacity-80"
          />
          <div class="relative space-y-3">
            <p
              class="text-[10px] font-semibold uppercase tracking-[0.32em] text-zinc-500"
            >
              {{ card.kicker }}
            </p>
            <h3 class="text-lg font-semibold tracking-[-0.02em] text-white">
              {{ card.title }}
            </h3>
            <p class="text-sm leading-7 text-zinc-500">
              {{ card.description }}
            </p>
          </div>
        </article>
      </div>

      <div class="glass-card overflow-hidden p-5 backdrop-blur-xl">
        <div class="mb-3 flex items-center gap-2">
          <span class="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span class="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span class="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>

        <div
          class="rounded-[20px] border border-white/[0.04] bg-[#040405]/90 p-5 font-mono text-sm text-zinc-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)]"
        >
          <div
            class="mb-3 flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-zinc-500"
          >
            <span>forgezero build</span>
            <span>live</span>
          </div>
          <p class="mb-3 whitespace-pre-wrap text-zinc-300">
            {{ typedCommand }}<span class="ml-1 animate-pulse">▍</span>
          </p>
          <div class="space-y-1.5 text-sm">
            <p
              v-for="(line, index) in typedLines"
              :key="index"
              :class="line.highlight ? 'text-emerald-300' : 'text-zinc-500'"
            >
              {{ line.text }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";

const typedCommand = ref("");
const typedLines = ref([]);
let timer = null;
let lineTimer = null;

const cards = [
  {
    kicker: "Performance",
    title: "Zero-Overhead",
    description:
      "Low-level paths stay hot, simple, and predictable so the compiler pipeline remains blisteringly fast.",
    className: "sm:col-span-2",
  },
  {
    kicker: "Tooling",
    title: "FZPP Preprocessor",
    description:
      "A sharper, purpose-built preprocessing layer that keeps the build graph clean and auditable.",
    className: "",
  },
  {
    kicker: "Platform",
    title: "Linux-First Architecture",
    description:
      "Designed for modern Unix workflows with first-class support for performance-critical systems.",
    className: "",
  },
  {
    kicker: "Flexibility",
    title: "Custom Toolchains",
    description:
      "Swap compilers, linkers, and targets without losing the elegance of the core build model.",
    className: "sm:col-span-2",
  },
];

function typeSequence() {
  const command = "$ fz -dir redis/src -mode c -toolchain gcc";
  const lines = [
    {
      text: "[warn::JEMALLOC] Dependency disabled in fz.toml",
      highlight: false,
    },
    { text: "Built: redis-server", highlight: false },
    { text: "ForgeZero took 3s", highlight: true },
  ];

  let index = 0;
  const step = () => {
    if (index < command.length) {
      typedCommand.value = command.slice(0, index + 1);
      index += 1;
      timer = window.setTimeout(step, 24);
      return;
    }

    const renderLine = (lineIndex) => {
      if (lineIndex >= lines.length) return;
      typedLines.value.push(lines[lineIndex]);
      lineTimer = window.setTimeout(() => renderLine(lineIndex + 1), 420);
    };

    renderLine(0);
  };

  step();
}

onMounted(() => {
  typeSequence();
});

onUnmounted(() => {
  if (timer) window.clearTimeout(timer);
  if (lineTimer) window.clearTimeout(lineTimer);
});
</script>
