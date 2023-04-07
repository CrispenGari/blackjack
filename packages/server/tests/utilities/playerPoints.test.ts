import { describe, expect, test } from "@jest/globals";
import { playerPoints } from "../../src/utils";

describe("Testing player Points function.", () => {
  test("2 players position 1", () => {
    expect(playerPoints(2, 1)).toBe(16);
  });
  test("2 players position 2", () => {
    expect(playerPoints(2, 2)).toBe(-1);
  });

  test("3 players position 1", () => {
    expect(playerPoints(3, 1)).toBe(16);
  });
  test("3 players position 2", () => {
    expect(playerPoints(3, 2)).toBe(0);
  });
  test("3 players position 3", () => {
    expect(playerPoints(3, 3)).toBe(-1);
  });

  test("4 players position 1", () => {
    expect(playerPoints(4, 1)).toBe(16);
  });
  test("4 players position 2", () => {
    expect(playerPoints(4, 2)).toBe(9);
  });
  test("4 players position 3", () => {
    expect(playerPoints(4, 3)).toBe(0);
  });
  test("4 players position 4", () => {
    expect(playerPoints(4, 4)).toBe(-1);
  });

  test("5 players position 1", () => {
    expect(playerPoints(5, 1)).toBe(16);
  });
  test("5 players position 2", () => {
    expect(playerPoints(5, 2)).toBe(10);
  });
  test("5 players position 3", () => {
    expect(playerPoints(5, 3)).toBe(5);
  });
  test("5 players position 5", () => {
    expect(playerPoints(5, 4)).toBe(0);
  });
  test("5 players position 5", () => {
    expect(playerPoints(5, 5)).toBe(-1);
  });
});
