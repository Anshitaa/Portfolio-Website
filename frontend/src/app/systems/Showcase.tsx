'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { BUILD_LOOP, LAYER_STYLES, PRIMITIVES, SYSTEMS, type GalleryImage, type Layer, type System } from './data';
import ArchitectureDiagram from './ArchitectureDiagram';

const STEP_MS = 900;

// ─── Pipeline diagram + replay ───────────────────────────────────────────────

function Pipeline({ system }: { system: System }) {
  const [selected, setSelected] = useState(system.nodes[0].id);
  const [running, setRunning] = useState(false);
  const [cursor, setCursor] = useState(-1); // index of the node the replay has reached
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [cursor]);

  const run = () => {
    if (timer.current) clearInterval(timer.current);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setCursor(system.nodes.length - 1);
      return;
    }
    setRunning(true);
    setCursor(0);
    setSelected(system.nodes[0].id);
    let i = 0;
    timer.current = setInterval(() => {
      i += 1;
      if (i >= system.nodes.length) {
        if (timer.current) clearInterval(timer.current);
        setRunning(false);
        return;
      }
      setCursor(i);
      setSelected(system.nodes[i].id);
    }, STEP_MS);
  };

  const node = system.nodes.find(n => n.id === selected) ?? system.nodes[0];
  const style = LAYER_STYLES[node.layer];

  return (
    <div className="space-y-6">
      {/* Diagram */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            System architecture · click any component
          </p>
          <button
            onClick={run}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-purple-700 disabled:opacity-60 transition-colors"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${running ? 'bg-emerald-400 animate-pulse' : 'bg-white'}`} />
            {running ? 'Running…' : cursor >= 0 ? 'Replay pipeline' : 'Run pipeline'}
          </button>
        </div>

        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <ArchitectureDiagram
            system={system}
            selected={selected}
            cursor={cursor}
            running={running}
            onSelect={setSelected}
          />
        </div>
        <p className="mt-2 text-[11px] text-gray-400 sm:hidden">Scroll sideways to see the whole system →</p>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
          {(Object.keys(LAYER_STYLES) as Layer[])
            .filter(l => system.nodes.some(n => n.layer === l))
            .map(l => (
              <span key={l} className="inline-flex items-center gap-1.5 text-[11px] text-gray-500">
                <span className={`h-2 w-2 rounded-full ${LAYER_STYLES[l].dot}`} />
                {LAYER_STYLES[l].label}
              </span>
            ))}
          <span className="inline-flex items-center gap-1.5 text-[11px] text-purple-600">
            <span className="w-4 border-t-2 border-dashed border-purple-400" />
            Feedback loop
          </span>
        </div>
      </div>

      <div className={`grid gap-6 ${cursor >= 0 ? 'lg:grid-cols-2' : ''}`}>
        {/* Detail panel */}
        <aside className="rounded-2xl border border-gray-200 bg-white p-6" aria-live="polite">
          <div className="flex items-center gap-3">
            <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${style.chip}`}>
              {style.label}
            </span>
            <p className="text-xs font-mono text-gray-500">{node.tech}</p>
          </div>
          <h4 className="mt-3 text-lg font-semibold text-gray-900">{node.label}</h4>
          <dl className={`mt-4 grid gap-4 text-sm ${cursor >= 0 ? '' : 'md:grid-cols-3'}`}>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">What it does</dt>
              <dd className="mt-1 text-gray-700 leading-relaxed">{node.what}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-purple-600">Why I built it this way</dt>
              <dd className="mt-1 text-gray-800 leading-relaxed">{node.why}</dd>
            </div>
            {node.tradeoff && (
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-amber-600">Tradeoff</dt>
                <dd className="mt-1 text-gray-700 leading-relaxed">{node.tradeoff}</dd>
              </div>
            )}
          </dl>
        </aside>

        {/* Replay log */}
        {cursor >= 0 && (
          <div>
            <div
              ref={logRef}
              className="max-h-72 overflow-y-auto rounded-2xl bg-gray-950 p-5 font-mono text-[11.5px] leading-relaxed"
            >
              {system.nodes.slice(0, cursor + 1).map((n, i) => (
                <div key={n.id} className="flex gap-2 animate-[fadeIn_.3s_ease-out]">
                  <span className="text-gray-600 shrink-0">[{String(i + 1).padStart(2, '0')}]</span>
                  <span className="text-purple-300 shrink-0">{n.label.toLowerCase().replace(/[^a-z0-9]+/g, '_')}</span>
                  <span className="text-gray-300">{n.emits}</span>
                </div>
              ))}
              {running && <span className="inline-block h-3 w-1.5 bg-gray-400 animate-pulse" />}
            </div>
            <p className="mt-2 text-[11px] text-gray-400">
              Replay of the documented pipeline. Values come from the repo&apos;s README and source, not a live call.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Real screenshots and outputs ────────────────────────────────────────────

function Gallery({ system }: { system: System }) {
  const [open, setOpen] = useState<GalleryImage | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (system.gallery.length === 0) {
    return system.galleryNote ? (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
        {system.galleryNote}
      </div>
    ) : null;
  }

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">
        From the real system · click to enlarge
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {system.gallery.map((img, i) => {
          const wide = i === 0 && system.gallery.length % 2 === 1;
          return (
          <figure key={img.src} className={wide ? 'sm:col-span-2' : ''}>
            <button
              onClick={() => setOpen(img)}
              className="block w-full overflow-hidden rounded-xl border border-gray-200 bg-white hover:border-purple-300 hover:shadow-md transition-all"
            >
              <Image src={img.src} alt={img.caption} width={img.w} height={img.h}
                className="w-full h-auto" sizes={wide ? '(min-width: 1024px) 1100px, 100vw' : '(min-width: 1024px) 560px, 100vw'} />
            </button>
            <figcaption className="mt-2 text-xs text-gray-500 leading-snug">{img.caption}</figcaption>
          </figure>
          );
        })}
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open.caption}
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-gray-950/85 p-4 backdrop-blur-sm"
        >
          <Image src={open.src} alt={open.caption} width={open.w} height={open.h}
            className="max-h-[85vh] w-auto rounded-lg bg-white object-contain" />
          <p className="text-sm text-gray-200 text-center max-w-2xl">{open.caption}</p>
          <button className="text-xs text-gray-400 hover:text-white">Close (Esc)</button>
        </div>
      )}
    </div>
  );
}

// ─── One system section ──────────────────────────────────────────────────────

function SystemSection({ system }: { system: System }) {
  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <p className="text-lg text-gray-700 leading-relaxed">{system.tagline}</p>
        {system.repo && (
          <a href={system.repo} target="_blank" rel="noopener noreferrer"
            className="mt-2 inline-block text-sm font-medium text-purple-600 hover:text-purple-800">
            View source on GitHub →
          </a>
        )}
      </div>

      {/* Prompting vs system */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Prompting would be</p>
          <p className="mt-2 text-gray-500 italic leading-relaxed">“{system.promptingWouldBe}”</p>
        </div>
        <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-600">This system does</p>
          <p className="mt-2 text-gray-800 leading-relaxed">{system.thisDoes}</p>
        </div>
      </div>

      <Pipeline key={system.id} system={system} />

      <Gallery key={`g-${system.id}`} system={system} />

      {/* Receipts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {system.receipts.map(r => (
          <div key={r.label} className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-2xl font-bold text-gray-900 tabular-nums tracking-tight">{r.value}</p>
            <p className="mt-1 text-xs text-gray-500 leading-snug">{r.label}</p>
          </div>
        ))}
      </div>

      {/* Decisions + stack */}
      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <p className="px-5 pt-5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Design decisions</p>
          <ul className="mt-3 divide-y divide-gray-100">
            {system.decisions.map(d => (
              <li key={d.id} className="px-5 py-3 flex gap-4 text-sm">
                <span className="font-mono text-xs text-purple-600 w-16 shrink-0 pt-0.5">{d.id}</span>
                <div>
                  <p className="font-medium text-gray-900">{d.decision}</p>
                  <p className="text-gray-500">{d.rationale}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Stack</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {system.stack.map(t => (
              <span key={t} className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Showcase() {
  const [active, setActive] = useState(SYSTEMS[0].id);
  const [loopStep, setLoopStep] = useState(0);
  const system = SYSTEMS.find(s => s.id === active) ?? SYSTEMS[0];

  return (
    <main className="min-h-screen bg-[#fafafa] text-gray-900">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <Link href="/" className="text-sm font-semibold tracking-tight hover:text-purple-600">
            Anshita <span className="text-purple-600">Bhardwaj</span>
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6 text-sm text-gray-600">
            <a href="#workflow" className="hidden sm:inline hover:text-purple-600">Workflow</a>
            <a href="#systems" className="hidden sm:inline hover:text-purple-600">Systems</a>
            <a href="#primitives" className="hidden sm:inline hover:text-purple-600">Primitives</a>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer"
              className="rounded-full bg-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-purple-700">
              Resume
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-14">
        <p className="text-sm font-medium text-purple-600">AI engineering · system design</p>
        <h1 className="mt-4 text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05] max-w-4xl">
          A prompt is a request.
          <br />
          <span className="text-purple-600">A workflow is a system.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-600 leading-relaxed">
          Three production-pattern AI systems and a causal-inference thesis, each built with retrieval,
          state, evaluation, guardrails and a human in the loop. Click into any stage to see what it does
          and why I built it that way.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#systems" className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700">
            Explore the systems
          </a>
          <a href="https://github.com/Anshitaa" target="_blank" rel="noopener noreferrer"
            className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 hover:border-purple-400">
            GitHub
          </a>
          <Link href="/#contact" className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 hover:border-purple-400">
            Get in touch
          </Link>
        </div>
      </section>

      {/* Build loop */}
      <section id="workflow" className="border-y border-gray-200 bg-white scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <p className="text-sm font-medium text-purple-600">How I build with AI</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">AI writes drafts. I own the system.</h2>

          <div className="mt-10 grid lg:grid-cols-[320px_1fr] gap-8">
            <ol className="relative space-y-1">
              {BUILD_LOOP.map((s, i) => (
                <li key={s.step}>
                  <button
                    onClick={() => setLoopStep(i)}
                    aria-pressed={loopStep === i}
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors
                      ${loopStep === i ? 'bg-purple-50 text-purple-900' : 'hover:bg-gray-50 text-gray-600'}`}
                  >
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold
                      ${loopStep === i ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium">{s.step}</span>
                  </button>
                </li>
              ))}
              <li className="px-3 pt-2 text-xs text-gray-400">↺ overrides and eval results feed the next build</li>
            </ol>
            <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-6 sm:p-8 self-start">
              <p className="font-mono text-xs text-purple-600">step {loopStep + 1} / {BUILD_LOOP.length}</p>
              <h3 className="mt-2 text-2xl font-semibold">{BUILD_LOOP[loopStep].step}</h3>
              <p className="mt-4 text-gray-700 leading-relaxed text-[17px]">{BUILD_LOOP[loopStep].detail}</p>
              <div className="mt-6 rounded-lg border border-gray-200 bg-white px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Evidence</p>
                <p className="mt-1 text-sm font-mono text-gray-700">{BUILD_LOOP[loopStep].evidence}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Systems */}
      <section id="systems" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 scroll-mt-16">
        <p className="text-sm font-medium text-purple-600">The systems</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">Drawn as they are built</h2>

        <div role="tablist" className="mt-8 flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {SYSTEMS.map(s => (
            <button
              key={s.id}
              role="tab"
              aria-selected={active === s.id}
              onClick={() => setActive(s.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors
                ${active === s.id ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <SystemSection system={system} />
        </div>
      </section>

      {/* Primitives matrix */}
      <section id="primitives" className="border-t border-gray-200 bg-white scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <p className="text-sm font-medium text-purple-600">What runs through all of them</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">Six primitives, with receipts</h2>
          <p className="mt-3 max-w-2xl text-gray-600">
            These are the parts that separate a system from a notebook. Each cell is a concrete thing in the code.
          </p>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-900 w-[200px]">Primitive</th>
                  {SYSTEMS.map(s => (
                    <th key={s.id} className="px-4 py-3 font-semibold text-gray-900">{s.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {PRIMITIVES.map(p => (
                  <tr key={p.name} className="align-top">
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{p.meaning}</p>
                    </td>
                    {SYSTEMS.map(s => (
                      <td key={s.id} className="px-4 py-3.5 text-gray-700">{p.cells[s.id]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Building something like this?</h2>
        <p className="mt-3 text-gray-600 max-w-xl mx-auto">
          I&apos;m looking for AI engineering, ML and data roles — especially in health. Happy to walk through any of these systems live.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/#contact" className="rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700">
            Contact me
          </Link>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer"
            className="rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 hover:border-purple-400">
            Download resume
          </a>
        </div>
      </section>
    </main>
  );
}
