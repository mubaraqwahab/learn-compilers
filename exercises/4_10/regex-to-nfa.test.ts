import { expect, test } from "vitest";
import { type NFA, regexToNFA } from "./regex-to-nfa.js";

test("can convert a simple regex to an NFA", () => {
  const nfa: NFA = {
    final: "s1",
    transitions: new Set([["s0", "a", "s1"]]),
  };
  expect(regexToNFA(`a`)).toMatchObject(nfa);
});

test("can convert a concat to an NFA", () => {
  const nfa: NFA = {
    final: "s2",
    transitions: new Set([
      ["s0", "a", "s1"],
      ["s1", "b", "s2"],
    ]),
  };
  expect(regexToNFA(`ab`)).toMatchObject(nfa);
});

test("can convert a union to an NFA", () => {
  const nfa: NFA = {
    final: "s5",
    transitions: new Set([
      ["s0", "", "s1"],
      ["s1", "a", "s2"],
      ["s0", "", "s3"],
      ["s3", "b", "s4"],
      ["s2", "", "s5"],
      ["s4", "", "s5"],
    ]),
  };
  expect(regexToNFA(`a|b`)).toMatchObject(nfa);
});

test("can convert a kleene closure to an NFA", () => {
  const nfa: NFA = {
    final: "s3",
    transitions: new Set([
      ["s0", "", "s1"],
      ["s1", "a", "s2"],
      ["s2", "", "s1"],
      ["s2", "", "s3"],
      ["s0", "", "s3"],
    ]),
  };
  expect(regexToNFA(`a*`)).toMatchObject(nfa);
});

test("can convert a complex regex to an NFA", () => {
  const nfa: NFA = {
    final: "s11",
    transitions: new Set([
      ["s0", "", "s1"],

      ["s1", "", "s2"],
      ["s2", "a", "s3"],
      ["s3", "b", "s4"],

      ["s1", "", "s5"],
      ["s5", "c", "s6"],

      ["s4", "", "s7"],
      ["s6", "", "s7"],

      ["s7", "", "s1"],
      ["s7", "", "s8"],
      ["s0", "", "s8"],

      ["s8", "a", "s9"],
      ["s9", "b", "s10"],
      ["s10", "b", "s11"],
    ]),
  };

  expect(regexToNFA(`(ab|c)*abb`)).toMatchObject(nfa);
});
