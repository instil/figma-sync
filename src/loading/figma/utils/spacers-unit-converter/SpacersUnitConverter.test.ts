import {buildPixelUnitConverter} from "./SpacersUnitConverter";
import type {PixelUnitTypeConfig, RemUnitTypeConfig} from "./types/UnitConverterConfig";
import type {OutputUnitType, PixelUnitType} from "./types/UnitType";

let target: ReturnType<typeof buildPixelUnitConverter>;

interface TestCase {
  input: PixelUnitType;
  expected: OutputUnitType;
}

describe("given a rem spacers config", () => {
  beforeEach(() => {
    const config: RemUnitTypeConfig = {
      unitType: "rem"
    };
    target = buildPixelUnitConverter(config);
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
      const config: RemUnitTypeConfig = {
        unitType: "rem",
        baseFontSize: 20
      };
      target = buildPixelUnitConverter(config);
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
    const config: PixelUnitTypeConfig = {
      unitType: "px"
    };
    target = buildPixelUnitConverter(config);
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
    target = buildPixelUnitConverter(undefined);
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
