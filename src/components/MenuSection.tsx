"use client";

import { useEffect, useRef, useState } from "react";
import { MENU, type MenuTable } from "@/lib/brand";
import { UrduMark } from "./Poster";

/** One menu board: yellow poster heading, dotted leaders, prices in yellow. */
export function PriceTable({ table, dark = false }: { table: MenuTable; dark?: boolean }) {
  const multi = table.columns.length > 1;
  const ink = dark ? "text-black" : "text-ivory";
  const sub = dark ? "text-black/60" : "text-ivory/70";
  const price = dark ? "text-brand-red" : "text-yellow";
  return (
    <div className="break-inside-avoid">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <h3 className={`display ${dark ? "text-black" : "pop"} text-[clamp(1.6rem,2.6vw,2.3rem)]`}>
          {table.title}
          {table.subtitle && (
            <span className={`ml-2 align-middle font-[family-name:var(--font-body)] text-xs font-semibold normal-case tracking-normal ${sub}`}>
              ({table.subtitle})
            </span>
          )}
        </h3>
        {multi && (
          <div className="hidden shrink-0 gap-2 sm:flex" aria-hidden="true">
            {table.columns.map((c) => (
              <span
                key={c}
                className={`w-16 rounded-full border-2 border-black py-0.5 text-center text-[0.6rem] font-semibold uppercase tracking-wider ${
                  dark ? "bg-yellow text-black" : "bg-ivory text-black"
                }`}
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
      <table className="w-full border-collapse">
        <caption className="sr-only">
          {table.title} — prices in PKR{multi ? ` by ${table.columns.join(", ")}` : ""}
        </caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Item</th>
            {table.columns.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.name} className="group align-baseline">
              <th scope="row" className="py-2 pr-2 text-left font-normal">
                <span className="flex items-baseline">
                  <span className={`text-[0.98rem] font-medium ${ink} transition-transform group-hover:translate-x-1`}>{row.name}</span>
                  {row.note && <span className={`ml-2 hidden text-xs md:inline ${sub}`}>· {row.note}</span>}
                  <span className="leader" aria-hidden="true" />
                </span>
                {row.note && <span className={`block text-xs md:hidden ${sub}`}>{row.note}</span>}
                {multi && (
                  <span className={`mt-1 flex flex-wrap gap-3 text-xs sm:hidden ${sub}`} aria-hidden="true">
                    {row.prices.map((p, i) =>
                      p ? (
                        <span key={i}>
                          {table.columns[i]} <span className={`font-semibold ${price}`}>{p}</span>
                        </span>
                      ) : null
                    )}
                  </span>
                )}
              </th>
              {row.prices.map((p, i) => (
                <td
                  key={i}
                  className={`w-16 py-2 text-center font-[family-name:var(--font-display)] text-lg tabular-nums ${price} ${
                    multi ? "hidden pl-2 sm:table-cell" : "text-right"
                  }`}
                >
                  {p ?? <span className="opacity-30">—</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MenuSection() {
  const [tab, setTab] = useState(MENU[0].id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // links elsewhere on the page (e.g. "Explore Nalli Biryani") pre-select a tab
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("[data-menu-tab]") as HTMLElement | null;
      if (a?.dataset.menuTab) setTab(a.dataset.menuTab);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const n = (i + dir + MENU.length) % MENU.length;
    setTab(MENU[n].id);
    tabRefs.current[n]?.focus();
  };

  const current = MENU.find((m) => m.id === tab)!;

  return (
    <section
      id="menu"
      aria-labelledby="menu-title"
      className="relative z-10 overflow-hidden px-5 pb-28 pt-28 md:px-14 md:pt-36 lg:px-20"
      // the brand's own menu board: red and green split on a diagonal
      style={{ background: "linear-gradient(115deg, #a8000a 0%, #c8000a 49.9%, #0b6b3a 50%, #085a30 100%)" }}
    >
      <div className="ajrak pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-multiply" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="eyebrow mb-3 !text-ivory/80">Authentic Karachi nalli biryani &amp; pulao</p>
            <h2 id="menu-title" className="display text-[clamp(3.6rem,10vw,9rem)]">
              <span className="pop-white inline-block -rotate-2">Asli tay</span>{" "}
              <span className="pop inline-block rotate-1">nasli!</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span aria-hidden="true" className="-rotate-6">
              <UrduMark text="مینو" className="text-7xl md:text-8xl" />
            </span>
            <p className="max-w-[16rem] text-sm leading-relaxed text-ivory/85">
              Prices in PKR as listed on our menu. They may change — please confirm when you order.
            </p>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Menu categories"
          className="-mx-5 mb-10 flex gap-2.5 overflow-x-auto px-5 pb-3 pt-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0"
        >
          {MENU.map((m, i) => (
            <button
              key={m.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`tab-${m.id}`}
              type="button"
              aria-selected={tab === m.id}
              aria-controls={`panel-${m.id}`}
              tabIndex={tab === m.id ? 0 : -1}
              onClick={() => setTab(m.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={`shrink-0 rounded-full border-[2.5px] border-black px-5 py-2.5 font-[family-name:var(--font-display)] text-base uppercase tracking-wide transition-transform duration-200 ${
                tab === m.id
                  ? "-rotate-2 bg-yellow text-black shadow-[4px_4px_0_#000]"
                  : "bg-ivory text-black hover:-translate-y-0.5 hover:rotate-1"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div
          id={`panel-${current.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${current.id}`}
          key={current.id}
          className="animate-[fadeUp_.45s_cubic-bezier(.34,1.56,.64,1)]"
        >
          <div className={`grid gap-6 ${current.tables.length > 1 ? "lg:grid-cols-2" : "lg:max-w-3xl"}`}>
            {current.tables.map((t, i) => (
              <div
                key={t.title}
                className="rounded-3xl border-[2.5px] border-black bg-black/45 p-6 shadow-[6px_6px_0_#000] md:p-8"
                style={{ rotate: `${i % 2 ? 0.6 : -0.6}deg` }}
              >
                <PriceTable table={t} />
              </div>
            ))}
          </div>
          {current.footnote && <p className="mt-8 text-sm text-ivory/85">{current.footnote}</p>}
        </div>
      </div>
    </section>
  );
}
