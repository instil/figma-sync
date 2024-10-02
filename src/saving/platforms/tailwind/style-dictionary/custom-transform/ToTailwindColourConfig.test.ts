import * as target from "./ToTailwindColourConfig";
import {removeWhitespace} from "@src/shared/stdlib/Strings";

it("should generate tailwind colour config", () => {
  const result = target.toTailwindColourConfig({
    "Primary/Light/10": {
      value: "rgba(255, 0, 0, 1)",
      type: "color"
    },
    "Secondary/Light/20": {
      value: "rgba(0, 255, 0, 1)",
      type: "color"
    }
  });

  expect(removeWhitespace(result)).toBe(removeWhitespace(`
    export default {
      PrimaryLight10: {DEFAULT: "rgba(255, 0, 0, 1)"},
      SecondaryLight20: {DEFAULT: "rgba(0, 255, 0, 1)"},
    }
  `));
});
