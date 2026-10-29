import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import App from "./App";
import { isSafeUrl, selectApplications } from "./services/catalog";
import { initialApplications } from "./data/applications";

describe("Catálogo", () => {
  it("mostra quatro aplicações fictícias com acesso desabilitado", () => {
    render(<App />);
    expect(screen.getAllByRole("article")).toHaveLength(4);
    for (const button of screen.getAllByRole("button", {
      name: "Acessar aplicação",
    }))
      expect(button).toBeDisabled();
  });
  it("combina busca sem acentos, categoria e recuperação do estado vazio", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByRole("searchbox"), "resolucao");
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(
      screen.getByRole("heading", { name: "Acompanhamento de Bugs" }),
    ).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Cadastros" }));
    expect(screen.getByText("Nenhuma aplicação encontrada")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Limpar filtros" }));
    expect(screen.getAllByRole("article")).toHaveLength(4);
  });
  it("ordena e oculta aplicações inativas", () => {
    const apps = initialApplications.map((app) => ({ ...app }));
    apps[0].active = false;
    apps[3].order = 1;
    expect(selectApplications(apps, "", "Todas").map((app) => app.id)).toEqual([
      "contas",
      "cadastro-itens",
      "bugs",
    ]);
  });
});
describe("Painel de demonstração", () => {
  it("valida, adiciona, edita, alterna status e confirma exclusão", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(
      screen.getByRole("button", { name: /Área administrativa/ }),
    );
    expect(screen.getByText(/Protótipo público/)).toBeVisible();
    await user.click(
      screen.getByRole("button", { name: "Adicionar aplicação" }),
    );
    await user.click(screen.getByRole("button", { name: "Salvar aplicação" }));
    expect(screen.getByText("Informe o nome da aplicação.")).toBeVisible();
    await user.type(screen.getByLabelText("Nome *"), "Nova ferramenta");
    await user.type(screen.getByLabelText("Descrição *"), "Descrição de teste");
    await user.type(
      screen.getByLabelText("URL da aplicação"),
      "javascript:alert(1)",
    );
    await user.click(screen.getByRole("button", { name: "Salvar aplicação" }));
    expect(screen.getByText(/Informe uma URL completa/)).toBeVisible();
    await user.clear(screen.getByLabelText("URL da aplicação"));
    await user.click(screen.getByRole("button", { name: "Salvar aplicação" }));
    expect(screen.getByText("Nova ferramenta")).toBeVisible();
    await user.click(
      screen.getByRole("button", { name: "Editar Nova ferramenta" }),
    );
    await user.clear(screen.getByLabelText("Nome *"));
    await user.type(screen.getByLabelText("Nome *"), "Ferramenta editada");
    await user.click(screen.getByRole("button", { name: "Salvar aplicação" }));
    await user.click(
      screen.getByRole("button", { name: "Desativar Ferramenta editada" }),
    );
    expect(
      screen.getByRole("button", { name: "Ativar Ferramenta editada" }),
    ).toHaveAttribute("aria-pressed", "false");
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
    await user.click(
      screen.getByRole("button", { name: "Excluir Ferramenta editada" }),
    );
    expect(screen.getByText("Ferramenta editada")).toBeVisible();
    confirm.mockReturnValue(true);
    await user.click(
      screen.getByRole("button", { name: "Excluir Ferramenta editada" }),
    );
    expect(screen.queryByText("Ferramenta editada")).not.toBeInTheDocument();
    confirm.mockRestore();
  });
  it("reflete alterações no catálogo e restaura os dados ao remontar", async () => {
    const user = userEvent.setup();
    const view = render(<App />);
    await user.click(
      screen.getByRole("button", { name: /Área administrativa/ }),
    );
    await user.click(
      screen.getByRole("button", { name: "Desativar Cadastro de Itens" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Voltar ao catálogo" }),
    );
    expect(screen.getAllByRole("article")).toHaveLength(3);
    view.unmount();
    render(<App />);
    expect(screen.getAllByRole("article")).toHaveLength(4);
  });
});
it("aceita somente URLs HTTP(S) completas sem credenciais", () => {
  expect(isSafeUrl("")).toBe(true);
  expect(isSafeUrl("https://example.com/app")).toBe(true);
  for (const value of [
    "javascript:alert(1)",
    "data:text/html,test",
    "/relativo",
    "https://user:pass@example.com",
  ])
    expect(isSafeUrl(value)).toBe(false);
});
