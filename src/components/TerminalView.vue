<template>
  <section
    class="glass-panel relative h-[620px] min-h-[620px] w-full overflow-hidden rounded-[28px] border border-white/[0.12] bg-[#050506]/70 shadow-[0_35px_80px_rgba(0,0,0,0.8)] backdrop-blur-3xl"
  >
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_45%)]"
    />

    <div class="relative flex h-full flex-col">
      <div
        class="border-b border-white/[0.08] bg-[#09090b]/70 px-4 py-3 sm:px-5"
      >
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <span
              class="h-3.5 w-3.5 rounded-full bg-[#ff5f56] transition hover:opacity-100"
            ></span>
            <span
              class="h-3.5 w-3.5 rounded-full bg-[#ffbd2e] transition hover:opacity-100"
            ></span>
            <span
              class="h-3.5 w-3.5 rounded-full bg-[#27c93f] transition hover:opacity-100"
            ></span>
          </div>

          <div
            class="rounded-full border border-white/[0.08] bg-[#0b0b0d]/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400"
          >
            alexvoste@archlinux: ~/projects/fz-redis (fz)
          </div>

          <button
            type="button"
            class="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-300 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.08] hover:text-white"
            @click="restart"
          >
            Re-run Build
          </button>
        </div>
      </div>

      <div
        class="flex-1 overflow-auto px-4 py-4 font-mono text-[13px] leading-6 text-zinc-300 sm:px-5 sm:py-5"
      >
        <div
          v-for="(line, index) in lines"
          :key="`${line.text}-${index}`"
          class="mb-1 flex gap-2"
        >
          <span class="shrink-0 text-zinc-600">$</span>
          <span
            :class="line.accent"
            class="whitespace-pre-wrap text-shadow-[0_0_12px_rgba(255,255,255,0.08)]"
            >{{ line.text }}</span
          >
        </div>

        <div class="mt-4 flex items-center gap-2 text-zinc-500">
          <span
            class="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(74,246,38,0.65)]"
          ></span>
          <span class="text-zinc-400">compiling</span>
          <span
            class="ml-1 h-2 w-2 animate-pulse rounded-full bg-white/70"
          ></span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";

const lines = ref([]);
let timeoutId = null;

const phaseOne = [
  "Cache hit for redis/src/anet.c",
  "Cache hit for redis/src/adlist.c",
  "Cache hit for redis/src/ae.c",
  "Cache hit for redis/src/command.c",
  "Cache hit for redis/src/db.c",
  "Cache hit for redis/src/dict.c",
  "Cache hit for redis/src/object.c",
  "Cache hit for redis/src/replication.c",
  "Cache hit for redis/src/scripting.c",
  "Cache hit for redis/src/t_string.c",
];

const phaseTwo = [
  "Appending 7 dependency archives: .fz_objs/deps/fpconv.a, .fz_objs/deps/hdr_histogram.a, .fz_objs/deps/hiredis.a, .fz_objs/deps/linenoise.a, .fz_objs/deps/lua.a, .fz_objs/deps/tre.a, redis/deps/xxhash/libxxhash.a",
  "Linking object files -> redis-server",
];

const phaseThree = [
  "Symbol cache hit for ./.fz_objs/acl_c.o",
  "Symbol cache hit for ./.fz_objs/acl_d.o",
  "Symbol cache hit for ./.fz_objs/anet.o",
  "Symbol cache hit for ./.fz_objs/command.o",
  "Symbol cache hit for ./.fz_objs/db.o",
  "Symbol cache hit for ./.fz_objs/evict.o",
  "Symbol cache hit for ./.fz_objs/expire.o",
  "Symbol cache hit for ./.fz_objs/replication.o",
];

const phaseFour = [
  "Archive library detected; falling back to single-stage link",
  "Running: gcc ./.fz_objs/acl_c.o ./.fz_objs/acl_d.o ./.fz_objs/anet.o ./.fz_objs/command.o ./.fz_objs/db.o ./.fz_objs/evict.o ./.fz_objs/expire.o ./.fz_objs/replication.o -o redis-server -fuse-ld=lld -fsanitize=address -fsanitize=undefined -l m -Wl,--build-id=none",
  "Removed object dir: ./.fz_objs",
  "Built: redis-server",
  "fz -dir redis/src -out redis-server -mode c -verbose  30.73s user 12.07s system 1118% cpu 3.826 total",
];

const sequence = [
  ...phaseOne.map((text) => ({
    text,
    accent: "text-emerald-400/90",
    delay: 12,
  })),
  { text: "", accent: "text-zinc-400", delay: 400 },
  ...phaseTwo.map((text) => ({
    text,
    accent: "text-amber-400/90",
    delay: text.includes("Appending") ? 20 : 24,
  })),
  { text: "", accent: "text-zinc-400", delay: 450 },
  ...phaseThree.map((text) => ({
    text,
    accent: "text-cyan-400/90",
    delay: 12,
  })),
  { text: "", accent: "text-zinc-400", delay: 350 },
  ...phaseFour.map((text, index) => ({
    text,
    accent:
      index === 1
        ? "text-zinc-100"
        : index === 4
          ? "text-violet-300/90"
          : index === 3
            ? "text-emerald-400/90"
            : "text-zinc-200",
    delay: index === 1 ? 16 : index === 4 ? 18 : 18,
  })),
];

function playSequence() {
  clearTimeout(timeoutId);
  lines.value = [];

  let index = 0;

  const tick = () => {
    if (index >= sequence.length) {
      return;
    }

    const item = sequence[index];
    if (item.text) {
      lines.value = [...lines.value, item];
    }

    index += 1;
    timeoutId = window.setTimeout(tick, item.delay);
  };

  tick();
}

function restart() {
  playSequence();
}

onMounted(() => {
  playSequence();
});

onUnmounted(() => {
  clearTimeout(timeoutId);
});
</script>
