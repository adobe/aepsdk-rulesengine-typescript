module.exports = {
  ignore: ["node_modules/**"],
  env: {
    development: {
      presets: [
        ["@babel/preset-env", { targets: { node: "current" } }],
        "@babel/typescript",
      ],
    },
    production: {
      presets: [
        "@babel/env",
        {
          targets: {
            browsers: ["chrome 95"],
          },
          modules: false,
          loose: true,
        },
      ],
    },
  },
};
