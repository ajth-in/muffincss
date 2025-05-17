import { Project, QuoteKind, VariableDeclarationKind } from "ts-morph";
import * as path from "path";
import * as fs from "fs";

export default function generateModuleVersionsWithType(
  mediaClassMap: Map<string, string[]>,
  outDir: string,
) {
  function mapToObjectLiteralText(map: Map<string, string[]>) {
    const entries = Array.from(map.entries()).map(([key, values]) => {
      const keyStr = JSON.stringify(key); // Ensures proper quoting
      const valuesStr = `[${values.map((v) => JSON.stringify(v)).join(", ")}]`;
      return `${keyStr.replace(".", "")}: ${valuesStr}`;
    });
    return `{ ${entries.join(", ")} }`;
  }

  const objectLiteralText = mapToObjectLiteralText(mediaClassMap);

  const project = new Project({
    manipulationSettings: { quoteKind: QuoteKind.Single }, // Optional: use single quotes
  });

  const esmSourceFile = project.createSourceFile("index.mjs", "", {
    overwrite: true,
  });

  esmSourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    declarations: [
      {
        name: "mediaClassMap",
        initializer: objectLiteralText,
      },
    ],
  });

  const esmOutput = esmSourceFile.getText();
  fs.writeFileSync(path.join(outDir, "index.mjs"), esmOutput);

  const cjsSourceFile = project.createSourceFile("index.cjs", "", {
    overwrite: true,
  });

  cjsSourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: "mediaClassMap",
        initializer: objectLiteralText,
      },
    ],
  });
  cjsSourceFile.addStatements(`module.exports = { mediaClassMap };`);

  const cjsOutput = cjsSourceFile.getText();
  fs.writeFileSync(path.join(outDir, "index.cjs"), cjsOutput);

  const typeSourceFile = project.createSourceFile("index.d.ts", "", {
    overwrite: true,
  });

  const keys = Array.from(mediaClassMap.keys())
    .map((key) => `"${key.replace(".", "")}"`)
    .join(" | ");

  typeSourceFile.addTypeAlias({
    name: "ClassNames",
    isExported: true,
    type: keys,
  });

  const typeOutput = typeSourceFile.getText();
  fs.writeFileSync(path.join(outDir, "index.d.ts"), typeOutput);
}
