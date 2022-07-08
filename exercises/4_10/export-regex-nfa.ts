import { writeFile, mkdir } from "fs/promises";
import { regexToNFA } from "./regex-to-nfa.js";

// TODO: write a fn that returns the dot dump
// You can then do as you please with the dump
// (e.g. write to a file)
// Anyway, use snapshots to compare the dumps.
// You might want to sort the transitions in a
// deterministic order before dumping though!
// Or maybe not, since they are already so :)

export async function exportNFA(regex: string, outfile: string) {
  const nfa = regexToNFA(regex);
  let dump = "";

  nfa.transitions.forEach(([from, char, to]) => {
    dump += `  ${from} -> ${to} [label=${labelify(char)}];\n`;
  });

  dump = `digraph {\n  rankdir=LR;\n${dump}}`;

  await writeFile(outfile, dump);
}

function labelify(char: string): string {
  return JSON.stringify(char || "&epsilon;");
}

(async () => {
  await mkdir("graphs", { recursive: true });
  exportNFA("a", "graphs/simple.dot");
  exportNFA("ab", "graphs/concat.dot");
  exportNFA("a|b", "graphs/union.dot");
  exportNFA("a*", "graphs/kleene.dot");
  exportNFA("(ab|c)*abb", "graphs/complex.dot");
})();
