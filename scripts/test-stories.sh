#!/usr/bin/env bash
# Run each *.stories.tsx file as a separate vitest invocation.
#
# Background: in our setup (Vitest 4 + @vitest/browser-playwright + Bun
# workspace), running all 29 story files as a single project deadlocks
# silently after ~30s — chromium spawns but never completes the run.
#
# Single-file invocations finish in ~1.6s each (8 stories → 1 file). Looping
# in shell is the workaround that keeps each browser session short-lived.

set -euo pipefail
cd "$(dirname "$0")/.."

passed=0
failed=0
failures=()

for f in $(find src -name "*.stories.tsx" | sort); do
  echo "── $f ──"
  if node node_modules/vitest/dist/cli.js run --project=storybook "$f"; then
    passed=$((passed + 1))
  else
    failed=$((failed + 1))
    failures+=("$f")
  fi
  echo
done

echo "═══ Summary ═══"
echo "Passed: $passed file(s)"
echo "Failed: $failed file(s)"
if [ ${#failures[@]} -gt 0 ]; then
  printf "  %s\n" "${failures[@]}"
  exit 1
fi
