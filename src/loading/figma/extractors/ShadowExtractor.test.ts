import * as target from "./ShadowExtractor";
import type {GetFileResult} from "figma-api/lib/api-types";
import {mockFunction} from "@src/shared/testing/jest/JestHelpers";
import {extractFrame} from "./figma-component-extractors/FrameExtractor";
import {logPercentage} from "./logging/PercentageLogger";
import type {FRAME} from "figma-api";
import {buildTestNode} from "@src/loading/figma/types/figma-api/testing/BuildTestNode";
import type {DesignTokenShadows} from "@src/loading/figma/types/design-token/types/DesignTokenShadows";
import {BlendMode, EffectType} from "figma-api/lib/ast-types";

jest.mock("./figma-component-extractors/FrameExtractor");
jest.mock("./logging/PercentageLogger");

const extractFrameMock = mockFunction(extractFrame);
const logPercentageMock = mockFunction(logPercentage);

const dropShadowEffect: FRAME = {
  ...buildTestNode("FRAME"),
  name: "drop",
  effects: [
    {
      "type": EffectType.DROP_SHADOW,
      "visible": true,
      "color": {
        "r": 0.1411764770746231,
        "g": 0.1411764770746231,
        "b": 0.1411764770746231,
        "a": 0.15000000596046448
      },
      "blendMode": BlendMode.NORMAL,
      "offset": {
        "x": 0,
        "y": 0
      },
      "radius": 0,
      "spread": 4
    },
    {
      "type": EffectType.DROP_SHADOW,
      "visible": true,
      "color": {
        "r": 0.1411764770746231,
        "g": 0.1411764770746231,
        "b": 0.1411764770746231,
        "a": 1
      },
      "blendMode": BlendMode.NORMAL,
      "offset": {
        "x": 0,
        "y": 0
      },
      "radius": 0,
      "spread": 0.5
    }
  ]
} as unknown as FRAME;
const insetShadowEffect: FRAME = {
  ...buildTestNode("FRAME"),
  name: "inset",
  effects: [{
    "type": EffectType.INNER_SHADOW,
    "visible": true,
    "color": {
      "r": 0,
      "g": 0,
      "b": 0,
      "a": 0.07000000029802322
    },
    "blendMode": BlendMode.NORMAL,
    "offset": {
      "x": 0,
      "y": 1
    },
    "radius": 2,
    "spread": 1
  }]
} as unknown as FRAME;
const frame: FRAME = {
  ...buildTestNode("FRAME"),
  children: [dropShadowEffect, insetShadowEffect]
} as unknown as FRAME;
const figmaGetFileResult: GetFileResult = {} as unknown as GetFileResult;

let result: ReturnType<typeof target.extractShadows> | undefined;
let caughtError: unknown;

beforeEach(() => {
  extractFrameMock.mockReturnValue(frame);

  result = undefined;
  caughtError = undefined;
});

describe("when extracting shadows successfully", () => {
  beforeEach(() => {
    try {
      result = target.extractShadows(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should return design token", () => {
    const expected: DesignTokenShadows = {
      drop: {
        type: "shadows",
        value: "box-shadow 0px 0px 0px rgba(0.14, 0.14, 0.14, 1), 0px 0px 0px rgba(0.14, 0.14, 0.14, 0.15)"
      },
      inset: {
        type: "shadows",
        value: "box-shadow inset 0px 1px 2px rgba(0, 0, 0, 0.07)"
      }
    };
    expect(result).toEqual(expected);
  });

  it("should not throw an error", () => {
    expect(caughtError).toBeUndefined();
  });

  it("should log percentage", () => {
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "shadows",
      index: 0,
      length: 2
    });
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "shadows",
      index: 1,
      length: 2
    });
  });
});

describe("when no valid effects are available", () => {
  beforeEach(() => {
    const updatedFrame: FRAME = {
      ...frame,
      children: [
        {
          ...dropShadowEffect,
          effects: [
            dropShadowEffect.effects.map(effect => ({...effect, type: EffectType.BACKGROUND_BLUR}))
          ]
        }
      ]
    } as unknown as FRAME;
    extractFrameMock.mockReturnValue(updatedFrame);

    try {
      result = target.extractShadows(figmaGetFileResult);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should return empty design token", () => {
    expect(result).toEqual({});
  });

  it("should not throw an error", () => {
    expect(caughtError).toBeUndefined();
  });

  it("should log percentage", () => {
    expect(logPercentageMock).toHaveBeenCalledWith({
      type: "shadows",
      index: 0,
      length: 1
    });
  });
});
