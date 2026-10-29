import { useId, useRef, useState } from "react";
import { ArrowLeft, Plus, Pencil, Trash2, X, FlaskConical } from "lucide-react";
import {
  categories,
  environments,
  iconNames,
  type Application,
} from "../types";
import { isSafeUrl } from "../services/catalog";
import { EnvironmentBadge } from "./ApplicationCard";

type Props = {
  apps: Application[];
  onChange: (apps: Application[]) => void;
  onBack: () => void;
};
const blank = (order: number): Application => ({
  id: "",
  name: "",
  description: "",
  url: "",
  category: "Gestão escolar",
  environment: "Demonstração",
  icon: "school",
  active: true,
  order,
});
const iconLabels = {
  school: "Escola",
  boxes: "Itens",
  bug: "Bug",
  users: "Pessoas",
};
export function AdminPanel({ apps, onChange, onBack }: Props) {
  const [editing, setEditing] = useState<Application | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLDivElement>(null);
  const id = useId();
  function open(app: Application) {
    setEditing({ ...app });
    setErrors({});
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      formRef.current?.querySelector("input")?.focus();
    });
  }
  function save(event: React.FormEvent) {
    event.preventDefault();
    if (!editing) return;
    const next: Record<string, string> = {};
    if (!editing.name.trim()) next.name = "Informe o nome da aplicação.";
    if (!editing.description.trim())
      next.description = "Informe uma descrição.";
    if (!isSafeUrl(editing.url.trim()))
      next.url =
        "Informe uma URL completa HTTP ou HTTPS, sem usuário ou senha.";
    if (!Number.isInteger(editing.order) || editing.order < 1)
      next.order = "Use um número inteiro maior que zero.";
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() =>
        formRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus(),
      );
      return;
    }
    const app = {
      ...editing,
      id: editing.id || crypto.randomUUID(),
      name: editing.name.trim(),
      description: editing.description.trim(),
      url: editing.url.trim(),
    };
    onChange(
      editing.id
        ? apps.map((item) => (item.id === app.id ? app : item))
        : [...apps, app],
    );
    setEditing(null);
    setMessage("Aplicação salva nesta sessão de demonstração.");
  }
  function remove(app: Application) {
    if (
      window.confirm(
        `Excluir “${app.name}” desta demonstração? Esta ação não pode ser desfeita nesta sessão.`,
      )
    ) {
      onChange(apps.filter((item) => item.id !== app.id));
      if (editing?.id === app.id) setEditing(null);
      setMessage("Aplicação excluída desta sessão.");
    }
  }
  function field(key: string) {
    return {
      id: `${id}-${key}`,
      "aria-invalid": Boolean(errors[key]),
      "aria-labelledby": `${id}-${key}-label`,
      "aria-describedby": errors[key] ? `${id}-${key}-error` : undefined,
    };
  }
  function error(key: string) {
    return (
      errors[key] && (
        <span className="field-error" id={`${id}-${key}-error`}>
          {errors[key]}
        </span>
      )
    );
  }
  return (
    <main id="main" className="container admin-main">
      <button className="text-button" onClick={onBack}>
        <ArrowLeft size={16} />
        Voltar ao catálogo
      </button>
      <div className="section-heading">
        <div>
          <span className="eyebrow">GERENCIAMENTO DO CATÁLOGO</span>
          <h1 tabIndex={-1}>Painel administrativo</h1>
          <p>Explore a gestão das aplicações em um ambiente de demonstração.</p>
        </div>
        <button
          className="primary-button"
          onClick={() =>
            open(blank(Math.max(0, ...apps.map((app) => app.order)) + 1))
          }
        >
          <Plus size={18} />
          Adicionar aplicação
        </button>
      </div>
      <div className="prototype-notice">
        <FlaskConical size={23} aria-hidden="true" />
        <div>
          <strong>Protótipo público · sem controle de acesso</strong>
          <p>
            Este painel não possui autenticação ou segurança administrativa. As
            alterações ficam apenas na memória desta aba e são perdidas ao
            recarregar. Não insira dados reais ou sensíveis.
          </p>
        </div>
      </div>
      <p role="status" className="status-message">
        {message}
      </p>
      <div className="admin-list">
        <div className="list-title">
          <h2>Aplicações cadastradas</h2>
          <span>{apps.length} aplicações</span>
        </div>
        {apps.length === 0 ? (
          <p className="empty-list">
            Nenhuma aplicação cadastrada. Adicione uma aplicação para começar.
          </p>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Aplicação</th>
                  <th scope="col">Ambiente</th>
                  <th scope="col">Status</th>
                  <th scope="col">Ordem</th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                {[...apps]
                  .sort((a, b) => a.order - b.order)
                  .map((app) => (
                    <tr key={app.id}>
                      <td>
                        <strong>{app.name}</strong>
                        <small>{app.category}</small>
                      </td>
                      <td>
                        <EnvironmentBadge value={app.environment} />
                      </td>
                      <td>
                        <button
                          className={`status-toggle ${app.active ? "is-active" : ""}`}
                          aria-label={`${app.active ? "Desativar" : "Ativar"} ${app.name}`}
                          aria-pressed={app.active}
                          onClick={() => {
                            onChange(
                              apps.map((item) =>
                                item.id === app.id
                                  ? { ...item, active: !item.active }
                                  : item,
                              ),
                            );
                            setMessage(`Status de ${app.name} atualizado.`);
                          }}
                        >
                          {app.active ? "Ativa" : "Inativa"}
                        </button>
                      </td>
                      <td>{app.order}</td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="icon-button"
                            aria-label={`Editar ${app.name}`}
                            onClick={() => open(app)}
                          >
                            <Pencil size={17} />
                          </button>
                          <button
                            className="icon-button danger"
                            aria-label={`Excluir ${app.name}`}
                            onClick={() => remove(app)}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {editing && (
        <div className="form-panel" ref={formRef}>
          <div className="list-title">
            <h2>{editing.id ? "Editar aplicação" : "Nova aplicação"}</h2>
            <button
              className="icon-button"
              aria-label="Fechar formulário"
              onClick={() => setEditing(null)}
            >
              <X size={20} />
            </button>
          </div>
          <form onSubmit={save} noValidate>
            <p className="form-help">
              Campos com * são obrigatórios. Deixe a URL vazia enquanto o link
              não estiver disponível.
            </p>
            <div className="form-grid">
              <label htmlFor={`${id}-name`}>
                <span id={`${id}-name-label`}> Nome * </span>
                <input
                  {...field("name")}
                  maxLength={100}
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                  required
                />
                {error("name")}
              </label>
              <label htmlFor={`${id}-url`}>
                <span id={`${id}-url-label`}> URL da aplicação </span>
                <input
                  {...field("url")}
                  type="url"
                  maxLength={2048}
                  placeholder="https://"
                  value={editing.url}
                  onChange={(e) =>
                    setEditing({ ...editing, url: e.target.value })
                  }
                />
                {error("url")}
              </label>
              <label className="full-width" htmlFor={`${id}-description`}>
                <span id={`${id}-description-label`}> Descrição * </span>
                <textarea
                  {...field("description")}
                  maxLength={300}
                  rows={3}
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  required
                />
                {error("description")}
              </label>
              <label>
                Categoria
                <select
                  value={editing.category}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      category: e.target.value as Application["category"],
                    })
                  }
                >
                  {categories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                Ambiente
                <select
                  value={editing.environment}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      environment: e.target.value as Application["environment"],
                    })
                  }
                >
                  {environments.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                Ícone
                <select
                  value={editing.icon}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      icon: e.target.value as Application["icon"],
                    })
                  }
                >
                  {iconNames.map((item) => (
                    <option key={item} value={item}>
                      {iconLabels[item]}
                    </option>
                  ))}
                </select>
              </label>
              <label htmlFor={`${id}-order`}>
                <span id={`${id}-order-label`}> Ordem de exibição * </span>
                <input
                  {...field("order")}
                  type="number"
                  min={1}
                  step={1}
                  value={Number.isNaN(editing.order) ? "" : editing.order}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      order:
                        e.target.value === "" ? NaN : Number(e.target.value),
                    })
                  }
                  required
                />
                {error("order")}
              </label>
              <label>
                Status
                <select
                  value={String(editing.active)}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      active: e.target.value === "true",
                    })
                  }
                >
                  <option value="true">Ativa</option>
                  <option value="false">Inativa</option>
                </select>
              </label>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setEditing(null)}
              >
                Cancelar
              </button>
              <button className="primary-button" type="submit">
                Salvar aplicação
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
