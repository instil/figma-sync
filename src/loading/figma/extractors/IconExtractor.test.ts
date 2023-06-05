import * as target from "./IconExtractor";
import type {Node} from "figma-api/lib/ast-types";
import {buildTestNode} from "@src/loading/figma/types/figma-api/testing/BuildTestNode";
import type {GetFileResult} from "figma-api/lib/api-types";
import {extractPage} from "./figma-component-extractors/PageExtractor";
import type {SvgDictionary} from "@src/shared/types/design-token/SvgDictionary";
import {logPercentage} from "@src/shared/logging/PercentageLogger";
import {figmaApi} from "@src/loading/figma/providers/FigmaApi";
import axios from "axios";
import {figmaId} from "@src/config/providers/Config";
import type {Api as FigmaApi} from "figma-api/lib/api-class";
import {castMockObject, createMockObjectOf} from "@src/shared/testing/jest/JestHelpers";
import {throttledRequest} from "./throttle/ThrottledRequest";

jest.mock("./figma-component-extractors/PageExtractor");
jest.mock("@src/shared/logging/PercentageLogger");
jest.mock("@src/loading/figma/providers/FigmaApi");
jest.mock("@src/config/providers/Config");
jest.mock("./throttle/ThrottledRequest");
jest.mock("axios");

const extractPageMock = jest.mocked(extractPage);
const logPercentageMock = jest.mocked(logPercentage);
const figmaIdMock = jest.mocked(figmaId);
const figmaApiBuilderMock = jest.mocked(figmaApi);
const figmaApiMock = createMockObjectOf<FigmaApi>("getImage");
const axiosMock = castMockObject(axios);
const throttledRequestMock = jest.mocked(throttledRequest);

const svg1 = {
  ...buildTestNode("COMPONENT"),
  name: "svg1",
  children: [
    buildSvgInFrame("svg1")
  ]
};
const svg2 = {
  ...buildTestNode("COMPONENT"),
  name: "svg2",
  children: [
    buildSvgInFrame("svg2")
  ]
};
const fontFrame: Node<"CANVAS"> = {
  ...buildTestNode("CANVAS"),
  children: [
    svg1,
    svg2
  ]
} as Node<"CANVAS">;
const figmaGetFileResult: GetFileResult = {} as unknown as GetFileResult;

const svg = `
  <svg width="26" height="27" viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_718_5836)">
          <path d="stubbed" fill="#0D0D0D"/>
      </g>
      <defs>
          <clipPath id="clip0_718_5836">
              <rect width="25.6" height="26.4533" fill="white" transform="scale(1.01563)"/>
          </clipPath>
      </defs>
  </svg>
`;
const svgAfterProcessing = `
  <svg width="26" height="27" viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_718_5836)">
          <path d="stubbed" fill="currentColor"/>
      </g>
      <defs>
          <clipPath id="clip0_718_5836">
              <rect width="25.6" height="26.4533" fill="white" transform="scale(1.01563)"/>
          </clipPath>
      </defs>
  </svg>
`;

let result: SvgDictionary | undefined;
let caughtError: unknown;

beforeEach(() => {
  extractPageMock.mockReturnValue(fontFrame);
  figmaIdMock.mockReturnValue("figma-id");
  figmaApiBuilderMock.mockReturnValue(figmaApiMock);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const getImageMockImplementation: typeof figmaApiMock.getImage = (
    figmaId,
    params
  ): ReturnType<typeof figmaApiMock.getImage> => {
    return Promise.resolve({
      images: {
        [`${params.ids}`]: "s3-test-url"
      }
    });
  };
  figmaApiMock.getImage.mockImplementation(getImageMockImplementation);

  axiosMock.get.mockResolvedValue({
    data: svg
  });

  throttledRequestMock.mockImplementation((callback) => {
    return callback();
  });

  result = undefined;
  caughtError = undefined;
});

describe("when extracting fonts successfully", () => {
  beforeEach(async () => {
    try {
      result = await target.extractIcons(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should return extracted icons", () => {
    const expected: SvgDictionary = {
      svg1: svgAfterProcessing,
      svg2: svgAfterProcessing
    };
    expect(result).toEqual(expected);
  });

  it("should not throw an error", () => {
    expect(caughtError).toBeUndefined();
  });

  it("should log percentage", () => {
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "icons",
      index: expect.anything(),
      length: 2,
      extra: "svg1"
    });
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "icons",
      index: expect.anything(),
      length: 2,
      extra: "svg2"
    });
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractPageMock).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Iconography"});
  });
});

