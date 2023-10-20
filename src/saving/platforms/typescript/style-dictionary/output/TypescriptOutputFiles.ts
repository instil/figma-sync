import type {File} from "style-dictionary/types/File";

export const typescriptOutputFiles: File[] = [
  {
    destination: "_colors.ts",
    format: "javascript/module",
    filter: {
      type: "color"
    }
  },
  {
    destination: "_typography.ts",
    format: "javascript/module",
    filter: {
      type: "typography"
    }
  }
];