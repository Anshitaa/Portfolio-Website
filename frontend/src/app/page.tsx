import { sanityClient } from '@/lib/sanity.client';
import { personalInfoQuery, publicationsQuery } from '@/lib/queries';
import Image from 'next/image';
import Link from 'next/link';
import NavBar from './components/NavBar';
import ContactForm from './components/ContactForm';

// ─── Type Definitions ────────────────────────────────────────────────────────

interface Publication {
  _id: string;
  title: string;
  authors: string;
  journal: string;
  year: string;
  doi?: string;
  status: string;
  abstract?: string;
}

// ─── Publication link map ─────────────────────────────────────────────────────

const PUBLICATION_LINKS: Record<string, string> = {
  "Reimagining CAPTCHA Security: A Case for Retiring Alphanumeric Text-Based CAPTCHAs":
    "https://drive.google.com/file/d/14fs1fwkJptnpICUDdoBbEXmEVgB9DUiM/view?usp=sharing",
  "Modeling the Spread of COVID-19 in Lombardy: Adaptation of the SEIQRS Mathematical Framework":
    "https://drive.google.com/file/d/1HoMtn74ZgIcbb1lmhK7G1BkI9YV6ZsRs/view?usp=sharing",
  "Artificial Intelligence Hallucinations Fueling Deepfake Threats: Detection and Prevention Approaches":
    "https://www.researchsquare.com/article/rs-6771530/v1",
};

function getPublicationLink(pub: Publication): string | null {
  return PUBLICATION_LINKS[pub.title] ?? (pub.doi ? `https://doi.org/${pub.doi}` : null);
}

// ─── Data Fetching ────────────────────────────────────────────────────────────

async function getData() {
  const [personalInfo, publications] = await Promise.all([
    sanityClient.fetch(personalInfoQuery),
    sanityClient.fetch(publicationsQuery),
  ]);
  return { personalInfo, publications };
}

// ─── Content (resume is the source of truth for dates and wording) ───────────

const FLAGSHIPS = [
  {
    id: 'talentlens',
    name: 'TalentLens',
    kind: 'Agentic ML platform',
    image: '/systems/talentlens/dashboard.png',
    summary:
      'Workforce-risk platform where a ReAct agent, an explainable model and an HR reviewer share one audited state.',
    decision:
      'Traced a perfect validation AUC to features computed for active staff only, removed them, and turned ~0% risk scores into a real spread.',
    metrics: [['2M+', 'HR events'], ['43,844', 'employees modelled'], ['180', 'reviewer overrides']],
    repo: 'https://github.com/Anshitaa/TalentLens',
  },
  {
    id: 'creditpulse',
    name: 'CreditPulse',
    kind: 'Real-time fraud scoring',
    image: '/systems/creditpulse/dashboard-card.png',
    summary:
      'Streaming fraud and credit-risk scoring where every decision carries SHAP reasons, a counterfactual and a fairness gate.',
    decision:
      'Calibrated a model that flagged every transaction; bands now set by alert budget (82% clear, 16% review, 2% block).',
    metrics: [['150K', 'transactions'], ['0.90+', 'AUC on real data'], ['120', 'tests']],
    repo: 'https://github.com/Anshitaa/CreditPulse',
  },
  {
    id: 'docusync',
    name: 'Docu-Sync',
    kind: 'Agentic docs pipeline',
    image: '/systems/docusync/ui.png',
    summary:
      'Sees a UI change, retrieves the right README sections, rewrites them as structured output and opens a pull request.',
    decision:
      'Grounded the vision model with pixel-level SSIM and kept a human merge as the gate: it never writes to main.',
    metrics: [['4', 'pipeline stages'], ['11', 'eval dimensions'], ['0', 'direct commits']],
    repo: 'https://github.com/Anshitaa/DocumentSync',
  },
];

