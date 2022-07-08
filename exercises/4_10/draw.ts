import { writeFile, mkdir } from "fs/promises";
import { regexToNFA } from "./regex-to-nfa.js";

async function draw(regex: string, outfile: string) {
  const nfa = regexToNFA(regex);
  let dump = "";
  nfa.transitions.forEach(([from, char, to]) => {
    dump += `${from} -> ${to} [label=${labelify(char)}];`;
  });

  dump = `digraph { rankdir=LR; ${dump} }`;

  await writeFile(outfile, dump);
}

function labelify(char: string): string {
  return JSON.stringify(char || "&epsilon;");
}

(async () => {
  await mkdir("graphs", { recursive: true });
  draw("a", "graphs/simple.dot");
  draw("ab", "graphs/concat.dot");
  draw("a|b", "graphs/union.dot");
  draw("a*", "graphs/kleene.dot");
  draw("(a|b)*abb", "graphs/complex.dot");
})();
