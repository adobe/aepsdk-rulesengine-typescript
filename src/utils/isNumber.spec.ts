import { isNumber } from "./isNumber";

describe("isNumber", () => {
  it("returns true for a given number", () => {
    const result = isNumber(2023);
    expect(result).toBe(true);
  });
  it("returns false for a non-number value", () => {
    const result = isNumber("this is not a number");
    expect(result).toBe(false);
  });
  it("returns false for null", () => {
    const result = isNumber(null);
    expect(result).toBe(false);
  });
  it("returns false for undefined", () => {
    const result = isNumber(undefined);
    expect(result).toBe(false);
  });
});
