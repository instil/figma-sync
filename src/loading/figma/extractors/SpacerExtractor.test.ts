import * as target from "./SpacerExtractor";
import {logPercentage} from "./logging/PercentageLogger";
import type {FRAME} from "figma-api";
import {buildTestNode} from "@src/loading/figma/types/figma-api/testing/BuildTestNode";
import type {GetFileResult} from "figma-api/lib/api-types";
import {extractFrame} from "./figma-component-extractors/FrameExtractor";
import type {NodeWithChildren} from "./figma-component-extractors/children/types/NodeWithChildren";
import type {Node} from "figma-api/lib/ast-types";
import type {DesignTokenSpacers} from "@src/loading/figma/types/design-token/types/DesignTokenSpacers";
import {mockFunction} from "@src/shared/testing/jest/JestHelpers";

jest.mock("./figma-component-extractors/FrameExtractor");
jest.mock("./logging/PercentageLogger");

const extractFrameMock = mockFunction(extractFrame);
const logPercentageMock = mockFunction(logPercentage);

const pixelTextNode: Node = {
  ...buildTestNode("TEXT"),
  characters: "8px"
};
const pixelContentNode: Node = {
  ...buildTestNode("FRAME"),
  children: [pixelTextNode]
};
const pixelValueNode1: Node = {
  ...buildTestNode("FRAME"),
  name: "Documentation/Cell",
  children: [pixelContentNode]
};
const pixelValueNode2: Node = {
  ...buildTestNode("FRAME"),
  name: "Documentation/Cell",
  children: [pixelContentNode]
};
const pixelValueContainer: Node = {
  ...buildTestNode("FRAME"),
  children: [
    pixelValueNode1,
    pixelValueNode2
  ]
};
const nameTextNode: Node = {
  ...buildTestNode("TEXT"),
  characters: "spacers-2"
};
const nameContentNode: Node = {
  ...buildTestNode("FRAME"),
  children: [nameTextNode]
};
const nameNode1: Node = {
  ...buildTestNode("FRAME"),
  name: "Documentation/Cell",
  children: [nameContentNode]
};
const nameNode2: Node = {
  ...buildTestNode("FRAME"),
  name: "Documentation/Cell",
  children: [nameContentNode]
};
const nameContainer: Node = {
  ...buildTestNode("FRAME"),
  children: [
    nameNode1,
    nameNode2
  ]
};
const fontFrame: FRAME = {
  ...buildTestNode("FRAME"),
  children: [
    nameContainer,
    buildTestNode("BOOLEAN_OPERATION"),
    pixelValueContainer
  ]
} as FRAME;
const figmaGetFileResult: GetFileResult = {} as unknown as GetFileResult;

let result: ReturnType<typeof target.extractSpacers> | undefined;
let caughtError: unknown;

beforeEach(() => {
  extractFrameMock.mockReturnValue(fontFrame);

  result = undefined;
  caughtError = undefined;
});

describe("when extracting spacers successfully", () => {
  beforeEach(() => {
    try {
      result = target.extractSpacers(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should return spacer design token", () => {
    const expected: DesignTokenSpacers = {
      "spacers-2": {
        value: "8px",
        type: "spacers"
      }
    };
    expect(result).toEqual(expected);
  });

  it("should not throw an error", () => {
    expect(caughtError).toBeUndefined();
  });

  it("should log percentage", () => {
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "spacers",
      index: expect.anything(),
      length: 2
    });
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractFrame).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Spacing", frameName: "Table"});
  });
});

