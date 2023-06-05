import type {File} from "style-dictionary/types/File";

export const iosOutputFiles: File[] = [
  {
    destination: "_colors.swift",
    format: "ios-swift/class.swift",
    filter: {
      type: "color"
    }
  },
  {
    destination: "_typography.swift",
    format: "ios-swift/class.swift",
    filter: {
      type: "typography"
    }
  }
];