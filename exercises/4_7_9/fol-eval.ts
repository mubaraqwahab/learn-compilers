import { scan } from "./fol-scan.js";

/**
 * Evaluate a first-order-logic expression
 */
export function evaluate(src: string): boolean {
  const tokens = scan(src);
  // TODO: Write a grammar first!
  return true;
}
