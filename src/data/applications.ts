import type { Application } from "../types";

export const initialApplications: Application[] = [
  {
    id: "caixa-escolar",
    name: "Demonstração Caixa Escolar",
    description:
      "Organize a gestão dos recursos e acompanhe as atividades da caixa escolar em um só lugar.",
    url: "",
    category: "Gestão escolar",
    environment: "Demonstração",
    icon: "school",
    active: true,
    order: 1,
  },
  {
    id: "cadastro-itens",
    name: "Cadastro de Itens",
    description:
      "Centralize o cadastro e a consulta de itens para facilitar as rotinas da equipe.",
    url: "",
    category: "Cadastros",
    environment: "Demonstração",
    icon: "boxes",
    active: true,
    order: 2,
  },
  {
    id: "bugs",
    name: "Acompanhamento de Bugs",
    description:
      "Registre ocorrências e acompanhe a resolução de problemas nas aplicações.",
    url: "",
    category: "Tecnologia",
    environment: "Demonstração",
    icon: "bug",
    active: true,
    order: 3,
  },
  {
    id: "contas",
    name: "Criação de Contas",
    description:
      "Organize as solicitações de novas contas e acompanhe as demandas de acesso.",
    url: "",
    category: "Acessos",
    environment: "Demonstração",
    icon: "users",
    active: true,
    order: 4,
  },
];
