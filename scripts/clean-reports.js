const fs = require("fs");
const path = require("path");

const folders = [
  path.join(__dirname, "..", "cypress", "results"),
  path.join(__dirname, "..", "cypress", "reports", "html"),
];

for (const folder of folders) {
  if (fs.existsSync(folder)) {
    fs.rmSync(folder, { recursive: true, force: true });
  }
  fs.mkdirSync(folder, { recursive: true });
}

console.log("Pastas de relatorio limpas e recriadas.");
