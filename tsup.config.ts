import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  // stories are excluded by entry; ensure they're not pulled in via re-exports either

  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["react", "react-dom"],
  target: "es2022",
});
