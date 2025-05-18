import fs from "fs";
import path from "path";
import Handlebars from "handlebars";
import { cjsTemplate, dtSTemplate, mjsTemplate } from "./templates";

Handlebars.registerHelper("json", (context) =>
  JSON.stringify(context, null, 2),
);
Handlebars.registerHelper("cleanKey", (key: string) => {
  return key.startsWith(".") ? key.slice(1) : key;
});

function mapToObject(map: Map<string, string[]>): Record<string, string[]> {
  const obj: Record<string, string[]> = {};
  for (const [key, value] of map.entries()) {
    obj[key] = value;
  }
  return obj;
}

export function generateResolvedClasses(
  map: Map<string, string[]>,
  outDir: string,
): void {
  const obj = mapToObject(map);
  const keys = Array.from(map.keys());

  const files = [
    { content: cjsTemplate, context: obj, name: "index.cjs" },
    { content: mjsTemplate, context: obj, name: "index.mjs" },
    { content: dtSTemplate, context: { keys }, name: "index.d.ts" },
  ];

  const outputDirPath = path.resolve(process.cwd(), outDir);
  if (!fs.existsSync(outputDirPath)) {
    fs.mkdirSync(outputDirPath, { recursive: true });
  }

  for (const file of files) {
    const compiled = Handlebars.compile(file.content);
    const result = compiled(file.context);

    const outputPath = path.join(outputDirPath, file.name);
    fs.writeFileSync(outputPath, result, "utf-8");
  }
}
