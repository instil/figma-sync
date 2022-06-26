import * as target from "./FontExtractor";
import {extractFrame} from "./figma-component-extractors/FrameExtractor";
import type {FRAME} from "figma-api";
import {buildTestNode} from "@src/loading/figma/types/figma-api/testing/BuildTestNode";
import type {GetFileResult} from "figma-api/lib/api-types";
import type {DesignTokenFonts} from "@src/loading/figma/types/design-token/types/DesignTokenFonts";
import type {Node} from "figma-api/lib/ast-types";
import type {NodeWithChildren} from "./figma-component-extractors/children/types/NodeWithChildren";
import {logPercentage} from "./logging/PercentageLogger";
import {mockFunction} from "@src/shared/testing/jest/JestHelpers";

jest.mock("./figma-component-extractors/FrameExtractor");
jest.mock("./logging/PercentageLogger");

const extractFrameMock = mockFunction(extractFrame);
const logPercentageMock = mockFunction(logPercentage);

const desktopFrame: Node = {
  ...buildTestNode("FRAME"),
  name: "Desktop Type Stack",
  children: buildStackItems("DESKTOP")
};
const mobileFrame: Node = {
  ...buildTestNode("FRAME"),
  name: "Mobile Type Stack",
  children: buildStackItems("MOBILE")
};
const frame: FRAME = {
  ...buildTestNode("FRAME"),
  children: [
    desktopFrame,
    mobileFrame
  ]
} as unknown as FRAME;
const figmaGetFileResult: GetFileResult = {} as unknown as GetFileResult;

let result: ReturnType<typeof target.extractFonts> | undefined;
let caughtError: unknown;

beforeEach(() => {
  extractFrameMock.mockReturnValue(frame);

  result = undefined;
  caughtError = undefined;
});

describe("when extracting fonts successfully", () => {
  beforeEach(() => {
    try {
      result = target.extractFonts(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should return fonts design token", () => {
    const expected: DesignTokenFonts = {
      "Display 2XL/DESKTOP Regular": {
        family: {
          value: "Gotham SSm, GothamSSm-Book",
          type: "typography"
        },
        size: {
          value: "41px",
          type: "typography"
        },
        weight: {
          value: 400,
          type: "typography"
        },
        lineheight: {
          value: "40px",
          type: "typography"
        },
        spacing: {
          value: "0px",
          type: "typography"
        }
      },
      "Display 2XL/DESKTOP Medium": {
        family: {
          value: "Gotham SSm, GothamSSm-Bold",
          type: "typography"
        },
        size: {
          value: "41px",
          type: "typography"
        },
        weight: {
          value: 700,
          type: "typography"
        },
        lineheight: {
          value: "40px",
          type: "typography"
        },
        spacing: {
          value: "0px",
          type: "typography"
        }
      },
      "Display 2XL/MOBILE Regular": {
        family: {
          value: "Gotham SSm, GothamSSm-Book",
          type: "typography"
        },
        size: {
          value: "41px",
          type: "typography"
        },
        weight: {
          value: 400,
          type: "typography"
        },
        lineheight: {
          value: "40px",
          type: "typography"
        },
        spacing: {
          value: "0px",
          type: "typography"
        }
      },
      "Display 2XL/MOBILE Medium": {
        family: {
          value: "Gotham SSm, GothamSSm-Bold",
          type: "typography"
        },
        size: {
          value: "41px",
          type: "typography"
        },
        weight: {
          value: 700,
          type: "typography"
        },
        lineheight: {
          value: "40px",
          type: "typography"
        },
        spacing: {
          value: "0px",
          type: "typography"
        }
      }
    };
    expect(result).toEqual(expected);
  });

  it("should not throw an error", () => {
    expect(caughtError).toBeUndefined();
  });

  it("should log percentage", () => {
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "fonts",
      index: expect.anything(),
      length: 1
    });
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractFrame).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Typography", frameName: "Typography"});
  });
});

describe("when no desktop frame", () => {
  beforeEach(() => {
    const updatedFrame: FRAME = {
      ...frame,
      children: [mobileFrame]
    };
    extractFrameMock.mockReturnValue(updatedFrame);

    try {
      result = target.extractFonts(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should not return design token", () => {
    expect(result).toBeUndefined();
  });

  it("should throw an error", () => {
    expect(caughtError).toEqual(new Error("No desktop typography found, is figma setup correctly?"));
  });

  it("should not log percentage", () => {
    expect(logPercentageMock).not.toHaveBeenCalled();
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractFrame).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Typography", frameName: "Typography"});
  });
});

describe("when no mobile frame", () => {
  beforeEach(() => {
    const updatedFrame: FRAME = {
      ...frame,
      children: [desktopFrame]
    };
    extractFrameMock.mockReturnValue(updatedFrame);

    try {
      result = target.extractFonts(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should not return design token", () => {
    expect(result).toBeUndefined();
  });

  it("should throw an error", () => {
    expect(caughtError).toEqual(new Error("No mobile typography found, is figma setup correctly?"));
  });

  it("should log percentage", () => {
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "fonts",
      index: expect.anything(),
      length: 1
    });
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractFrame).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Typography", frameName: "Typography"});
  });
});