const MORE_PROJECTS = [
  { title: 'Responsible AI for diabetic readmission', note: 'XGBoost with SHAP explanations and a Fairlearn bias audit', stack: 'XGBoost · SHAP · Fairlearn', url: 'https://github.com/Anshitaa/Responsible-AI-for-Predicting-Diabetic-Patient-Readmission' },
  { title: 'Real-time anomaly detection (MLOps)', note: 'LSTM autoencoder and Isolation Forest on streaming sensor data', stack: 'Kafka · Spark · Kubernetes', url: 'https://github.com/Anshitaa/End-to-End-MLOps-Pipeline-for-Real-Time-Anomaly-Detection' },
  { title: 'Full-stack LLM agent', note: 'RAG chatbot with live PDF ingestion and source attribution', stack: 'FastAPI · LangChain · React', url: 'https://github.com/Anshitaa/Full-Stack-LLM-Agent-with-a-Dynamic-Knowledge-Base' },
  { title: 'Streaming graph pipeline', note: 'Kafka into Neo4j with continuous PageRank in Kubernetes', stack: 'Kafka · Neo4j · Helm', url: 'https://github.com/Anshitaa/Real-Time-Streaming-Pipeline-Kafka-Neo4j-Kubernetes' },
  { title: 'NYC taxi hotspot analysis', note: 'Getis-Ord G* over a space-time grid at Spark scale', stack: 'Spark · Scala', url: 'https://github.com/Anshitaa/NYC-Taxi-Hotspot-Analysis-Spark-Scala' },
  { title: 'Geospatial query engine', note: 'Range and distance joins with custom Spark SQL UDFs', stack: 'Spark SQL · Scala', url: 'https://github.com/Anshitaa/Geospatial-Query-Engine-Apache-Spark-Scala' },
  { title: 'Database partitioning engine', note: 'Range and round-robin partitioning with trigger routing', stack: 'PostgreSQL · Python', url: 'https://github.com/Anshitaa/Database-Partitioning-PostgreSQL-Python' },
  { title: 'NYC taxi graph ETL', note: 'Parquet to property graph; BFS and PageRank on transit hubs', stack: 'Neo4j · Docker', url: 'https://github.com/Anshitaa/NYC-Taxi-Graph-ETL-Pipeline-Neo4j-Docker' },
];

const SKILL_GROUPS = [
  { area: 'Agentic AI and LLM systems', skills: 'LangChain and LangGraph ReAct agents, tool calling, structured outputs, RAG, FAISS, OpenAI, Gemini and Claude APIs', where: 'TalentLens · CreditPulse · Docu-Sync' },
  { area: 'Evaluation and guardrails', skills: 'Eval suites, confidence calibration, human-in-the-loop review, PSI drift, SHAP, Fairlearn', where: 'Docu-Sync · CreditPulse · TalentLens' },
  { area: 'ML and causal inference', skills: 'XGBoost, PyTorch, scikit-learn, Optuna, regression discontinuity, hypothesis testing', where: 'Thesis · TalentLens · CreditPulse' },
  { area: 'Data and infrastructure', skills: 'Python, SQL, Kafka, Spark, PostgreSQL and dbt, FastAPI, Docker, Kubernetes, MLflow, AWS', where: 'All three platforms' },
];

const EXPERIENCE = [
  {
    role: 'Research Assistant',
    org: 'Arizona State University',
    place: 'Tempe, AZ',
    dates: 'Feb 2024 – Present',
    points: [
      'Delivered a national study of whether federal disaster declarations change US birth rates over 1.5M+ birth records across 28 years, building automated Python pipelines that raised data granularity 200x.',
      'Caught an error in my own method, where the birth-rate measure was picking up shifts in county age makeup rather than real change, then rebuilt it on an age-standardized denominator, validated it at r = 0.996 and re-ran the study.',
    ],
  },
  {
    role: 'Data Analyst',
    org: 'Escorts Kubota Limited',
    place: 'Haryana, India',
    dates: 'Jun 2023 – Jun 2024',
    points: [
      'Cut inventory costs 10% and raised planning efficiency 25% across 50+ products with LSTM demand-forecasting models that operations teams ran daily in production.',
      'Improved forecast accuracy 18% with feature engineering pipelines, and cut equipment downtime 30% with a predictive-maintenance model.',
    ],
  },
  {
    role: 'Data Analyst Intern',
    org: 'JustDial Ltd.',
    place: 'Maharashtra, India',
    dates: 'Jun 2022 – Aug 2022',
    points: [
      'Reached 92% accuracy on 10,000+ unstructured reviews by fine-tuning a BERT model, and raised search relevance 15% with a TF-IDF retrieval pipeline.',
    ],
  },
];

