import {buildPixelUnitConvertor} from "./PixelUnitConvertor";
import type {PixelToPixelConvertorConfig, PixelToRemConvertorConfig} from "./types/ConvertorConfig";
import type {UnitType, PixelUnitType} from "@src/shared/types/UnitType";

let target: ReturnType<typeof buildPixelUnitConvertor>;

interface TestCase {
  input: PixelUnitType;
  expected: UnitType;
}

describe("given a rem spacers config", () => {
  beforeEach(() => {
    const config: PixelToRemConvertorConfig = {
      unitType: "rem"
    };
    target = buildPixelUnitConvertor(config);
  });

  const testCases: TestCase[] = [
    {input: "1px", expected: "0.0625rem"},
    {input: "5px", expected: "0.3125rem"},
    {input: "10px", expected: "0.625rem"},
    {input: "20px", expected: "1.25rem"}
  ];

  testCases.forEach(({input, expected}) => {
    it(`should return '${expected}' for input '${input}'`, () => {
      const result = target(input);

      expect(result).toEqual(expected);
    });
  });

  describe("when the base font size is different", () => {
    beforeEach(() => {
      const config: PixelToRemConvertorConfig = {
        unitType: "rem",
        baseFontSize: 20
      };
      target = buildPixelUnitConvertor(config);
    });

    const testCases: TestCase[] = [
      {input: "1px", expected: "0.05rem"},
      {input: "5px", expected: "0.25rem"},
      {input: "10px", expected: "0.5rem"},
      {input: "20px", expected: "1rem"}
    ];

    testCases.forEach(({input, expected}) => {
      it(`should return '${expected}' for input '${input}'`, () => {
        const result = target(input);

        expect(result).toEqual(expected);
      });
    });
  });
});

describe("given a pixel spacers config", () => {
  beforeEach(() => {
    const config: PixelToPixelConvertorConfig = {
      unitType: "px"
    };
    target = buildPixelUnitConvertor(config);
  });

  const testCases: TestCase[] = [
    {input: "1px", expected: "1px"},
    {input: "5px", expected: "5px"},
    {input: "10px", expected: "10px"},
    {input: "20px", expected: "20px"}
  ];

  testCases.forEach(({input, expected}) => {
    it(`should return '${expected}' for input '${input}'`, () => {
      const result = target(input);

      expect(result).toEqual(expected);
    });
  });
});

describe("given no config", () => {
  beforeEach(() => {
    target = buildPixelUnitConvertor(undefined);
  });

  const testCases: TestCase[] = [
    {input: "1px", expected: "1px"},
    {input: "5px", expected: "5px"},
    {input: "10px", expected: "10px"},
    {input: "20px", expected: "20px"}
  ];

  testCases.forEach(({input, expected}) => {
    it(`should return '${expected}' for input '${input}'`, () => {
      const result = target(input);

      expect(result).toEqual(expected);
    });
  });
});
