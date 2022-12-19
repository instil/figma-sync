import * as target from "./ConvertorConfig";
import type {PixelToPixelConvertorConfig} from "./ConvertorConfig";
import type {PixelToRemConvertorConfig} from "./ConvertorConfig";

describe("checking if is pixel to pixel config", () => {
  const config: PixelToPixelConvertorConfig = {
    unitType: "px"
  };

  it("should return true for pixel to pixel config checker", () => {
    const result = target.isPixelToPixelConvertorConfig(config);

    expect(result).toBe(true);
  });

  it("should return false for pixel to rem config checker", () => {
    const result = target.isPixelToRemConvertorConfig(config);

    expect(result).toBe(false);
  });

  it("should return true for generic unit convertor config", () => {
    const result = target.isUnitConvertorConfig(config);

    expect(result).toBe(true);
  });
});

describe("checking if is pixel to rem config", () => {
  const config: PixelToRemConvertorConfig = {
    unitType: "rem"
  };

  it("should return false for pixel to pixel config checker", () => {
    const result = target.isPixelToPixelConvertorConfig(config);

    expect(result).toBe(false);
  });

  it("should return true for pixel to rem config checker", () => {
    const result = target.isPixelToRemConvertorConfig(config);

    expect(result).toBe(true);
  });

  it("should return true for pixel to rem config checker when base font size is a number", () => {
    const result = target.isPixelToRemConvertorConfig({
      ...config,
      baseFontSize: 10
    });

    expect(result).toBe(true);
  });

  it("should return false for pixel to rem config checker when base font size is not a number", () => {
    const result = target.isPixelToRemConvertorConfig({
      ...config,
      baseFontSize: "123"
    });

    expect(result).toBe(false);
  });

  it("should return true for generic unit convertor config", () => {
    const result = target.isUnitConvertorConfig(config);

    expect(result).toBe(true);
  });
});

describe("checking if is unknown config", () => {
  const config = {};

  it("should return false for pixel to pixel config checker", () => {
    const result = target.isPixelToPixelConvertorConfig(config);

    expect(result).toBe(false);
  });

  it("should return false for pixel to rem config checker", () => {
    const result = target.isPixelToRemConvertorConfig(config);

    expect(result).toBe(false);
  });

  it("should return false for generic unit convertor config", () => {
    const result = target.isUnitConvertorConfig(config);

    expect(result).toBe(false);
  });
});
