import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: ["node_modules/**"],
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
  },
];

export default eslintConfig;
