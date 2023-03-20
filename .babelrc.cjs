module.exports = {
  ignore: ["node_modules/**"],
  env: {
    development: {
      presets: [
        "@babel/typescript",
        ["@babel/preset-env", { targets: { node: "current" } }],
      ],
    },
    production: {
      presets: [
        "@babel/typescript",
        [
          "@babel/env",
          {
            targets: {
              browsers: ["chrome 95"],
            },
            modules: false,
            loose: true,
          },
        ],
      ],
    },
  },
};
