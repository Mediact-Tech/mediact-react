import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/style.css", "src/ai-chat/index.ts", "src/ai-chat/style.css"],
  // style.css bundles token @theme block for consumers who don't use @mediact/tailwind-preset
  //
  // ai-chat is a SEPARATE entry, deliberately not re-exported from src/index.ts: the widget pulls in
  // centrifuge/marked/dompurify, and an app that only uses buttons and tables should never carry that.
  // Reached as `@mediact/react/ai-chat` — the subpath is what keeps it out of everyone else's bundle.

  format: ["esm"],
  // dts must be told the TS entries explicitly: the CSS entries are also "root files" of the program,
  // and tsc refuses a .css root ("unsupported extension") the moment there is more than one of them.
  dts: { entry: ["src/index.ts", "src/ai-chat/index.ts"] },
  clean: true,
  sourcemap: true,
  external: ["react", "react-dom"],
  target: "es2022",
});