describe("when name container is missing", () => {
  beforeEach(() => {
    const updatedFontFrame = {
      ...fontFrame,
      children: [
        buildTestNode("BOOLEAN_OPERATION"),
        fontFrame.children[1],
        fontFrame.children[2]
      ]
    };
    extractFrameMock.mockReturnValue(updatedFontFrame);

    try {
      result = target.extractSpacers(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should not return spacer design token", () => {
    expect(result).toBeUndefined();
  });

  it("should throw an error", () => {
    expect(caughtError).toEqual(new Error("Spacing did not contain name container, is figma setup correctly?"));
  });

  it("should not log percentage", () => {
    expect(logPercentageMock).not.toHaveBeenCalled();
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractFrame).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Spacing", frameName: "Table"});
  });
});

describe("when pixel value container is missing", () => {
  beforeEach(() => {
    const updatedFontFrame = {
      ...fontFrame,
      children: [
        fontFrame.children[0],
        fontFrame.children[1],
        buildTestNode("BOOLEAN_OPERATION")
      ]
    };
    extractFrameMock.mockReturnValue(updatedFontFrame);

    try {
      result = target.extractSpacers(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should not return spacer design token", () => {
    expect(result).toBeUndefined();
  });

  it("should throw an error", () => {
    expect(caughtError).toEqual(new Error("Spacing did not contain pixel value container, is figma setup correctly?"));
  });

  it("should not log percentage", () => {
    expect(logPercentageMock).not.toHaveBeenCalled();
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractFrame).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Spacing", frameName: "Table"});
  });
});

describe("when name container and pixel value containers have mismatched number of children", () => {
  beforeEach(() => {
    const updatedFontFrame = {
      ...fontFrame,
      children: [
        {
          ...fontFrame.children[0],
          children: [
            ...(fontFrame.children[0] as NodeWithChildren).children,
            ...(fontFrame.children[0] as NodeWithChildren).children
          ]
        },
        fontFrame.children[1],
        fontFrame.children[2]
      ]
    };
    extractFrameMock.mockReturnValue(updatedFontFrame);

    try {
      result = target.extractSpacers(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should not return spacer design token", () => {
    expect(result).toBeUndefined();
  });

  it("should throw an error", () => {
    expect(caughtError).toEqual(new Error("Spacing page's number of spacing names do not match the number of pixel values, is figma setup correctly?"));
  });

  it("should not log percentage", () => {
    expect(logPercentageMock).not.toHaveBeenCalled();
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractFrame).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Spacing", frameName: "Table"});
  });
});

describe("when name content node is missing", () => {
  beforeEach(() => {
    const updatedFontFrame = {
      ...fontFrame,
      children: [
        {
          ...fontFrame.children[0],
          children: [
            {
              ...nameNode1,
              children: []
            },
            nameNode2
          ]
        },
        fontFrame.children[1],
        fontFrame.children[2]
      ]
    };
    extractFrameMock.mockReturnValue(updatedFontFrame);

    try {
      result = target.extractSpacers(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should not return spacer design token", () => {
    expect(result).toBeUndefined();
  });

  it("should throw an error", () => {
    expect(caughtError).toEqual(new Error("A spacing page's name node did not contain text container node, is figma setup correctly?"));
  });

  it("should not log percentage", () => {
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "spacers",
      index: expect.anything(),
      length: 2
    });
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractFrame).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Spacing", frameName: "Table"});
  });
});

describe("when name text node is missing", () => {
  beforeEach(() => {
    const updatedFontFrame = {
      ...fontFrame,
      children: [
        {
          ...fontFrame.children[0],
          children: [
            {
              ...nameNode1,
              children: [
                {
                  ...nameContentNode,
                  children: []
                }
              ]
            },
            nameNode2
          ]
        },
        fontFrame.children[1],
        fontFrame.children[2]
      ]
    };
    extractFrameMock.mockReturnValue(updatedFontFrame);

    try {
      result = target.extractSpacers(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should not return spacer design token", () => {
    expect(result).toBeUndefined();
  });

  it("should throw an error", () => {
    expect(caughtError).toEqual(new Error("A spacing page's name node did not contain text node, is figma setup correctly?"));
  });

  it("should not log percentage", () => {
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "spacers",
      index: expect.anything(),
      length: 2
    });
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractFrame).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Spacing", frameName: "Table"});
  });
});

describe("when pixel content node is missing", () => {
  beforeEach(() => {
    const updatedFontFrame = {
      ...fontFrame,
      children: [
        fontFrame.children[0],
        fontFrame.children[1],
        {
          ...fontFrame.children[2],
          children: [
            {
              ...pixelValueNode1,
              children: []
            },
            pixelValueNode2
          ]
        }
      ]
    };
    extractFrameMock.mockReturnValue(updatedFontFrame);

    try {
      result = target.extractSpacers(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should not return spacer design token", () => {
    expect(result).toBeUndefined();
  });

  it("should throw an error", () => {
    expect(caughtError).toEqual(new Error("A spacing page's pixel node did not contain text container node, is figma setup correctly?"));
  });

  it("should not log percentage", () => {
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "spacers",
      index: expect.anything(),
      length: 2
    });
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractFrame).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Spacing", frameName: "Table"});
  });
});

describe("when pixel text node is missing", () => {
  beforeEach(() => {
    const updatedFontFrame = {
      ...fontFrame,
      children: [
        fontFrame.children[0],
        fontFrame.children[1],
        {
          ...fontFrame.children[2],
          children: [
            {
              ...pixelValueNode1,
              children: [
                {
                  ...pixelContentNode,
                  children: []
                }
              ]
            },
            pixelValueNode2
          ]
        }
      ]
    };
    extractFrameMock.mockReturnValue(updatedFontFrame);

    try {
      result = target.extractSpacers(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should not return spacer design token", () => {
    expect(result).toBeUndefined();
  });

  it("should throw an error", () => {
    expect(caughtError).toEqual(new Error("A spacing page's pixel node did not contain text node, is figma setup correctly?"));
  });

  it("should not log percentage", () => {
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "spacers",
      index: expect.anything(),
      length: 2
    });
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractFrame).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Spacing", frameName: "Table"});
  });
});
