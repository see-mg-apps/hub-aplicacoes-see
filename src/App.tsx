import { useState } from "react";
import {
  Grid2X2,
  LayoutGrid,
  Search,
  Settings2,
  X,
  Layers3,
} from "lucide-react";
import { categories } from "./types";
import { localCatalog, selectApplications } from "./services/catalog";
import { ApplicationCard } from "./components/ApplicationCard";
import { AdminPanel } from "./components/AdminPanel";
export default function App() {
  const [apps, setApps] = useState(localCatalog.load);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [admin, setAdmin] = useState(false);
  const visible = selectApplications(apps, query, category);
  function navigate(value: boolean) {
    setAdmin(value);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0 });
      document.querySelector<HTMLElement>("h1")?.focus();
    });
  }
  return (
    <>
      <a className="skip-link" href="#main">
        Pular para o conteúdo
      </a>
      <header>
        <div className="container header-inner">
          <button
            className="hub-brand"
            onClick={() => navigate(false)}
            aria-label="Hub de Aplicações — início"
          >
            <span className="hub-mark" aria-hidden="true">
              <Grid2X2 size={23} />
            </span>
            <span>
              <strong>Hub de Aplicações</strong>
              <small>Subsecretaria de Administração | SEE-MG</small>
            </span>
          </button>
          <button
            className={`admin-link ${admin ? "selected" : ""}`}
            onClick={() => navigate(!admin)}
          >
            <Settings2 size={17} />
            <span>{admin ? "Ver catálogo" : "Área administrativa"}</span>
            <span className="prototype-tag">Protótipo</span>
          </button>
        </div>
      </header>
      {admin ? (
        <AdminPanel
          apps={apps}
          onChange={setApps}
          onBack={() => navigate(false)}
        />
      ) : (
        <main id="main">
          <section
            className="container catalog"
            id="catalogo"
            aria-labelledby="catalog-title"
          >
            <div className="section-heading">
              <div>
                <h1 id="catalog-title" tabIndex={-1}>
                  Aplicações e ferramentas
                </h1>
                <p>
                  Acesse as soluções desenvolvidas para apoiar as atividades da
                  Subsecretaria de Administração.
                </p>
              </div>
              <span className="catalog-count">
                <LayoutGrid size={16} />
                {apps.filter((app) => app.active).length} aplicações no catálogo
              </span>
            </div>
            <div className="catalog-controls">
              <div className="search-box">
                <Search size={20} aria-hidden="true" />
                <label className="sr-only" htmlFor="search">
                  Pesquisar aplicações por nome ou descrição
                </label>
                <input
                  id="search"
                  type="search"
                  placeholder="Qual aplicação você procura?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <button
                    className="icon-button"
                    aria-label="Limpar pesquisa"
                    onClick={() => setQuery("")}
                  >
                    <X size={17} />
                  </button>
                )}
              </div>
              <div
                className="filters"
                role="group"
                aria-label="Filtrar por categoria"
              >
                {["Todas", ...categories].map((item) => (
                  <button
                    key={item}
                    aria-pressed={category === item}
                    className={category === item ? "active" : ""}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <p className="result-count" role="status">
              {visible.length}{" "}
              {visible.length === 1
                ? "aplicação encontrada"
                : "aplicações encontradas"}
              {category !== "Todas" ? ` em ${category}` : ""}
            </p>
            <div className="app-grid">
              {visible.map((app) => (
                <ApplicationCard key={app.id} app={app} />
              ))}
            </div>
            {!visible.length && (
              <div className="empty-state">
                <Search size={30} />
                <h3>Nenhuma aplicação encontrada</h3>
                <p>Tente outro termo ou escolha uma categoria diferente.</p>
                <button
                  className="secondary-button"
                  onClick={() => {
                    setQuery("");
                    setCategory("Todas");
                  }}
                >
                  Limpar filtros
                </button>
              </div>
            )}
            <aside className="support-banner">
              <div className="support-icon">
                <Layers3 size={23} />
              </div>
              <div>
                <h3>Um hub em constante evolução</h3>
                <p>
                  Novas ferramentas e melhorias para apoiar o trabalho da nossa
                  equipe.
                </p>
              </div>
              <span className="development-tag">
                <span />
                Primeira versão · Demonstração
              </span>
            </aside>
            <p className="catalog-disclaimer">
              Catálogo demonstrativo com aplicações fictícias. Os links de
              acesso serão cadastrados posteriormente.
            </p>
          </section>
        </main>
      )}
      <footer>
        <div className="container footer-main">
          <div>
            <strong>
              Hub de Aplicações <span>SEE-MG</span>
            </strong>
            <p>Subsecretaria de Administração | SEE-MG</p>
          </div>
          <span className="footer-purpose">
            Soluções para apoiar a administração.
          </span>
        </div>
        <div className="container footer-bottom">
          <span>
            Subsecretaria de Administração · {new Date().getFullYear()}
          </span>
          <span>Interface em homologação · Dados demonstrativos</span>
        </div>
      </footer>
    </>
  );
}