describe("when no icon containers", () => {
  beforeEach(async () => {
    const updatedFontFrame: Node<"CANVAS"> = {
      ...fontFrame,
      children: []
    };
    extractPageMock.mockReturnValue(updatedFontFrame);

    try {
      result = await target.extractIcons(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should return extracted icons", () => {
    const expected: SvgDictionary = {};
    expect(result).toEqual(expected);
  });

  it("should not throw an error", () => {
    expect(caughtError).toBeUndefined();
  });

  it("should not log percentage", () => {
    expect(logPercentageMock).not.toHaveBeenCalled();
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractPageMock).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Iconography"});
  });
});

describe("when no svg id on frame or svg", () => {
  beforeEach(async () => {
    const updatedFontFrame: Node<"CANVAS"> = {
      ...fontFrame,
      children: [
        {
          ...svg1,
          children: [{
            ...svg1.children[0],
            children: [buildSvgInFrame(undefined)]
          }]
        },
        svg2
      ]
    };
    extractPageMock.mockReturnValue(updatedFontFrame);

    try {
      result = await target.extractIcons(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should not return extracted icons", () => {
    expect(result).toBeUndefined();
  });

  it("should throw an error", () => {
    expect(caughtError).toEqual(new Error("No svg id found for 'svg1', is figma setup correctly?"));
  });

  it("should log percentage for just svg 2", () => {
    expect(logPercentageMock).not.toHaveBeenCalledWith({
      type: "icons",
      index: expect.anything(),
      length: 2,
      extra: "svg1"
    });
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "icons",
      index: expect.anything(),
      length: 2,
      extra: "svg2"
    });
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractPageMock).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Iconography"});
  });
});

describe("when no svg id on rectangle", () => {
  beforeEach(async () => {
    const updatedFontFrame: Node<"CANVAS"> = {
      ...fontFrame,
      children: [
        {
          ...svg1,
          children: [{
            ...svg1.children[0],
            children: [buildRectangle(undefined)]
          }]
        },
        svg2
      ]
    };
    extractPageMock.mockReturnValue(updatedFontFrame);

    try {
      result = await target.extractIcons(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should not return extracted icons", () => {
    expect(result).toBeUndefined();
  });

  it("should throw an error", () => {
    expect(caughtError).toEqual(new Error("No svg id found for 'svg1', is figma setup correctly?"));
  });

  it("should log percentage for just svg 2", () => {
    expect(logPercentageMock).not.toHaveBeenCalledWith({
      type: "icons",
      index: expect.anything(),
      length: 2,
      extra: "svg1"
    });
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "icons",
      index: expect.anything(),
      length: 2,
      extra: "svg2"
    });
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractPageMock).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Iconography"});
  });
});

describe("when no svg id on svg", () => {
  beforeEach(async () => {
    const updatedFontFrame: Node<"CANVAS"> = {
      ...fontFrame,
      children: [
        {
          ...svg1,
          children: [{
            ...svg1.children[0],
            children: [buildSvg(undefined)]
          }]
        },
        svg2
      ]
    };
    extractPageMock.mockReturnValue(updatedFontFrame);

    try {
      result = await target.extractIcons(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should not return extracted icons", () => {
    expect(result).toBeUndefined();
  });

  it("should throw an error", () => {
    expect(caughtError).toEqual(new Error("No svg id found for 'svg1', is figma setup correctly?"));
  });

  it("should log percentage for just svg 2", () => {
    expect(logPercentageMock).not.toHaveBeenCalledWith({
      type: "icons",
      index: expect.anything(),
      length: 2,
      extra: "svg1"
    });
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "icons",
      index: expect.anything(),
      length: 2,
      extra: "svg2"
    });
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractPageMock).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Iconography"});
  });
});