describe("when desktop frame does not contain any stack items", () => {
  beforeEach(() => {
    const updatedFrame: FRAME = {
      ...frame,
      children: [
        {
          ...desktopFrame,
          children: []
        },
        mobileFrame
      ]
    };
    extractFrameMock.mockReturnValue(updatedFrame);

    try {
      result = target.extractFonts(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should return fonts design token without any desktop fonts", () => {
    const expected: DesignTokenFonts = {
      "Display 2XL/MOBILE Regular": {
        family: {
          value: "Gotham SSm, GothamSSm-Book",
          type: "typography"
        },
        size: {
          value: "41px",
          type: "typography"
        },
        weight: {
          value: 400,
          type: "typography"
        },
        lineheight: {
          value: "40px",
          type: "typography"
        },
        spacing: {
          value: "0px",
          type: "typography"
        }
      },
      "Display 2XL/MOBILE Medium": {
        family: {
          value: "Gotham SSm, GothamSSm-Bold",
          type: "typography"
        },
        size: {
          value: "41px",
          type: "typography"
        },
        weight: {
          value: 700,
          type: "typography"
        },
        lineheight: {
          value: "40px",
          type: "typography"
        },
        spacing: {
          value: "0px",
          type: "typography"
        }
      }
    };
    expect(result).toEqual(expected);
  });

  it("should not throw an error", () => {
    expect(caughtError).toBeUndefined();
  });

  it("should log percentage", () => {
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "fonts",
      index: expect.anything(),
      length: 1
    });
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractFrame).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Typography", frameName: "Typography"});
  });
});

describe("when mobile frame does not contain any stack items", () => {
  beforeEach(() => {
    const updatedFrame: FRAME = {
      ...frame,
      children: [
        desktopFrame,
        {
          ...mobileFrame,
          children: []
        }
      ]
    };
    extractFrameMock.mockReturnValue(updatedFrame);

    try {
      result = target.extractFonts(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should return fonts design token without any mobile fonts", () => {
    const expected: DesignTokenFonts = {
      "Display 2XL/DESKTOP Regular": {
        family: {
          value: "Gotham SSm, GothamSSm-Book",
          type: "typography"
        },
        size: {
          value: "41px",
          type: "typography"
        },
        weight: {
          value: 400,
          type: "typography"
        },
        lineheight: {
          value: "40px",
          type: "typography"
        },
        spacing: {
          value: "0px",
          type: "typography"
        }
      },
      "Display 2XL/DESKTOP Medium": {
        family: {
          value: "Gotham SSm, GothamSSm-Bold",
          type: "typography"
        },
        size: {
          value: "41px",
          type: "typography"
        },
        weight: {
          value: 700,
          type: "typography"
        },
        lineheight: {
          value: "40px",
          type: "typography"
        },
        spacing: {
          value: "0px",
          type: "typography"
        }
      }
    };
    expect(result).toEqual(expected);
  });

  it("should not throw an error", () => {
    expect(caughtError).toBeUndefined();
  });

  it("should log percentage", () => {
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "fonts",
      index: expect.anything(),
      length: 1
    });
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractFrame).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Typography", frameName: "Typography"});
  });
});

