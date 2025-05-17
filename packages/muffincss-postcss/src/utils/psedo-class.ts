export function getPseudoClass(selector: string): string | undefined {
  const index = selector.indexOf(":");
  if (index === -1) return;
  return selector.slice(index + 1);
}
export function removePseudoClasses(selector: string): string {
  return selector.replace(/:{1,2}[a-zA-Z0-9_-]+/g, "");
}
