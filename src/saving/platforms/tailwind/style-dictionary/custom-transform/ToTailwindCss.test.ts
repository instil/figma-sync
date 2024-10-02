import * as target from "./ToTailwindCss";
import {removeWhitespace} from "@src/shared/stdlib/Strings";

it("should generate tailwind colour config", () => {
  const result = target.toTailwindCss({
    "Desktop/2XL/Regular": {
      family: {
        value: "comic sans",
        type: "typography"
      },
      weight: {
        value: 700,
        type: "typography"
      },
      size: {
        value: "24px",
        type: "typography"
      },
      lineheight: {
        value: "10px",
        type: "typography"
      },
      spacing: {
        value: "0px",
        type: "typography"
      }
    }
  });

  expect(removeWhitespace(result)).toBe(removeWhitespace(`
    @tailwind base;

    @layerbase {
      .font-Desktop2XLRegular {
        font-family: comicsans;
        line-height: 10px;
        font-size: 24px;
        letter-spacing: 0px;
        font-weight: 700;
      }
    }
  `));
});