describe("when both desktop and mobile frames do not contain any stack items", () => {
  beforeEach(() => {
    const updatedFrame: FRAME = {
      ...frame,
      children: [
        {
          ...desktopFrame,
          children: []
        },
        {
          ...mobileFrame,
          children: []
        }
      ]
    };
    extractFrameMock.mockReturnValue(updatedFrame);

    try {
      result = target.extractFonts(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should return empty design token", () => {
    const expected: DesignTokenFonts = {};
    expect(result).toEqual(expected);
  });

  it("should not throw an error", () => {
    expect(caughtError).toBeUndefined();
  });

  it("should not log percentage", () => {
    expect(logPercentageMock).not.toHaveBeenCalled();
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractFrame).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Typography", frameName: "Typography"});
  });
});

describe("when desktop stack does not contain header frame", () => {
  beforeEach(() => {
    const updatedFrame: FRAME = {
      ...frame,
      children: [
        {
          ...desktopFrame,
          children: [
            desktopFrame.children[1]
          ]
        },
        mobileFrame
      ]
    };
    extractFrameMock.mockReturnValue(updatedFrame);

    try {
      result = target.extractFonts(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should not return any design token", () => {
    expect(result).toBeUndefined();
  });

  it("should not throw an error", () => {
    expect(caughtError).toEqual(new Error("Could not find header frame that contains the environment type (e.g. 'Desktop' or 'Mobile')"));
  });

  it("should not log percentage", () => {
    expect(logPercentageMock).not.toHaveBeenCalled();
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractFrame).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Typography", frameName: "Typography"});
  });
});

describe("when desktop stack's header frame does not contain a text element", () => {
  beforeEach(() => {
    const updatedFrame: FRAME = {
      ...frame,
      children: [
        {
          ...desktopFrame,
          children: [
            {
              ...desktopFrame.children[0],
              children: []
            },
            desktopFrame.children[1]
          ]
        },
        mobileFrame
      ]
    };
    extractFrameMock.mockReturnValue(updatedFrame);

    try {
      result = target.extractFonts(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should not return any design token", () => {
    expect(result).toBeUndefined();
  });

  it("should not throw an error", () => {
    expect(caughtError).toEqual(new Error("Could not find text inside header frame that contains the environment type (e.g. 'Desktop' or 'Mobile')"));
  });

  it("should not log percentage", () => {
    expect(logPercentageMock).not.toHaveBeenCalled();
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractFrame).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Typography", frameName: "Typography"});
  });
});

describe("when desktop stack item does not contain a children container", () => {
  beforeEach(() => {
    const updatedFrame: FRAME = {
      ...frame,
      children: [
        {
          ...desktopFrame,
          children: [
            desktopFrame.children[0],
            {
              ...desktopFrame.children[1],
              children: []
            }
          ]
        },
        mobileFrame
      ]
    };
    extractFrameMock.mockReturnValue(updatedFrame);

    try {
      result = target.extractFonts(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should not return any design token", () => {
    expect(result).toBeUndefined();
  });

  it("should not throw an error", () => {
    expect(caughtError).toEqual(new Error("No stack item children container found for type stack, is figma setup correctly?"));
  });

  it("should log percentage", () => {
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "fonts",
      index: expect.anything(),
      length: 1
    });
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractFrame).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Typography", frameName: "Typography"});
  });
});

describe("when desktop stack item's children container does not contain a sample container", () => {
  beforeEach(() => {
    const updatedFrame: FRAME = {
      ...frame,
      children: [
        {
          ...desktopFrame,
          children: [
            desktopFrame.children[0],
            {
              ...desktopFrame.children[1],
              children: [{
                ...(desktopFrame.children[1] as NodeWithChildren).children[0],
                children: []
              }]
            }
          ]
        },
        mobileFrame
      ]
    };
    extractFrameMock.mockReturnValue(updatedFrame);

    try {
      result = target.extractFonts(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should not return any design token", () => {
    expect(result).toBeUndefined();
  });

  it("should not throw an error", () => {
    expect(caughtError).toEqual(new Error("No sample container found for type stack, is figma setup correctly?"));
  });

  it("should log percentage", () => {
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "fonts",
      index: expect.anything(),
      length: 1
    });
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractFrame).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Typography", frameName: "Typography"});
  });
});

describe("when desktop stack item's sample container does not contain any font specs", () => {
  beforeEach(() => {
    const updatedFrame: FRAME = {
      ...frame,
      children: [
        {
          ...desktopFrame,
          children: [
            desktopFrame.children[0],
            {
            ...desktopFrame.children[1],
            children: [{
              ...(desktopFrame.children[1] as NodeWithChildren).children[0],
              children: [{
                ...((desktopFrame.children[1] as NodeWithChildren).children[0] as NodeWithChildren).children[0],
                children: [buildTestNode("INSTANCE")]
              }]
            }
            ]
          }]
        },
        mobileFrame
      ]
    };
    extractFrameMock.mockReturnValue(updatedFrame);

    try {
      result = target.extractFonts(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should not return any design token", () => {
    expect(result).toBeUndefined();
  });

  it("should not throw an error", () => {
    expect(caughtError).toEqual(new Error("Font node was not of type text, is figma setup correctly?"));
  });

  it("should log percentage", () => {
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "fonts",
      index: expect.anything(),
      length: 1
    });
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractFrame).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Typography", frameName: "Typography"});
  });
});

function buildStackItems(type: "DESKTOP" | "MOBILE"): Node[] {
  const regularDisplay2Xl = {
    ...buildTestNode("TEXT"),
    name: "Regular",
    characters: "Display 2XL",
    style: {
      fontPostScriptName: "GothamSSm-Book",
      fontFamily: "Gotham SSm",
      lineHeightPx: 40,
      fontSize: 41,
      letterSpacing: 0,
      fontWeight: 400
    }
  } as unknown as Node;
  const mediumDisplay2Xl = {
    ...buildTestNode("TEXT"),
    name: "Medium",
    characters: "Display 2XL",
    style: {
      fontPostScriptName: "GothamSSm-Bold",
      fontFamily: "Gotham SSm",
      lineHeightPx: 40,
      fontSize: 41,
      letterSpacing: 0,
      fontWeight: 700
    }
  } as unknown as Node;

  const fontSpecs: Node[] = [
    regularDisplay2Xl,
    mediumDisplay2Xl
  ];

  const sampleContainer: Node = {
    ...buildTestNode("FRAME"),
    name: "Sample",
    children: fontSpecs
  };

  const childrenContainer: Node = {
    ...buildTestNode("FRAME"),
    children: [
      sampleContainer
    ]
  };

  return [
    {
      ...buildTestNode("FRAME"),
      children: [
        {
          ...buildTestNode("TEXT"),
          characters: type
        }
      ]
    },
    {
      ...buildTestNode("INSTANCE"),
      children: [childrenContainer]
    }
  ];
}
