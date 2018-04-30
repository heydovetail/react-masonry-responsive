import { CheckerPlugin, TsConfigPathsPlugin } from "awesome-typescript-loader";

export const module = {
  rules: [
    {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      loader: "awesome-typescript-loader"
    }
  ]
};

export const resolve = {
  extensions: [".ts", ".tsx", ".js", ".jsx"],
  plugins: [new TsConfigPathsPlugin({ configFileName: "tsconfig.json" })]
};

export const plugins = [new CheckerPlugin()];
