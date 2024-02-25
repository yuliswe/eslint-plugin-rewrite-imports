import esbuild from "esbuild";

void esbuild.build({
  entryPoints: ["./src/plugin.ts"],
  bundle: true,
  minify: true,
  outdir: "./dist",
  platform: "node",
  format: "cjs",
  target: "node18",
});