const EMAIL_FALLBACK = 'anshita.inbox@gmail.com';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function Home() {
  const { personalInfo, publications } = await getData();
  const email = personalInfo?.email || EMAIL_FALLBACK;
  const github = personalInfo?.github || 'https://github.com/Anshitaa';
  const linkedin = personalInfo?.linkedin || 'https://www.linkedin.com/in/anshita--bhardwaj/';

  return (
    <div id="top" className="min-h-screen bg-[#fafafa] text-gray-900 antialiased">
      <NavBar />

      {/* ── Hero ── */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-14 grid md:grid-cols-[1fr_260px] lg:grid-cols-[1fr_300px] gap-10 items-center">
          <div>
            <p className="text-sm font-medium text-purple-600">AI engineer · ML systems · New York</p>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
              I build AI that ships as systems, <span className="text-purple-600">not prompts.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-gray-600 leading-relaxed">
              Retrieval, evaluation, guardrails and a human in the loop, in every project. Most recently a
              workforce-risk platform, a real-time fraud scorer and an agentic docs pipeline.
              M.S. Data Science, Arizona State University.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/systems" className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700">
                See the systems
              </Link>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer"
                className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 hover:border-purple-400">
                Resume
              </a>
              <span className="mx-1 hidden sm:inline h-5 w-px bg-gray-200" />
              <a href={github} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 hover:text-purple-600">GitHub</a>
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 hover:text-purple-600">LinkedIn</a>
              <a href={`mailto:${email}`} className="text-sm font-medium text-gray-600 hover:text-purple-600">Email</a>
            </div>
          </div>

          {personalInfo?.image && (
            <div className="relative mx-auto w-48 sm:w-56 md:w-full aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
              <Image
                src={personalInfo.image}
                alt={personalInfo.imageAlt || 'Anshita Bhardwaj'}
                fill
                sizes="(min-width: 1024px) 300px, (min-width: 768px) 260px, 224px"
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>

        {/* Proof strip */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            ['3', 'production-pattern AI systems'],
            ['25,531', 'causal estimates in my thesis'],
            [String(publications?.length || 5), 'research papers'],
            ['3', 'industry and research roles'],
          ].map(([value, label]) => (
            <div key={label} className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-2xl font-bold tabular-nums tracking-tight">{value}</p>
              <p className="mt-1 text-xs text-gray-500 leading-snug">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Flagship work ── */}
      <section id="work" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 scroll-mt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-purple-600">Selected work</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Three systems, built end to end</h2>
          </div>
          <Link href="/systems" className="text-sm font-semibold text-purple-600 hover:text-purple-800">
            Architecture walkthroughs →
          </Link>
        </div>

        <div className="mt-10 space-y-6">
          {FLAGSHIPS.map((p, i) => (
            <article key={p.id}
              className="grid lg:grid-cols-2 overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <Link href={`/systems#${p.id}`}
                className={`relative block min-h-64 aspect-[4/3] lg:aspect-auto bg-gray-950 ${i % 2 ? 'lg:order-2' : ''}`}
                aria-label={`${p.name} architecture walkthrough`}>
                <Image src={p.image} alt={`${p.name} running`} fill
                  className="object-cover object-left-top"
                  sizes="(min-width: 1024px) 560px, 100vw" />
              </Link>
              <div className="p-6 sm:p-8 flex flex-col">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{p.kind}</p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight">{p.name}</h3>
                <p className="mt-3 text-gray-600 leading-relaxed">{p.summary}</p>
                <div className="mt-5 border-l-2 border-purple-300 pl-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-600">Judgment call</p>
                  <p className="mt-1 text-sm text-gray-800 leading-relaxed">{p.decision}</p>
                </div>
                <dl className="mt-6 grid grid-cols-3 gap-3">
                  {p.metrics.map(([v, l]) => (
                    <div key={l}>
                      <dt className="sr-only">{l}</dt>
                      <dd className="text-xl font-bold tabular-nums tracking-tight">{v}</dd>
                      <dd className="text-xs text-gray-500">{l}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-auto pt-6 flex flex-wrap gap-4 text-sm font-semibold">
                  <Link href={`/systems#${p.id}`} className="text-purple-600 hover:text-purple-800">See the architecture →</Link>
                  <a href={p.repo} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">Source</a>
                </div>
              </div>
            </article>
          ))}

          {/* Thesis */}
          <article className="grid lg:grid-cols-2 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="p-6 sm:p-8 flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">M.S. thesis · causal inference</p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight">Do disasters change birth rates?</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                A temporal regression discontinuity at every FEMA declaration across US counties, 2007–2024,
                with multiple-testing correction and four validity checks.
              </p>
              <div className="mt-5 border-l-2 border-purple-300 pl-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-600">Judgment call</p>
                <p className="mt-1 text-sm text-gray-800 leading-relaxed">
                  Found my first outcome was measuring evacuation, not fertility. Rebuilt it on an age-standardised
                  denominator; 30.4% of estimates flipped sign.
                </p>
              </div>
              <dl className="mt-6 grid grid-cols-3 gap-3">
                {[['3,227', 'counties'], ['25,531', 'estimates'], ['r = 0.996', 'imputation check']].map(([v, l]) => (
                  <div key={l}>
                    <dt className="sr-only">{l}</dt>
                    <dd className="text-xl font-bold tabular-nums tracking-tight">{v}</dd>
                    <dd className="text-xs text-gray-500">{l}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-auto pt-6 text-sm font-semibold">
                <Link href="/systems#thesis" className="text-purple-600 hover:text-purple-800">See the pipeline →</Link>
              </div>
            </div>
            <Link href="/systems#thesis" className="block bg-white border-t lg:border-t-0 lg:border-l border-gray-200 p-4">
              <Image src="/systems/thesis/heatmap.png" alt="Effect of disaster declarations on fertility by hazard and window"
                width={1600} height={1220} className="w-full h-auto" sizes="(min-width: 1024px) 540px, 100vw" />
            </Link>
          </article>
        </div>

        {/* More projects */}
        <div className="mt-14">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">More projects</h3>
          <ul className="mt-4 grid md:grid-cols-2 gap-x-10 border-t border-gray-200">
            {MORE_PROJECTS.map(p => (
              <li key={p.url} className="border-b border-gray-200">
                <a href={p.url} target="_blank" rel="noopener noreferrer"
                  className="group flex items-start justify-between gap-4 py-4">
                  <span>
                    <span className="block font-semibold text-gray-900 group-hover:text-purple-600">{p.title}</span>
                    <span className="block text-sm text-gray-500">{p.note}</span>
                  </span>
                  <span className="shrink-0 pt-0.5 text-xs text-gray-400">{p.stack}</span>
                </a>
              </li>
            ))}
          </ul>
          <a href="https://github.com/Anshitaa?tab=repositories" target="_blank" rel="noopener noreferrer"
            className="mt-6 inline-block text-sm font-semibold text-gray-600 hover:text-purple-600">
            All repositories on GitHub →
          </a>
        </div>
      </section>

      {/* ── Skills, by where they were used ── */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <p className="text-sm font-medium text-purple-600">Toolkit</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">What I use, and where it shipped</h2>
          <div className="mt-10 divide-y divide-gray-200 border-y border-gray-200">
            {SKILL_GROUPS.map(g => (
              <div key={g.area} className="grid md:grid-cols-[220px_1fr_auto] gap-2 md:gap-8 py-5">
                <p className="font-semibold">{g.area}</p>
                <p className="text-gray-600 leading-relaxed">{g.skills}</p>
                <p className="text-sm text-purple-700 md:text-right md:whitespace-nowrap">{g.where}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Experience ── */}
      <section id="experience" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 scroll-mt-16">
        <p className="text-sm font-medium text-purple-600">Experience</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">Where I&apos;ve worked</h2>
        <div className="mt-10 space-y-4">
          {EXPERIENCE.map(e => (
            <div key={e.org} className="grid md:grid-cols-[240px_1fr] gap-3 md:gap-10 rounded-2xl border border-gray-200 bg-white p-6">
              <div>
                <p className="font-semibold">{e.role}</p>
                <p className="text-sm text-purple-700">{e.org}</p>
                <p className="mt-1 text-xs text-gray-500">{e.dates} · {e.place}</p>
              </div>
              <ul className="space-y-2">
                {e.points.map(pt => (
                  <li key={pt} className="flex gap-3 text-gray-700 leading-relaxed">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Research ── */}
      <section id="research" className="bg-white border-y border-gray-200 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <p className="text-sm font-medium text-purple-600">Research</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">Papers</h2>
          <ul className="mt-8 divide-y divide-gray-200 border-y border-gray-200">
            {publications?.map((pub: Publication) => {
              const link = getPublicationLink(pub);
              return (
                <li key={pub._id} className="grid sm:grid-cols-[70px_1fr_auto] gap-1 sm:gap-6 py-4 items-baseline">
                  <span className="text-sm tabular-nums text-gray-400">{pub.year}</span>
                  <span>
                    <span className="font-medium text-gray-900">{pub.title}</span>
                    {pub.journal && <span className="block text-sm text-gray-500 italic">{pub.journal}</span>}
                  </span>
                  {link ? (
                    <a href={link} target="_blank" rel="noopener noreferrer"
                      className="text-sm font-semibold text-purple-600 hover:text-purple-800">Read →</a>
                  ) : <span />}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 scroll-mt-16">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 items-start">
          <div>
            <p className="text-sm font-medium text-purple-600">Contact</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Building something like this?</h2>
            <p className="mt-4 text-gray-600 leading-relaxed max-w-md">
              I&apos;m looking for AI engineering, ML and data roles, especially in health. Happy to walk through
              any of these systems live.
            </p>
            <div className="mt-6 space-y-2 text-sm">
              <a href={`mailto:${email}`} className="block font-semibold text-gray-900 hover:text-purple-600">{email}</a>
              <p className="text-gray-500">New York, NY</p>
              <div className="flex gap-4 pt-2">
                <a href={github} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-600 hover:text-purple-600">GitHub</a>
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-600 hover:text-purple-600">LinkedIn</a>
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="font-medium text-gray-600 hover:text-purple-600">Resume</a>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Anshita Bhardwaj</p>
          <Link href="/systems" className="hover:text-gray-600">How these systems are built →</Link>
        </div>
      </footer>
    </div>
  );
}
