// TODO: fix module specifier error
import { createToken as t } from "chevrotain";

export default [
  t({ name: "AbstractKeyword", pattern: /abstract/ }),

  t({ name: "AssertKeyword", pattern: /assert/ }),

  t({ name: "BooleanKeyword", pattern: /boolean/ }),

  t({ name: "BreakKeyword", pattern: /break/ }),

  t({ name: "ByteKeyword", pattern: /byte/ }),

  t({ name: "CaseKeyword", pattern: /case/ }),

  t({ name: "CatchKeyword", pattern: /catch/ }),

  t({ name: "CharKeyword", pattern: /char/ }),

  t({ name: "ClassKeyword", pattern: /class/ }),

  t({ name: "ConstKeyword", pattern: /const/ }),

  t({ name: "ContinueKeyword", pattern: /continue/ }),

  t({ name: "DefaultKeyword", pattern: /default/ }),

  t({ name: "DoubleKeyword", pattern: /double/ }),

  t({ name: "DoKeyword", pattern: /do/ }),

  t({ name: "ElseKeyword", pattern: /else/ }),

  t({ name: "EnumKeyword", pattern: /enum/ }),

  t({ name: "ExtendsKeyword", pattern: /extends/ }),

  t({ name: "FinallyKeyword", pattern: /finally/ }),

  t({ name: "FinalKeyword", pattern: /final/ }),

  t({ name: "FloatKeyword", pattern: /float/ }),

  t({ name: "ForKeyword", pattern: /for/ }),

  t({ name: "InterfaceKeyword", pattern: /interface/ }),

  t({ name: "IntKeyword", pattern: /int/ }),

  t({ name: "GotoKeyword", pattern: /goto/ }),

  t({ name: "IfKeyword", pattern: /if/ }),

  t({ name: "ImplementsKeyword", pattern: /implements/ }),

  t({ name: "ImportKeyword", pattern: /import/ }),

  t({ name: "InstanceofKeyword", pattern: /instanceof/ }),

  t({ name: "LongKeyword", pattern: /long/ }),

  t({ name: "NativeKeyword", pattern: /native/ }),

  t({ name: "NewKeyword", pattern: /new/ }),

  t({ name: "PackageKeyword", pattern: /package/ }),

  t({ name: "PrivateKeyword", pattern: /private/ }),

  t({ name: "ProtectedKeyword", pattern: /protected/ }),

  t({ name: "PublicKeyword", pattern: /public/ }),

  t({ name: "ReturnKeyword", pattern: /return/ }),

  t({ name: "ShortKeyword", pattern: /short/ }),

  t({ name: "StaticKeyword", pattern: /static/ }),

  t({ name: "StrictfpKeyword", pattern: /strictfp/ }),

  t({ name: "SuperKeyword", pattern: /super/ }),

  t({ name: "SwitchKeyword", pattern: /switch/ }),

  t({ name: "SynchronizedKeyword", pattern: /synchronized/ }),

  t({ name: "ThisKeyword", pattern: /this/ }),

  t({ name: "throwsKeyword", pattern: /throws/ }),

  t({ name: "throwKeyword", pattern: /throw/ }),

  t({ name: "transientKeyword", pattern: /transient/ }),

  t({ name: "tryKeyword", pattern: /try/ }),

  t({ name: "voidKeyword", pattern: /void/ }),

  t({ name: "volatileKeyword", pattern: /volatile/ }),

  t({ name: "whileKeyword", pattern: /while/ }),
];
