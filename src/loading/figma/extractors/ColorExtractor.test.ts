import * as target from "./ColorExtractor";
import type {GetFileResult} from "figma-api/lib/api-types";
import type {DesignTokenColors} from "@src/loading/figma/types/design-token/types/DesignTokenColors";
import {buildTestNode} from "@src/loading/figma/types/figma-api/testing/BuildTestNode";
import type {FRAME, RECTANGLE} from "figma-api";
import type {Node, Paint, StylesMap} from "figma-api/lib/ast-types";
import {extractFrame} from "./figma-component-extractors/FrameExtractor";
import {logPercentage} from "./logging/PercentageLogger";
import {mockFunction} from "@src/shared/testing/jest/JestHelpers";

jest.mock("./figma-component-extractors/FrameExtractor");
jest.mock("./logging/PercentageLogger");

const extractFrameMock = mockFunction(extractFrame);
const logPercentageMock = mockFunction(logPercentage);

const swatchRow1 = buildSwatchRow();
const swatchRow2 = buildSwatchRow();
const swatchRow3 = buildSwatchRow();
const frame: FRAME = {
  ...buildTestNode("FRAME"),
  children: [swatchRow1, swatchRow2, swatchRow3]
} as unknown as FRAME;
const figmaGetFileResult: GetFileResult = {
  styles: {
    "ascending-numbers-id": {
      key: "not needed",
      name: "test1",
      styleType: "FILL",
      description: "none"
    },
    "descending-numbers-id": {
      key: "not needed",
      name: "test2",
      styleType: "FILL",
      description: "none"
    }
  }
} as unknown as GetFileResult;

let result: ReturnType<typeof target.extractColors> | undefined;
let caughtError: unknown;

beforeEach(() => {
  extractFrameMock.mockReturnValue(frame);

  result = undefined;
  caughtError = undefined;
});

describe("when extracting color styles successfully", () => {
  beforeEach(() => {
    try {
      result = target.extractColors(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should return design token", () => {
    const expected: DesignTokenColors = {
      test1: {
        type: "color",
        value: "rgba(10, 20, 30, 40)"
      },
      test2: {
        type: "color",
        value: "rgba(40, 30, 20, 10)"
      }
    };
    expect(result).toEqual(expected);
  });

  it("should not throw error", () => {
    expect(caughtError).toBeUndefined();
  });

  it("should log percentage", () => {
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "styles",
      index: expect.anything(),
      length: 3
    });
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractFrameMock).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Colour", frameName: "System"});
  });
});

describe("when no swatch rows", () => {
  beforeEach(() => {
    extractFrameMock.mockReturnValue({
      ...frame,
      children: []
    });

    try {
      result = target.extractColors(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should return empty design token", () => {
    expect(result).toEqual({});
  });

  it("should not throw error", () => {
    expect(caughtError).toBeUndefined();
  });

  it("should not log percentage", () => {
    expect(logPercentageMock).not.toHaveBeenCalled();
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractFrameMock).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Colour", frameName: "System"});
  });
});

describe("when no rectangles containers in swatch row", () => {
  beforeEach(() => {
    const updatedFrame = {
      ...frame,
      children: [{
        ...swatchRow1,
        children: []
      }]
    } as unknown as FRAME;
    extractFrameMock.mockReturnValue(updatedFrame);

    try {
      result = target.extractColors(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should return empty design token", () => {
    expect(result).toEqual({});
  });

  it("should not throw error", () => {
    expect(caughtError).toBeUndefined();
  });

  it("should log percentage", () => {
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "styles",
      index: expect.anything(),
      length: 1
    });
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractFrameMock).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Colour", frameName: "System"});
  });
});

describe("when no rectangles in rectangle container", () => {
  beforeEach(() => {
    const updatedFrame = {
      ...frame,
      children: [{
        ...swatchRow1,
        children: [{
          ...buildTestNode("INSTANCE"),
          children: []
        }]
      }]
    } as unknown as FRAME;
    extractFrameMock.mockReturnValue(updatedFrame);

    try {
      result = target.extractColors(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should not return design token", () => {
    expect(result).toBeUndefined();
  });

  it("should throw error", () => {
    expect(caughtError).toEqual(new Error("Could not find 'RECTANGLE' containing color information, is figma setup correctly?"));
  });

  it("should log percentage", () => {
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "styles",
      index: expect.anything(),
      length: 1
    });
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractFrameMock).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Colour", frameName: "System"});
  });
});

describe("when rectangle does not have styles dictionary", () => {
  beforeEach(() => {
    const updatedFrame = {
      ...frame,
      children: [{
        ...swatchRow1,
        children: [{
          ...buildTestNode("INSTANCE"),
          children: [{
            ...buildColorRectangle("ASCENDING"),
            styles: undefined
          }]
        }]
      }]
    } as FRAME;
    extractFrameMock.mockReturnValue(updatedFrame);

    try {
      result = target.extractColors(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should not return design token", () => {
    expect(result).toBeUndefined();
  });

  it("should throw error", () => {
    expect(caughtError).toEqual(new Error("Did not have fill style on color rectangle, is figma setup correctly?"));
  });

  it("should log percentage", () => {
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "styles",
      index: expect.anything(),
      length: 1
    });
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractFrameMock).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Colour", frameName: "System"});
  });
});

