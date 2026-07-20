import assert from "node:assert/strict";
import test from "node:test";

import { readMarkdownDocsIndex } from "./generate-content.mjs";

test("reads documentation entries from CONTENTS.md links", () => {
  const entries = readMarkdownDocsIndex();

  assert.ok(entries.includes("getting-started/quickstart.md"));
  assert.ok(entries.includes("cli/README.md"));
  assert.ok(entries.includes("configuration/README.md"));
});
