import { BRANCHES, DAIG, DAIG_NOTES, INSTAGRAM, PHONE_DISPLAY, PHONE_TEL, WHATSAPP } from "@/lib/brand";
import { PriceTable } from "./MenuSection";

export function DaigSection() {
  return (
    <section id="daig" aria-labelledby="daig-title" className="ajrak relative z-10 overflow-hidden px-5 py-24 md:px-14 md:py-32 lg:px-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/80 via-black/55 to-brand-red/40" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow mb-4 !text-ivory/80">Family dinners · daawats · office lunches</p>
          <h2 id="daig-title" className="display text-[clamp(3.4rem,8vw,7.6rem)]">
            <span className="pop-white block -rotate-3">Poori daig,</span>
            <span className="pop block rotate-1">poora tabbar!</span>
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ivory/90">
            <strong className="text-ivory">Mini Daig</strong> — traditional biryani, pulao and karahi for 4–6 people to enjoy
            together. Reserve yours in advance.
          </p>
          <ul className="mt-8 space-y-2.5 text-sm leading-relaxed text-ivory/85">
            {DAIG_NOTES.map((n) => (
              <li key={n} className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rotate-45 bg-yellow" aria-hidden="true" />
                {n}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={PHONE_TEL} className="btn btn-yellow">
              Book: {PHONE_DISPLAY}
            </a>
            <a
              href={`${WHATSAPP}?text=${encodeURIComponent("Assalam o Alaikum, I'd like to book a Mini Daig.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-white"
            >
              WhatsApp
            </a>
          </div>
        </div>
        <div className="relative rotate-1 rounded-3xl border-[3px] border-black bg-ivory p-6 shadow-[8px_8px_0_#000] md:p-9">
          <span className="display absolute -top-5 left-6 -rotate-3 rounded-full border-[2.5px] border-black bg-brand-red px-4 py-1 text-xl text-yellow shadow-[3px_3px_0_#000]">
            Mini Daig Menu
          </span>
          <PriceTable table={DAIG} dark />
        </div>
      </div>
    </section>
  );
}

const PinIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
const PhoneIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </svg>
);
const WhatsAppIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.79h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.75.98 1-3.65-.23-.37A9.86 9.86 0 0 1 2.16 12C2.16 6.55 6.6 2.12 12.06 2.12a9.82 9.82 0 0 1 9.88 9.89c0 5.45-4.44 9.78-9.89 9.78M20.47 3.49A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.47-8.42" />
  </svg>
);
const InstagramIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0m0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8m6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88" />
  </svg>
);

export function VisitSection() {
  return (
    <section
      id="visit"
      aria-labelledby="visit-title"
      className="relative z-10 overflow-hidden px-5 py-24 md:px-14 md:py-32 lg:px-20"
      // diagonal colour blocks, after the brand's menu cover
      style={{
        background:
          "linear-gradient(160deg, #4b0f50 0 26%, transparent 26%), linear-gradient(200deg, transparent 0 62%, #0b6b3a 62% 80%, transparent 80%), linear-gradient(160deg, transparent 0 74%, #c8000a 74%), #0b0807",
      }}
    >
      <div className="relative mx-auto max-w-7xl">
        <div id="order" className="scroll-mt-24">
          <p className="eyebrow mb-4 !text-ivory/80">Order · Dine in · Takeaway · Delivery</p>
          <h2 id="visit-title" className="display text-[clamp(3.6rem,9.5vw,9rem)]">
            <span className="pop-white block -rotate-2">Bhook lagi ae?</span>
            <span className="pop block rotate-1">Call karo!</span>
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <a
              href={PHONE_TEL}
              className="group flex -rotate-1 items-center justify-between rounded-3xl border-[3px] border-black bg-ivory p-7 text-black shadow-[7px_7px_0_#000] transition-transform hover:-translate-y-1 hover:rotate-0 md:p-9"
            >
              <span>
                <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-black/70">
                  <PhoneIcon /> Home delivery &amp; booking
                </span>
                <span className="display block text-[clamp(2.2rem,4.6vw,3.8rem)]">{PHONE_DISPLAY}</span>
              </span>
              <span className="display text-4xl transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
            </a>
            <a
              href={`${WHATSAPP}?text=${encodeURIComponent("Assalam o Alaikum, I'd like to place an order.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex rotate-1 items-center justify-between rounded-3xl border-[3px] border-black bg-yellow p-7 text-black shadow-[7px_7px_0_#000] transition-transform hover:-translate-y-1 hover:rotate-0 md:p-9"
            >
              <span>
                <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-black/70">
                  <WhatsAppIcon /> Order on WhatsApp
                </span>
                <span className="display block text-[clamp(2.2rem,4.6vw,3.8rem)]">Message karo</span>
              </span>
              <span className="display text-4xl transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className="mt-20 grid gap-5 md:grid-cols-2">
          {BRANCHES.map((b, i) => (
            <div
              key={b.name}
              className="rounded-3xl border-[3px] border-black bg-coal/85 p-7 shadow-[7px_7px_0_#000] md:p-9"
              style={{ rotate: `${i ? 0.8 : -0.8}deg` }}
            >
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-yellow">
                <PinIcon /> {b.name}
              </p>
              <address className="display pop-white not-italic text-[clamp(1.8rem,3.2vw,2.8rem)]">{b.address}</address>
              <a href={b.maps} target="_blank" rel="noopener noreferrer" className="btn btn-yellow mt-6 !py-2 !text-sm">
                Get directions <span aria-hidden="true">↗</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 bg-coal">
      <div aria-hidden="true" className="h-14 border-y-[3px] border-black bg-[url(/ornaments/strip.webp)] bg-[length:auto_100%] bg-repeat-x md:h-20" />
      <div className="px-5 py-12 md:px-14 md:py-16 lg:px-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo.webp" alt="Nalli Pur — Biryani & Pulao" width={867} height={384} loading="lazy" className="h-16 w-auto md:h-20" />
            <p className="display pop mt-5 max-w-xs -rotate-1 text-2xl">Authentic Karachi taste you&rsquo;ll never forget.</p>
          </div>
          {/* the Urdu wordmark as the page's sign-off */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/urdu-wordmark.webp"
            alt="نلی پور"
            lang="ur"
            width={1000}
            height={691}
            loading="lazy"
            className="order-first mx-auto h-auto w-[min(78vw,22rem)] -rotate-3 transition-transform duration-300 hover:rotate-0 hover:scale-105 lg:order-none lg:w-[clamp(20rem,27vw,26rem)]"
          />
          <div className="flex flex-col gap-3 text-sm text-ivory-dim lg:items-end">
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-ivory">
              <InstagramIcon /> @nallipurbiryanipulao
            </a>
            <a href={PHONE_TEL} className="hover:text-ivory">
              {PHONE_DISPLAY}
            </a>
            <p>© {new Date().getFullYear()} Nalli Pur — Biryani &amp; Pulao, Lahore</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
