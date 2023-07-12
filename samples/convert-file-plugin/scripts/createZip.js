const JSZip = require("jszip");
const fs = require("fs");

const zip = new JSZip();

const jsData = fs.readFileSync(`./dist/ConvertFilePlugin.js`, "utf-8");
const jsonData = fs.readFileSync(`package.json`, "utf-8");

zip.file("ConvertFilePlugin.js", jsData);
zip.file("package.json", jsonData);

if (fs.existsSync("./assets")) {
  const assetsFiles = fs.readdirSync("./assets");

  assetsFiles.forEach((file) => {
    const data = fs.readFileSync(`./assets/${file}`, "base64");
    zip.file(`assets/${file}`, data, { base64: true });
  });
}
zip.generateAsync({ type: "nodebuffer" }).then(function (content) {
  fs.writeFileSync("./dist/plugin.zip", content);
});
