import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/style.css"],
  // style.css bundles token @theme block for consumers who don't use @mediact/tailwind-preset

  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["react", "react-dom"],
  target: "es2022",
});
