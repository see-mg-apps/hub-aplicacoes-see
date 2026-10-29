import { useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Grid2X2,
  LayoutGrid,
  Search,
  Settings2,
  ShieldCheck,
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
  const mainRef = useRef<HTMLDivElement>(null);
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
      <div className="government-bar">
        <div className="container">
          <span>GOVERNO DO ESTADO DE MINAS GERAIS</span>
          <span className="government-caption">Educação que transforma</span>
        </div>
      </div>
      <header>
        <div className="container header-inner">
          <button
            className="brand"
            onClick={() => navigate(false)}
            aria-label="SEE-MG — início"
          >
            <span className="brand-mark" aria-hidden="true">
              <span />
            </span>
            <span>
              <strong>
                SEE<span className="brand-mg"> / MG</span>
              </strong>
              <small>Secretaria de Estado de Educação</small>
            </span>
          </button>
          <span className="header-divider" />
          <span className="header-title">Hub de Aplicações</span>
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
          <section className="hero">
            <div className="container hero-inner">
              <div className="hero-copy">
                <span className="eyebrow">
                  <span className="tiny-line" /> TECNOLOGIA A SERVIÇO DA
                  EDUCAÇÃO
                </span>
                <h1 tabIndex={-1}>
                  Conectando ferramentas.
                  <br />
                  <span>Simplificando o dia a dia.</span>
                </h1>
                <p>
                  Um ponto de encontro para as aplicações da nossa equipe.
                  <br className="desktop-break" /> Encontre a ferramenta certa e
                  dê o próximo passo.
                </p>
                <a className="hero-link" href="#catalogo">
                  Explore as aplicações
                  <ArrowRight size={17} />
                </a>
              </div>
              <div className="hero-art" aria-hidden="true">
                <div className="orbit orbit-one" />
                <div className="orbit orbit-two" />
                <div className="art-tile tile-school">
                  <ShieldCheck size={31} />
                </div>
                <div className="art-tile tile-grid">
                  <Grid2X2 size={39} />
                </div>
                <div className="art-tile tile-layers">
                  <Layers3 size={29} />
                </div>
                <div className="art-caption">
                  <span />
                  Ferramentas que aproximam
                </div>
                <span className="art-dot dot-one" />
                <span className="art-dot dot-two" />
              </div>
            </div>
          </section>
          <section
            className="container catalog"
            id="catalogo"
            ref={mainRef}
            aria-labelledby="catalog-title"
          >
            <div className="section-heading">
              <div>
                <span className="eyebrow">SEU ESPAÇO DE TRABALHO</span>
                <h2 id="catalog-title">Explore nossas aplicações</h2>
                <p>Soluções para tornar a gestão mais simples e eficiente.</p>
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
            <p>Secretaria de Estado de Educação de Minas Gerais</p>
          </div>
          <span className="footer-purpose">
            Tecnologia para uma educação que transforma.
            <ArrowUpRight size={15} aria-hidden="true" />
          </span>
        </div>
        <div className="container footer-bottom">
          <span>Governo de Minas Gerais · {new Date().getFullYear()}</span>
          <span>Interface em homologação · Dados demonstrativos</span>
        </div>
      </footer>
    </>
  );
}
