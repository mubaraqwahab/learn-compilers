import { writeFile, mkdir } from "node:fs/promises";
import { regexToNFA } from "./regex-to-nfa.js";

/**
 * Return the NFA corresponding to the given regex
 * in Graphviz DOT language format.
 */
export function regexNFAToDot(regex: string): string {
  const nfa = regexToNFA(regex);
  let dotText = "";

  nfa.transitions.forEach(([from, char, to]) => {
    dotText += `  ${from} -> ${to} [label=${labelify(char)}];\n`;
  });

  dotText = `digraph {\n  rankdir=LR;\n${dotText}}`;

  return dotText;
}

/**
 * Dump the DOT language representation of a regex in a given file.
 */
export async function dumpRegexNFA(regex: string, filePath: string) {
  const dotText = regexNFAToDot(regex);
  await writeFile(filePath, dotText);
}

function labelify(char: string): string {
  return JSON.stringify(char || "&epsilon;");
}

// (async () => {
//   await mkdir("graphs", { recursive: true });
//   dumpRegexNFA("a", "graphs/simple.dot");
//   dumpRegexNFA("ab", "graphs/concat.dot");
//   dumpRegexNFA("a|b", "graphs/union.dot");
//   dumpRegexNFA("a*", "graphs/kleene.dot");
//   dumpRegexNFA("(ab|c)*abb", "graphs/complex.dot");
// })();
