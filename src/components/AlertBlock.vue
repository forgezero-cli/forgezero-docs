<template>
  <div class="alert" :class="variantClasses" role="note">
    <div class="flex items-start gap-3">
      <div class="mt-0.5 shrink-0">
        <svg
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            v-if="variant === 'warning'"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
          <path
            v-else-if="variant === 'tip'"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div class="text-sm leading-7 tracking-wide" v-html="content" />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: { type: String, default: "note" },
  content: { type: String, required: true },
});

const variantClasses = computed(
  () =>
    ({
      note: "border-white/[0.05] bg-[#0D0D0D]/60 text-zinc-200",
      warning: "border-amber-400/20 bg-amber-400/10 text-amber-100",
      tip: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
      info: "border-sky-400/20 bg-sky-400/10 text-sky-100",
    })[props.variant] || "border-white/[0.05] bg-[#0D0D0D]/60 text-zinc-200",
);
</script>
