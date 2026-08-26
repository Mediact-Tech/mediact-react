import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/style.css",
    "src/tokens.css",
    "src/theme/portal.css",
    "src/theme/mediwork.css",
    "src/theme/medimatch.css",
    "src/theme/medihr.css",
    "src/theme/medipay.css",
    "src/theme/medirefer.css",
    "src/theme/medioncloud.css",
    "src/ai-chat/index.ts",
    "src/ai-chat/style.css",
    "src/mui/index.ts",
  ],
  // style.css bundles token @theme block for consumers who don't use @mediact/tailwind-preset
  //
  // ai-chat is a SEPARATE entry, deliberately not re-exported from src/index.ts: the widget pulls in
  // centrifuge/marked/dompurify, and an app that only uses buttons and tables should never carry that.
  // Reached as `@mediact/react/ai-chat` — the subpath is what keeps it out of everyone else's bundle.
  //
  // mui is a separate entry for the same reason, in the other direction: it is the only thing in this
  // package aimed at an MUI app (mediact-web-backoffice). It imports zero React and zero MUI — just the
  // shared TYPE_SCALE reshaped into a `theme.typography` object — so a Tailwind consumer never pays for it.

  format: ["esm"],
  // dts must be told the TS entries explicitly: the CSS entries are also "root files" of the program,
  // and tsc refuses a .css root ("unsupported extension") the moment there is more than one of them.
  dts: { entry: ["src/index.ts", "src/ai-chat/index.ts", "src/mui/index.ts"] },
  clean: true,
  sourcemap: true,
  external: ["react", "react-dom"],
  target: "es2022",
});
