import * as target from "./EffectsExtractor";
import type {Effect} from "figma-api";
import {BlendMode, EffectType} from "figma-api/lib/ast-types";

const dropShadowEffects: Effect[] = [
  {
    "type": EffectType.DROP_SHADOW,
    "visible": true,
    "color": {
      "r": 0,
      "g": 0,
      "b": 0,
      "a": 0.10000000149011612
    },
    "blendMode": BlendMode.NORMAL,
    "offset": {
      "x": 0,
      "y": 4
    },
    "radius": 6
  },
  {
    "type": EffectType.DROP_SHADOW,
    "visible": true,
    "color": {
      "r": 0,
      "g": 0,
      "b": 0,
      "a": 0.05000000074505806
    },
    "blendMode": BlendMode.NORMAL,
    "offset": {
      "x": 0,
      "y": 2
    },
    "radius": 6
  },
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
];

const dropInsetEffect: Effect = {
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
};

const input: (Effect | undefined)[] = [
  ...dropShadowEffects,
  dropInsetEffect,
  undefined
];

describe("when extracting drop shadow effects", () => {
  let result: ReturnType<typeof target.extractDropShadowEffects>;

  beforeEach(() => {
    result = target.extractDropShadowEffects(input);
  });

  it("should only contain drop shadow effects", () => {
    expect(result).toEqual(dropShadowEffects);
  });

  it("should not modify original array", () => {
    expect(input).toEqual([...dropShadowEffects, dropInsetEffect, undefined]);
  });
});

describe("when extracting inset shadow effects", () => {
  let result: ReturnType<typeof target.extractInsetShadowEffects>;

  beforeEach(() => {
    result = target.extractInsetShadowEffects(input);
  });

  it("should only contain inset shadow effects", () => {
    expect(result).toEqual([dropInsetEffect]);
  });

  it("should not modify original array", () => {
    expect(input).toEqual([...dropShadowEffects, dropInsetEffect, undefined]);
  });
});
