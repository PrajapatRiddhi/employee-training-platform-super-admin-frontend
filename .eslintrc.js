module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    // "plugin:react-hooks/recommended"
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
    _: true,
    $: true,
    props: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "unused-imports", "simple-import-sort"], // "react-hooks"
  parser: "@babel/eslint-parser",
  rules: {
    "no-console": "warn", // warn , error
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "no-trailing-spaces": ["error", { skipBlankLines: true }],
    "no-empty": ["error", { allowEmptyCatch: true }],
    "simple-import-sort/imports": "error",
    // indent: ["error", 2, { SwitchCase: 1 }],
    // indent: ["error", "tab"],
    // "no-unused-vars": "off",

    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double", { allowTemplateLiterals: true }],
    semi: ["error", "never"],
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "error",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    "no-empty-function": [
      "error",
      {
        allow: ["constructors", "arrowFunctions"],
      },
    ],
    "react/no-unknown-property": [
      "error",
      {
        ignore: ["strategy", "bis_skin_checked", "shrink", "align", "charSet"],
      },
    ],
    "react/display-name": 0,
    // "react-hooks/rules-of-hooks": "warn", // error // Checks rules of Hooks
    // "react-hooks/exhaustive-deps": "warn" // Checks effect dependencies
    // "unicorn/filename-case": [
    //   "error",
    //   {
    //     cases: {
    //       camelCase: true,
    //       kebabCase: true,
    //     },
    //   },
    // ],
    // "sort-imports": [
    //   "error",
    //   {
    //     ignoreDeclarationSort: true,
    //   },
    // ],
    // "sort-imports": [2, {
    // 	"ignoreCase": false,
    // 	"ignoreMemberSort": false,
    // 	"memberSyntaxSortOrder": ["none", "all", "multiple", "single"]
    // }]
  },
}