describe("when no fill style id", () => {
  beforeEach(() => {
    const updatedFrame = {
      ...frame,
      children: [{
        ...swatchRow1,
        children: [{
          ...buildTestNode("INSTANCE"),
          children: [{
            ...buildColorRectangle("ASCENDING"),
            styles: {
              fill: undefined
            }
          }]
        }]
      }]
    } as unknown as FRAME;
    extractFrameMock.mockReturnValue(updatedFrame);

    try {
      result = target.extractColors(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should not return design token", () => {
    expect(result).toBeUndefined();
  });

  it("should throw error", () => {
    expect(caughtError).toEqual(new Error("Did not have fill style on color rectangle, is figma setup correctly?"));
  });

  it("should log percentage", () => {
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "styles",
      index: expect.anything(),
      length: 1
    });
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractFrameMock).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Colour", frameName: "System"});
  });
});

describe("when style id does not exist on file style dictionary", () => {
  const updatedFigmaGetFileResult: GetFileResult = {
    ...figmaGetFileResult,
    styles: {}
  };

  beforeEach(() => {
    try {
      result = target.extractColors(updatedFigmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should not return design token", () => {
    expect(result).toBeUndefined();
  });

  it("should throw error", () => {
    expect(caughtError).toEqual(new Error("Style with id of 'ascending-numbers-id' was not found, is figma setup correctly?"));
  });

  it("should log percentage", () => {
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "styles",
      index: expect.anything(),
      length: 3
    });
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractFrameMock).toHaveBeenCalledWith({figmaGetFileResult: updatedFigmaGetFileResult, pageName: "   ↳ Colour", frameName: "System"});
  });
});

describe("when rectangle does not have expected fill array is empty", () => {
  beforeEach(() => {
    const updatedFrame = {
      ...frame,
      children: [{
        ...swatchRow1,
        children: [{
          ...buildTestNode("INSTANCE"),
          children: [{
            ...buildColorRectangle("ASCENDING"),
            fills: []
          }]
        }]
      }]
    } as unknown as FRAME;
    extractFrameMock.mockReturnValue(updatedFrame);

    try {
      result = target.extractColors(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should not return design token", () => {
    expect(result).toBeUndefined();
  });

  it("should throw error", () => {
    expect(caughtError).toEqual(new Error("No fill color details found on color 'test1', is figma setup correctly?"));
  });

  it("should log percentage", () => {
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "styles",
      index: expect.anything(),
      length: 1
    });
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractFrameMock).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Colour", frameName: "System"});
  });
});

describe("when rectangle does not have expected fill details", () => {
  beforeEach(() => {
    const updatedFrame = {
      ...frame,
      children: [{
        ...swatchRow1,
        children: [{
          ...buildTestNode("INSTANCE"),
          children: [{
            ...buildColorRectangle("ASCENDING"),
            fills: [{
              color: undefined
            }]
          }]
        }]
      }]
    } as FRAME;
    extractFrameMock.mockReturnValue(updatedFrame);

    try {
      result = target.extractColors(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should not return design token", () => {
    expect(result).toBeUndefined();
  });

  it("should throw error", () => {
    expect(caughtError).toEqual(new Error("No fill color details found on color 'test1', is figma setup correctly?"));
  });

  it("should log percentage", () => {
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "styles",
      index: expect.anything(),
      length: 1
    });
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractFrameMock).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Colour", frameName: "System"});
  });
});

function buildSwatchRow(): FRAME {
  return {
    ...buildTestNode("FRAME"),
    children: [
      {
        ...buildTestNode("CANVAS"),
        children: [buildColorRectangle("ASCENDING")]
      },
      {
        ...buildTestNode("INSTANCE"),
        children: [buildColorRectangle("ASCENDING")]
      },
      {
        ...buildTestNode("COMPONENT"),
        children: [buildColorRectangle("DESCENDING")]
      }
    ]
  } as FRAME;
}

type ColorRectangleType = "ASCENDING" | "DESCENDING";

function buildColorRectangle(type: ColorRectangleType): Node {
  const styles: StylesMap = {
    fill: getFillId(type)
  } as unknown as StylesMap;

  const fills: Paint[] = [getPaintDetails(type)];

  const rectangle: RECTANGLE = {
    ...buildTestNode("RECTANGLE"),
    styles,
    fills
  } as RECTANGLE;

  return rectangle as Node;
}

function getFillId(type: ColorRectangleType): string {
  return type === "ASCENDING" ? "ascending-numbers-id" : "descending-numbers-id";
}

function getPaintDetails(type: ColorRectangleType): Paint {
  if (type === "ASCENDING") {
    return {
      color: {
        r: 0.039215686273,
        g: 0.07843137255,
        b: 0.1176470588,
        a: 0.1568627451
      }
    } as Paint;
  }

  return {
    color: {
      r: 0.1568627451,
      g: 0.1176470588,
      b: 0.07843137255,
      a: 0.039215686273
    }
  } as Paint;
}