describe("when no svg id on group", () => {
  beforeEach(async () => {
    const updatedFontFrame: Node<"CANVAS"> = {
      ...fontFrame,
      children: [
        {
          ...svg1,
          children: [{
            ...svg1.children[0],
            children: [buildGroup(undefined)]
          }]
        },
        svg2
      ]
    };
    extractPageMock.mockReturnValue(updatedFontFrame);

    try {
      result = await target.extractIcons(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should not return extracted icons", () => {
    expect(result).toBeUndefined();
  });

  it("should throw an error", () => {
    expect(caughtError).toEqual(new Error("No svg id found for 'svg1', is figma setup correctly?"));
  });

  it("should log percentage for just svg 2", () => {
    expect(logPercentageMock).not.toHaveBeenCalledWith({
      type: "icons",
      index: expect.anything(),
      length: 2,
      extra: "svg1"
    });
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "icons",
      index: expect.anything(),
      length: 2,
      extra: "svg2"
    });
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractPageMock).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Iconography"});
  });
});

describe("when no svg id on vector", () => {
  beforeEach(async () => {
    const updatedFontFrame: Node<"CANVAS"> = {
      ...fontFrame,
      children: [
        {
          ...svg1,
          children: [{
            ...svg1.children[0],
            children: [buildVector(undefined)]
          }]
        },
        svg2
      ]
    };
    extractPageMock.mockReturnValue(updatedFontFrame);

    try {
      result = await target.extractIcons(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should not return extracted icons", () => {
    expect(result).toBeUndefined();
  });

  it("should throw an error", () => {
    expect(caughtError).toEqual(new Error("No svg id found for 'svg1', is figma setup correctly?"));
  });

  it("should log percentage for just svg 2", () => {
    expect(logPercentageMock).not.toHaveBeenCalledWith({
      type: "icons",
      index: expect.anything(),
      length: 2,
      extra: "svg1"
    });
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "icons",
      index: expect.anything(),
      length: 2,
      extra: "svg2"
    });
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractPageMock).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Iconography"});
  });
});

describe("when no svg elements at all", () => {
  beforeEach(async () => {
    const updatedFontFrame: Node<"CANVAS"> = {
      ...fontFrame,
      children: [
        {
          ...svg1,
          children: [{
            ...svg1.children[0],
            children: []
          }]
        },
        svg2
      ]
    };
    extractPageMock.mockReturnValue(updatedFontFrame);

    try {
      result = await target.extractIcons(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should not return extracted icons", () => {
    expect(result).toBeUndefined();
  });

  it("should throw an error", () => {
    expect(caughtError).toEqual(new Error("No svg id found for 'svg1', is figma setup correctly?"));
  });

  it("should log percentage for just svg 2", () => {
    expect(logPercentageMock).not.toHaveBeenCalledWith({
      type: "icons",
      index: expect.anything(),
      length: 2,
      extra: "svg1"
    });
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "icons",
      index: expect.anything(),
      length: 2,
      extra: "svg2"
    });
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractPageMock).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Iconography"});
  });
});

describe("when figma get image api call fails", () => {
  beforeEach(async () => {
    figmaApiMock.getImage.mockResolvedValue({
      images: {},
      err: "mocked failure"
    });

    try {
      result = await target.extractIcons(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should not return extracted icons", () => {
    expect(result).toBeUndefined();
  });

  it("should throw an error", () => {
    expect(caughtError).toEqual(new Error("Failed to get the image for 'svg1' due to error 'mocked failure'"));
  });

  it("should not log percentage for just svg 2", () => {
    expect(logPercentageMock).not.toHaveBeenCalled();
  });

  it("should extract frame with correct page and frame names", () => {
    expect(extractPageMock).toHaveBeenCalledWith({figmaGetFileResult, pageName: "   ↳ Iconography"});
  });
});

function buildSvgInFrame(id: string | undefined): Node {
  const svg: Node = {
    ...buildTestNode("BOOLEAN_OPERATION"),
    id: id as string
  };
  return {
    ...buildTestNode("FRAME"),
    children: [svg]
  };
}

function buildRectangle(id: string | undefined): Node {
  return {
    ...buildTestNode("RECTANGLE"),
    id: id as string
  };
}

function buildSvg(id: string | undefined): Node {
  return {
    ...buildTestNode("BOOLEAN_OPERATION"),
    id: id as string
  };
}

function buildGroup(id: string | undefined): Node {
  return {
    ...buildTestNode("GROUP"),
    id: id as string
  };
}

function buildVector(id: string | undefined): Node {
  return {
    ...buildTestNode("VECTOR"),
    id: id as string
  };
}
