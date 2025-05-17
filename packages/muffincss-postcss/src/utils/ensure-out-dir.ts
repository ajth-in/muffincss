const path = require("path");
const fs = require("fs");
export const ensureOutDirStructure = (absolutePath: string) => {
  if (!fs.existsSync(absolutePath)) {
    fs.mkdirSync(absolutePath, { recursive: true });
  }

  const subDirs = ["_resolved", "css"];
  subDirs.forEach((dir) => {
    const fullPath = path.join(absolutePath, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath);
    }
  });
};
