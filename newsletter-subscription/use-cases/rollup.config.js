import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

import visualizer from "rollup-plugin-visualizer";
import { terser } from "rollup-plugin-terser";

const extensions = [".js", ".ts"];

export default {
  input: ["./src/index.ts"],
  output: {
    dir: "dist",
    format: "cjs",
    preserveModules: true,
    preserveModulesRoot: "src",
    sourcemap: true,
    exports: "named",
  },
  plugins: [
    nodeResolve({
      browser: false,
    }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "dist",
    }),
    terser(),
    visualizer({
      filename: "bundle-analysis.html",
      open: false,
    }),
  ],
  external: ["jest", "jest-cli"],
};
