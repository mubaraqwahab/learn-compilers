// Hack!
// For some reason, TS can't find the .d.ts file for chevrotain
// Credit: https://stackoverflow.com/a/50516783/12695621

declare module "chevrotain" {
  export * from "@chevrotain/types";
}
