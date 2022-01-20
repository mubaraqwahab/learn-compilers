// @ts-check

import chevrotain from "chevrotain"

const { createToken } = chevrotain

export default [
  createToken({
    name: "AbstractKeyword",
    pattern: /abstract/,
  }),

  createToken({ name: "AssertKeyword", pattern: /assert/ }),

  createToken({
    name: "BooleanKeyword",
    pattern: /boolean/,
  }),

  createToken({ name: "BreakKeyword", pattern: /break/ }),

  createToken({ name: "ByteKeyword", pattern: /byte/ }),

  createToken({ name: "CaseKeyword", pattern: /case/ }),

  createToken({ name: "CatchKeyword", pattern: /catch/ }),

  createToken({ name: "CharKeyword", pattern: /char/ }),

  createToken({ name: "ClassKeyword", pattern: /class/ }),

  createToken({ name: "ConstKeyword", pattern: /const/ }),

  createToken({
    name: "ContinueKeyword",
    pattern: /continue/,
  }),

  createToken({
    name: "DefaultKeyword",
    pattern: /default/,
  }),

  createToken({ name: "DoubleKeyword", pattern: /double/ }),

  createToken({
    name: "DoKeyword",
    pattern: /do/,
  }),

  createToken({ name: "ElseKeyword", pattern: /else/ }),

  createToken({ name: "EnumKeyword", pattern: /enum/ }),

  createToken({
    name: "ExtendsKeyword",
    pattern: /extends/,
  }),

  createToken({
    name: "FinallyKeyword",
    pattern: /finally/,
  }),

  createToken({
    name: "FinalKeyword",
    pattern: /final/,
  }),

  createToken({ name: "FloatKeyword", pattern: /float/ }),

  createToken({ name: "ForKeyword", pattern: /for/ }),

  createToken({
    name: "InterfaceKeyword",
    pattern: /interface/,
  }),

  createToken({
    name: "IntKeyword",
    pattern: /int/,
  }),

  createToken({ name: "GotoKeyword", pattern: /goto/ }),

  createToken({ name: "IfKeyword", pattern: /if/ }),

  createToken({
    name: "ImplementsKeyword",
    pattern: /implements/,
  }),

  createToken({ name: "ImportKeyword", pattern: /import/ }),

  createToken({
    name: "InstanceofKeyword",
    pattern: /instanceof/,
  }),

  createToken({ name: "LongKeyword", pattern: /long/ }),

  createToken({ name: "NativeKeyword", pattern: /native/ }),

  createToken({ name: "NewKeyword", pattern: /new/ }),

  createToken({
    name: "PackageKeyword",
    pattern: /package/,
  }),

  createToken({
    name: "PrivateKeyword",
    pattern: /private/,
  }),

  createToken({
    name: "ProtectedKeyword",
    pattern: /protected/,
  }),

  createToken({ name: "PublicKeyword", pattern: /public/ }),

  createToken({ name: "ReturnKeyword", pattern: /return/ }),

  createToken({ name: "ShortKeyword", pattern: /short/ }),

  createToken({ name: "StaticKeyword", pattern: /static/ }),

  createToken({
    name: "StrictfpKeyword",
    pattern: /strictfp/,
  }),

  createToken({ name: "SuperKeyword", pattern: /super/ }),

  createToken({ name: "SwitchKeyword", pattern: /switch/ }),

  createToken({
    name: "SynchronizedKeyword",
    pattern: /synchronized/,
  }),

  createToken({ name: "ThisKeyword", pattern: /this/ }),

  createToken({ name: "throwsKeyword", pattern: /throws/ }),

  createToken({
    name: "throwKeyword",
    pattern: /throw/,
  }),

  createToken({
    name: "transientKeyword",
    pattern: /transient/,
  }),

  createToken({ name: "tryKeyword", pattern: /try/ }),

  createToken({ name: "voidKeyword", pattern: /void/ }),

  createToken({
    name: "volatileKeyword",
    pattern: /volatile/,
  }),

  createToken({ name: "whileKeyword", pattern: /while/ }),
]
