export const categories = [
  "Gestão escolar",
  "Cadastros",
  "Tecnologia",
  "Acessos",
] as const;
export const environments = [
  "Produção",
  "Homologação",
  "Demonstração",
] as const;
export const iconNames = ["school", "boxes", "bug", "users"] as const;
export type Application = {
  id: string;
  name: string;
  description: string;
  url: string;
  category: (typeof categories)[number];
  environment: (typeof environments)[number];
  icon: (typeof iconNames)[number];
  active: boolean;
  order: number;
};
