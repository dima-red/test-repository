const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const devConfig = {

    mode: "development", 
    entry: [
        './src/index.js'
    ],
    output: {
        filename: './bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.webp$/i,
                loaders: [
                    'file-loader',
                    'webp-loader'
                ],
            },
            {
                test: /\.html$/,
                use: "html-loader"
            }
        ]
    },
    devtool: "source-map",
    plugins: [
        new HtmlWebpackPlugin({
            title: "My Template",
            template: "./index.html"
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, './dist'),
        port: 4200,
        hot: true,
    }
};

module.exports = devConfig;





























// const path = require("path");
// const fs = require("fs");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const CopyWebpackPlugin = require("copy-webpack-plugin");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const TerserPlugin = require("terser-webpack-plugin");

// function generateHtmlPlugins(templateDir) {
//   const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
//   return templateFiles.map(item => {
//     const parts = item.split(".");
//     const name = parts[0];
//     const extension = parts[1];
//     return new HtmlWebpackPlugin({
//       filename: `${name}.html`,
//       template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
//       inject: false
//     });
//   });
// }

// const htmlPlugins = generateHtmlPlugins("./src/html/views");

// const devConfig = {
//   entry: ["./src/js/index.js", "./src/scss/style.scss"],
//   output: {
//     filename: "./js/bundle.js"
//   },
//   devtool: "source-map",
//   mode: "production",
//   optimization: {
//     minimizer: [
//       new TerserPlugin({
//         sourceMap: true,
//         extractComments: true
//       })
//     ]
//   },
//   module: {
//     rules: [
//       {
//         test: /\.(sass|scss)$/,
//         include: path.resolve(__dirname, "src/scss"),
//         use: [
//           {
//             loader: MiniCssExtractPlugin.loader,
//             options: {}
//           },
//           {
//             loader: "css-loader",
//             options: {
//               sourceMap: true,
//               url: false
//             }
//           },
//           {
//             loader: "postcss-loader",
//             options: {
//               ident: "postcss",
//               sourceMap: true,
//               plugins: () => [
//                 require("cssnano")({
//                   preset: [
//                     "default",
//                     {
//                       discardComments: {
//                         removeAll: true
//                       }
//                     }
//                   ]
//                 })
//               ]
//             }
//           },
//           {
//             loader: "sass-loader",
//             options: {
//               sourceMap: true
//             }
//           }
//         ]
//       },
//       {
//         test: /\.html$/,
//         include: path.resolve(__dirname, "src/html/includes"),
//         use: ["raw-loader"]
//       }
//     ]
//   },
//   plugins: [
//     new MiniCssExtractPlugin({
//       filename: "./css/style.bundle.css"
//     }),
//     new CopyWebpackPlugin([
//       {
//         from: "./src/fonts",
//         to: "./fonts"
//       },
//       {
//         from: "./src/favicon",
//         to: "./favicon"
//       },
//       {
//         from: "./src/img",
//         to: "./img"
//       },
//       {
//         from: "./src/uploads",
//         to: "./uploads"
//       }
//     ])
//   ].concat(htmlPlugins)
// };

// module.exports = (env, argv) => {
//   if (argv.mode === "production") {
//     devConfig.plugins.push(new CleanWebpackPlugin());
//   }
//   return devConfig;
// };