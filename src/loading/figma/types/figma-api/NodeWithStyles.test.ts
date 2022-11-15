import * as target from "./NodeWithStyles";
import type {Node} from "figma-api/lib/ast-types";
import type {NodeWithStyles} from "./NodeWithStyles";

describe("detect if has style map", () => {
  it("should return true if has style map", () => {
    const result = target.hasStyleMap({
      styles: {}
    } as Node);

    expect(result).toBe(true);
  });

  it("should return false if does not have style map", () => {
    const result = target.hasStyleMap({} as Node);

    expect(result).toBe(false);
  });

  it("should return false if style map is not an object", () => {
    const result = target.hasStyleMap({
      styles: "not an object"
    } as unknown as Node);

    expect(result).toBe(false);
  });
});

describe("detect if has fills", () => {
  it("should return true if has fills", () => {
    const result = target.hasFills({
      fills: []
    } as unknown as NodeWithStyles);

    expect(result).toBe(true);
  });

  it("should return false if does not have fills", () => {
    const result = target.hasFills({} as unknown as NodeWithStyles);

    expect(result).toBe(false);
  });

  it("should return false if fills is not an array", () => {
    const result = target.hasFills({
      fills: "not an array"
    } as unknown as NodeWithStyles);

    expect(result).toBe(false);
  });
});
