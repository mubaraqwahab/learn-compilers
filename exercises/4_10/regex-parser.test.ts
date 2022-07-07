import { expect, test } from "vitest";
import { parse, createNode as n } from "./regex-parser.js";

const r = n.regex;

test("can parse a one-letter regex", () => {
  expect(parse("a")).toMatchObject(r(n.literal("a")));
});

test("can parse a union", () => {
  expect(parse("a|b")).toMatchObject(
    r(n.union(n.literal("a"), n.literal("b")))
  );
});

test("can parse a concat", () => {
  expect(parse("ab")).toMatchObject(
    r(n.concat(n.literal("a"), n.literal("b")))
  );
});

test("can parse a kleene closure", () => {
  expect(parse("a*")).toMatchObject(r(n.kleene(n.literal("a"))));
});

test("can reduce multiple kleene closures to one", () => {
  expect(parse("a**")).toMatchObject(r(n.kleene(n.literal("a"))));
});

test("can parse a group", () => {
  expect(parse("(a)")).toMatchObject(r(n.literal("a")));
});

test("can parse a complex regex", () => {
  expect(parse("a(b*c|d)e")).toMatchObject(
    r(
      n.concat(
        n.concat(
          n.literal("a"),
          n.union(
            n.concat(n.kleene(n.literal("b")), n.literal("c")),
            n.literal("d")
          )
        ),
        n.literal("e")
      )
    )
  );
});

test("fails on an empty regex (or empty subregex)", () => {
  expect(() => parse("")).toThrow(SyntaxError);
  expect(() => parse("|")).toThrow(SyntaxError);
  expect(() => parse("*")).toThrow(SyntaxError);
  expect(() => parse("()")).toThrow(SyntaxError);
});

test("fails on malformed regex", () => {
  expect(() => parse("a||b")).toThrow(SyntaxError);
  expect(() => parse("a*)b")).toThrow(SyntaxError);
  expect(() => parse("((a*)b")).toThrow(SyntaxError);
  expect(() => parse("a|*b")).toThrow(SyntaxError);
});
