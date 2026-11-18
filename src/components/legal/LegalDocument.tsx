import { useEffect, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type ListItem = string | { lead?: string | null; text: string };

export type LegalBlock =
  | { kind: "p"; lead?: string; text: string }
  | { kind: "sub"; text: string }
  | { kind: "list"; items: ListItem[] }
  | { kind: "table"; caption: string; columns: string[]; rows: string[][] };

export interface LegalSection {
  id: string;
  number: number;
  title: string;
  blocks: LegalBlock[];
}

export interface LegalDocumentData {
  title: string;
  lastUpdated: string;
  intro: LegalBlock[];
  notice?: { lead: string; text: string };
  sections: LegalSection[];
}

const LINK_RE = /(https?:\/\/[^\s,)]+[^\s,).]|[\w.+-]+@[\w-]+\.[\w.]+[\w])/g;

/** Turns URLs and e-mail addresses inside legal copy into links. */
const linkify = (text: string): ReactNode[] =>
  text.split(LINK_RE).map((part, i) => {
    if (i % 2 === 0) return part;
    const href = part.includes("@") && !part.startsWith("http") ? `mailto:${part}` : part;
    const external = href.startsWith("http");
    return (
      <a
        key={i}
        href={href}
        className="break-all text-primary underline decoration-primary/40 underline-offset-2 transition-colors hover:decoration-primary"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {part}
      </a>
    );
  });

const isAllCaps = (text: string) => {
  const letters = text.replace(/[^A-Za-z]/g, "");
  return letters.length > 40 && letters === letters.toUpperCase();
};

const Lead = ({ lead }: { lead?: string | null }) =>
  lead ? <strong className="font-semibold text-foreground">{/[.:?”]$/.test(lead) ? lead : `${lead}.`} </strong> : null;

const BlockView = ({ block }: { block: LegalBlock }) => {
  switch (block.kind) {
    case "sub":
      return <h3 className="pt-4 font-display text-base font-semibold text-foreground">{block.text}</h3>;
    case "list":
      return (
        <ul className="list-disc space-y-2.5 pl-5 marker:text-primary/70">
          {block.items.map((item, i) => (
            <li key={i} className="pl-1">
              {typeof item === "string" ? (
                linkify(item)
              ) : (
                <>
                  <Lead lead={item.lead} />
                  {linkify(item.text)}
                </>
              )}
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[560px] text-left text-sm">
            <caption className="border-b border-border bg-muted/30 px-4 py-2.5 text-left font-semibold text-foreground">
              {block.caption}
            </caption>
            <thead>
              <tr className="border-b border-border">
                {block.columns.map(c => (
                  <th key={c} scope="col" className="px-4 py-2.5 text-xs font-medium text-muted-foreground">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="border-b border-border/60 last:border-0">
                  {row.map((cell, c) => (
                    <td key={c} className={`px-4 py-3 align-top leading-6 ${c === 0 ? "font-medium text-foreground" : ""}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return (
        <p className={isAllCaps(block.text) ? "text-[13px] leading-6 tracking-[0.01em]" : undefined}>
          <Lead lead={block.lead} />
          {linkify(block.text)}
        </p>
      );
  }
};

const TableOfContents = ({
  sections,
  activeId,
  onNavigate,
}: {
  sections: LegalSection[];
  activeId: string;
  onNavigate?: () => void;
}) => (
  <ol className="space-y-0.5">
    {sections.map(s => {
      const active = s.id === activeId;
      return (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            onClick={onNavigate}
            aria-current={active ? "location" : undefined}
            className={`flex gap-3 rounded-lg px-3 py-1.5 text-sm transition-colors ${
              active ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            }`}
          >
            <span className={`w-5 shrink-0 tabular-nums ${active ? "text-primary" : "text-muted-foreground/70"}`}>{s.number}</span>
            <span className="min-w-0">{s.title}</span>
          </a>
        </li>
      );
    })}
  </ol>
);

/** Shared layout for long legal pages (Terms, Privacy): title, sticky contents, numbered sections. */
export const LegalDocument = ({ doc }: { doc: LegalDocumentData }) => {
  const { sections } = doc;
  const [activeId, setActiveId] = useState(sections[0].id);
  const [tocOpen, setTocOpen] = useState(false);

  useEffect(() => {
    document.title = `${doc.title} — PureNFT`;
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [doc.title]);

  useEffect(() => {
    setActiveId(sections[0].id);
    const els = sections.map(s => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -65% 0px" },
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const navLabel = `${doc.title} sections`;

  return (
    <div className="container mx-auto max-w-6xl px-4 pb-24 pt-12 md:pt-16">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold text-foreground md:text-5xl">{doc.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated <time className="tabular-nums text-foreground/80">{doc.lastUpdated}</time>
        </p>
      </div>

      <div className="mt-10 grid gap-10 border-t border-border pt-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
        <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto">
          <div className="rounded-2xl border border-border bg-card lg:hidden">
            <button
              type="button"
              onClick={() => setTocOpen(o => !o)}
              aria-expanded={tocOpen}
              aria-controls="legal-toc-mobile"
              className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-foreground"
            >
              Contents
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${tocOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
            {tocOpen && (
              <nav id="legal-toc-mobile" aria-label={navLabel} className="border-t border-border p-2">
                <TableOfContents sections={sections} activeId={activeId} onNavigate={() => setTocOpen(false)} />
              </nav>
            )}
          </div>

          <nav aria-label={navLabel} className="hidden lg:block">
            <p className="mb-3 px-3 text-sm font-semibold text-foreground">On this page</p>
            <TableOfContents sections={sections} activeId={activeId} />
          </nav>
        </aside>

        <article className="min-w-0 max-w-[72ch] text-[15px] leading-7 text-muted-foreground">
          <div className="space-y-5">
            {doc.intro.map((b, i) => (
              <BlockView key={i} block={b} />
            ))}
          </div>

          {doc.notice && (
            <div className="mt-8 rounded-2xl border border-primary/25 bg-primary/[0.06] p-5 md:p-6" role="note">
              <p className="font-display text-sm font-semibold text-foreground">{doc.notice.lead}</p>
              <p className="mt-2 text-[13px] leading-6 tracking-[0.01em]">{linkify(doc.notice.text)}</p>
            </div>
          )}

          <div className="mt-4">
            {sections.map(s => (
              <section
                key={s.id}
                id={s.id}
                aria-labelledby={`${s.id}-title`}
                className="scroll-mt-24 border-b border-border/60 py-10 last:border-0"
              >
                <h2 id={`${s.id}-title`} className="flex items-baseline gap-3 text-xl font-semibold text-foreground md:text-2xl">
                  <span className="text-base font-medium tabular-nums text-primary">{s.number}.</span>
                  <span>{s.title}</span>
                </h2>
                <div className="mt-5 space-y-5">
                  {s.blocks.map((b, i) => (
                    <BlockView key={i} block={b} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
};
