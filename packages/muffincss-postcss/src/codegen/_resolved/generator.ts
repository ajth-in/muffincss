import fs from "fs";
import path from "path";
import Handlebars from "handlebars";

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
    { name: "index.cjs", context: obj },
    { name: "index.mjs", context: obj },
    { name: "index.d.ts", context: { keys } },
  ];

  const outputDirPath = path.resolve(process.cwd(), outDir);
  if (!fs.existsSync(outputDirPath)) {
    fs.mkdirSync(outputDirPath, { recursive: true });
  }

  for (const file of files) {
    const templatePath = path.resolve(__dirname, `./${file.name}.hbs`);
    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const compiled = Handlebars.compile(templateSource);
    const result = compiled(file.context);

    const outputPath = path.join(outputDirPath, file.name);
    fs.writeFileSync(outputPath, result, "utf-8");
  }
}
