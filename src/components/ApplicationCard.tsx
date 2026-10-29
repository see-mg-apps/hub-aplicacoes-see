import { ArrowUpRight, Clock3 } from "lucide-react";
import type { Application } from "../types";
import { isSafeUrl } from "../services/catalog";
import { AppIcon } from "./AppIcon";
export function EnvironmentBadge({
  value,
}: {
  value: Application["environment"];
}) {
  return (
    <span
      className={`environment env-${value === "Produção" ? "production" : value === "Homologação" ? "staging" : "demo"}`}
    >
      <span />
      {value}
    </span>
  );
}
export function ApplicationCard({ app }: { app: Application }) {
  const available = Boolean(app.url) && isSafeUrl(app.url);
  return (
    <article className="app-card">
      <div className="card-top">
        <div className={`app-icon icon-${app.icon}`}>
          <AppIcon name={app.icon} />
        </div>
        <EnvironmentBadge value={app.environment} />
      </div>
      <span className="category-label">{app.category}</span>
      <h3>{app.name}</h3>
      <p>{app.description}</p>
      <div className="card-bottom">
        {available ? (
          <a
            className="access-button"
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Acessar ${app.name} (abre em nova aba)`}
          >
            Acessar aplicação
            <ArrowUpRight size={17} />
          </a>
        ) : (
          <>
            <button className="access-button" disabled>
              Acessar aplicação
              <ArrowUpRight size={17} />
            </button>
            <span className="coming-soon">
              <Clock3 size={13} aria-hidden="true" />
              Link disponível em breve
            </span>
          </>
        )}
      </div>
    </article>
  );
}
