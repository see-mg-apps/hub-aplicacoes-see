import type { Application } from "../types";
import { initialApplications } from "../data/applications";

// Fronteira para um futuro adaptador remoto. Esta versão opera apenas em memória.
export const localCatalog = {
  load(): Application[] {
    return initialApplications.map((app) => ({ ...app }));
  },
};
export function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}
export function selectApplications(
  apps: Application[],
  query: string,
  category: string,
) {
  const term = normalize(query);
  return apps
    .filter(
      (app) =>
        app.active &&
        (category === "Todas" || app.category === category) &&
        normalize(`${app.name} ${app.description}`).includes(term),
    )
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "pt-BR"));
}
export function isSafeUrl(value: string) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return (
      ["https:", "http:"].includes(url.protocol) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}
