// ─── Showcase content ─────────────────────────────────────────────────────────
// Every number here is taken from the project's own README, CLAUDE.md or source
// (verified 2026-10-29). If a repo changes, update the value here, not the UI.

export type Layer = 'data' | 'model' | 'agent' | 'eval' | 'human' | 'infra';

export interface PipelineNode {
  id: string;
  label: string;
  tech: string;
  layer: Layer;
  what: string;
  why: string;
  tradeoff?: string;
  emits: string; // one line shown in the pipeline replay log
}

export interface Receipt {
  value: string;
  label: string;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean; // feedback / async paths
  bend?: number;    // curve offset for dashed edges; sign picks the side
}

export interface Diagram {
  lanes: string[];                          // one label per row, top to bottom
  pos: Record<string, [number, number]>;    // node id → [col, row]
  edges: DiagramEdge[];
}

export interface GalleryImage {
  src: string;
  w: number;
  h: number;
  caption: string;
  wide?: boolean; // span the full gallery width
}

export interface System {
  id: string;
  name: string;
  tagline: string;
  repo?: string;
  promptingWouldBe: string;
  thisDoes: string;
  nodes: PipelineNode[];
  receipts: Receipt[];
  decisions: { id: string; decision: string; rationale: string }[];
  stack: string[];
  diagram: Diagram;
  gallery: GalleryImage[];
  galleryNote?: string;
}

export const LAYER_STYLES: Record<Layer, { label: string; hex: string; dot: string; ring: string; chip: string }> = {
  data:  { hex: '#0ea5e9', label: 'Data',          dot: 'bg-sky-500',     ring: 'ring-sky-300',     chip: 'bg-sky-50 text-sky-700 border-sky-200' },
  model: { hex: '#a855f7', label: 'Model',         dot: 'bg-purple-500',  ring: 'ring-purple-300',  chip: 'bg-purple-50 text-purple-700 border-purple-200' },
  agent: { hex: '#6366f1', label: 'Agent / LLM',   dot: 'bg-indigo-500',  ring: 'ring-indigo-300',  chip: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  eval:  { hex: '#f59e0b', label: 'Eval / Guard',  dot: 'bg-amber-500',   ring: 'ring-amber-300',   chip: 'bg-amber-50 text-amber-800 border-amber-200' },
  human: { hex: '#10b981', label: 'Human gate',    dot: 'bg-emerald-500', ring: 'ring-emerald-300', chip: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  infra: { hex: '#64748b', label: 'Serving',       dot: 'bg-slate-500',   ring: 'ring-slate-300',   chip: 'bg-slate-50 text-slate-700 border-slate-200' },
};

// ─── How I build with AI ──────────────────────────────────────────────────────

export const BUILD_LOOP = [
  {
    step: 'Spec before code',
    detail:
      'Each system starts as a written spec and a CLAUDE.md that pins the architecture, run order and what is "done". The AI works inside that contract instead of inventing one.',
    evidence: 'TalentLens_Project_Spec.md · CLAUDE.md in TalentLens, CreditPulse and the thesis repo',
  },
  {
    step: 'AI-assisted build',
    detail:
      'Claude Code and Cursor write first drafts of modules, DAGs and tests. I decide the boundaries: schemas, service splits and what gets a queue. The model fills them in.',
    evidence: 'ADRs written by me, implementation paired with AI',
  },
  {
    step: 'Review every diff',
    detail:
      'Nothing merges because it ran once. Every change is read like a pull request: does it match the spec, does it touch the audit schema, is the number it prints real.',
    evidence: 'Commit history; "honest deployment" rule in the TalentLens README',
  },
  {
    step: 'Tests and evals',
    detail:
      'Deterministic code gets tests; model output gets an eval. Docu-Sync scores itself on 11 dimensions; CreditPulse ships 15 unit + 105 integration tests.',
    evidence: 'docu-sync/services/api/eval.py · CreditPulse/tests/',
  },
  {
    step: 'Guardrails and governance',
    detail:
      'Confidence scores, fairness gates, drift thresholds and structured outputs decide what reaches a user. A model is never the last step.',
    evidence: 'PSI 0.10 / 0.20 thresholds · Fairlearn gate · JSON schema + fallback',
  },
  {
    step: 'Human in the loop',
    detail:
      'A person approves the PR, overrides the risk score, or reviews the flagged case. That decision is logged and fed back into the next model.',
    evidence: 'audit.hitl_overrides → active-learning retrain at ≥ 50 labels',
  },
];

// ─── Systems ──────────────────────────────────────────────────────────────────

export const SYSTEMS: System[] = [
  {
    id: 'talentlens',
    name: 'TalentLens',
    tagline: 'Workforce-risk platform where an agent, a model and an HR reviewer share one audited state.',
    repo: 'https://github.com/Anshitaa/TalentLens',
    promptingWouldBe: 'Paste an employee table into a chat window and ask "who is likely to quit?"',
    thisDoes:
      'Streams 2M+ HR events into a 4-schema warehouse, scores every employee with an explainable model, audits it for bias and drift, and lets a ReAct agent answer questions using live SQL and policy retrieval. Every human override is logged and feeds the next retrain.',
    nodes: [
      {
        id: 'gen', label: 'Synthetic HRIS', tech: 'Python generator', layer: 'data',
        what: '85K employees and 2M+ HR events across 24 months, generated rather than downloaded.',
        why: 'A Kaggle CSV shows you can load data. Generating the event stream shows you can design one, and it gives the pipeline realistic volume to break on.',
        emits: 'generated 85,000 employees · 2M+ events · 24 months',
      },
      {
        id: 'stream', label: 'Kafka + Airflow', tech: '4 topics · 5 DAGs', layer: 'infra',
        what: 'Idempotent producer into 4 Kafka topics with 3 consumer groups; Airflow runs ingestion, features, scoring, drift and HITL DAGs.',
        why: 'ADR-001: Kafka over direct DB writes. It gives fan-out to three consumers, replay on failure, and producers that do not need to know who reads them.',
        tradeoff: 'More moving parts than a cron job; justified only because three consumers need the same events.',
        emits: 'employee-events → risk-scores · audit-log · dashboard-feed',
      },
      {
        id: 'wh', label: 'Warehouse', tech: 'PostgreSQL + dbt', layer: 'data',
        what: 'raw → staging → mart → audit schemas; dim_employee as an SCD-2 dimension; 43,844 rows in mart.dim_employee.',
        why: 'The audit schema is separate so overrides and model decisions are immutable history, not columns someone can update.',
        emits: 'mart.dim_employee 43,844 rows · audit.* append-only',
      },
      {
        id: 'feat', label: 'Feature engineering', tech: 'PySpark', layer: 'data',
        what: '30/90/180-day rolling windows and peer percentiles via percent_rank() and ntile(4).',
        why: 'ADR-005: rolling windows over ~70M rows were too slow in single-node PostgreSQL.',
        emits: 'mart.feature_store written · rolling 30/90/180 · peer pct',
      },
      {
        id: 'score', label: 'Risk scoring', tech: 'XGBoost + Isolation Forest + SHAP', layer: 'model',
        what: 'Flight-risk classifier plus anomaly detector combined into a 0-100 Composite Risk Index, with the top 3 SHAP drivers attached to every score.',
        why: 'ADR-002: gradient boosting over neural nets. The data is tabular, and every HR decision needs an explanation for the person it affects.',
        emits: 'risk_index 0-100 + top-3 SHAP features per employee',
      },
      {
        id: 'gov', label: 'Governance', tech: 'MLflow · Fairlearn · PSI · Optuna', layer: 'eval',
        what: 'Every run tracked in MLflow; Fairlearn bias audit; PSI drift monitor with a 0.10 watch threshold and 0.20 retrain trigger.',
        why: 'A model that was fair and accurate at training time is not guaranteed to stay so. Drift has to be measured, not assumed.',
        emits: 'PSI < 0.10 ok · 0.10-0.20 monitor · > 0.20 retrain',
      },
      {
        id: 'hitl', label: 'Human-in-the-loop', tech: 'Active learning', layer: 'human',
        what: 'Employees in the 0.35-0.65 uncertainty band are sampled for review; overrides go to audit.hitl_overrides; ≥ 50 new labels triggers an Optuna retrain. 180 overrides seeded.',
        why: 'The model asks for help exactly where it is least sure, and the reviewer’s answer becomes training data instead of a lost Slack message.',
        emits: '200 uncertain cases queued · override logged · retrain at ≥ 50 labels',
      },
      {
        id: 'agent', label: 'ReAct agent', tech: 'LangGraph · FAISS RAG', layer: 'agent',
        what: 'Agent with 4 tools: query_risk_db, search_hr_policy, flag_for_review and generate_report. Policy RAG: 28 chunks, 384-dim all-MiniLM-L6-v2. Provider-agnostic: Gemini, Claude, GPT-4o or Ollama.',
        why: 'ADR-003: the RAG service is separate so 1-10s LLM latency never blocks sub-100ms risk scoring. flag_for_review means the agent escalates to a human rather than acting.',
        emits: 'tool: query_risk_db → search_hr_policy → flag_for_review',
      },
      {
        id: 'serve', label: 'API + dashboard', tech: 'FastAPI · React · K8s', layer: 'infra',
        what: '22 FastAPI routes with JWT and a WebSocket feed; 5-page React dashboard; 7 Docker services; Kubernetes manifests with KEDA autoscaling.',
        why: 'ADR-004: autoscale on Kafka consumer lag, not CPU. Lag is a leading indicator; CPU is a lagging one.',
        tradeoff: 'Runs on minikube. EKS is architected, not claimed.',
        emits: '22 routes · WebSocket live feed · KEDA scales on lag',
      },
    ],
    receipts: [
      { value: '2M+', label: 'HR events processed' },
      { value: '43,844', label: 'rows in mart.dim_employee' },
      { value: '22', label: 'API routes + WebSocket' },
      { value: '4', label: 'agent tools, incl. escalate-to-human' },
      { value: '180', label: 'HITL overrides seeded' },
      { value: '5', label: 'written ADRs' },
    ],
    decisions: [
      { id: 'ADR-001', decision: 'Kafka over direct DB writes', rationale: 'Fan-out to 3 consumers, replay on failure, decoupling.' },
      { id: 'ADR-002', decision: 'XGBoost over neural nets', rationale: 'Tabular data, and SHAP explanations are required for HR compliance.' },
      { id: 'ADR-003', decision: 'Separate RAG microservice', rationale: 'LLM latency (1-10s) must not block risk scoring (< 100ms).' },
      { id: 'ADR-004', decision: 'Autoscale on Kafka lag', rationale: 'Lag is a leading indicator; CPU is lagging.' },
      { id: 'ADR-005', decision: 'PySpark for batch features', rationale: 'Rolling windows over ~70M rows too slow in single-node Postgres.' },
      { id: 'FIX', decision: 'Removed 3 leaky features', rationale: 'Val AUC of 1.0 traced to peer features computed for active staff only; dropping them moved active-employee risk from ~0% to a real spread.' },
    ],
    stack: ['Kafka', 'Airflow', 'PostgreSQL', 'dbt', 'PySpark', 'XGBoost', 'SHAP', 'MLflow', 'Fairlearn', 'Optuna', 'LangGraph', 'FAISS', 'FastAPI', 'React', 'Docker', 'Kubernetes', 'KEDA'],
    diagram: {
      lanes: ['Ingest', 'Store & features', 'Model & governance', 'Human & agent', 'Serve'],
      pos: { gen: [0, 0], stream: [1, 0], wh: [1, 1], feat: [2, 1], score: [2, 2], gov: [3, 2], hitl: [3, 3], agent: [1, 3], serve: [2, 4] },
      edges: [
        { from: 'gen', to: 'stream', label: '2M+ events' },
        { from: 'stream', to: 'wh', label: 'raw.*' },
        { from: 'wh', to: 'feat' },
        { from: 'feat', to: 'score', label: 'feature_store' },
        { from: 'score', to: 'gov', label: 'every run' },
        { from: 'gov', to: 'hitl', label: '0.35-0.65 band' },
        { from: 'hitl', to: 'score', label: 'retrain ≥ 50 labels', dashed: true, bend: -60 },
        { from: 'wh', to: 'agent', label: 'live SQL' },
        { from: 'agent', to: 'hitl', label: 'flag_for_review', dashed: true },
        { from: 'score', to: 'serve' },
        { from: 'agent', to: 'serve' },
      ],
    },
    gallery: [
      { src: '/systems/talentlens/dashboard.png', w: 1600, h: 1365, caption: 'Live dashboard after the leakage fix: 30,824 employees scored, 32 in the High band.' },
      { src: '/systems/talentlens/governance.png', w: 1600, h: 1365, caption: 'Governance: MLflow runs, PSI drift (0.025, stable) and the 180-row HITL override log.' },
      { src: '/systems/talentlens/risk-explorer.png', w: 1600, h: 1183, caption: 'Risk Explorer: every score ships with its top SHAP driver.' },
    ],
  },
  {
    id: 'docusync',
    name: 'Docu-Sync',
    tagline: 'Agentic pipeline that sees a UI change, finds the right docs, rewrites them and opens a pull request for a human to merge.',
    repo: 'https://github.com/Anshitaa/DocumentSync',
    promptingWouldBe: 'Upload two screenshots to a chatbot, ask it to "update my README", and copy-paste whatever comes back.',
    thisDoes:
      'Grounds a vision model with pixel-level SSIM, retrieves only the README sections that matter, forces structured JSON with a confidence score, opens a PR instead of writing to main, and scores its own output on 11 dimensions.',
    nodes: [
      {
        id: 'in', label: 'Before / after', tech: 'multipart upload', layer: 'data',
        what: 'Two screenshots enter through POST /detect-change.',
        why: 'A narrow, typed entry point. The pipeline never guesses what changed from text alone.',
        emits: 'POST /detect-change  old_image, new_image',
      },
      {
        id: 'ssim', label: 'SSIM diff', tech: 'OpenCV · scikit-image', layer: 'model',
        what: 'Structural similarity score plus Otsu-thresholded bounding boxes of the changed regions.',
        why: 'Fast, deterministic and precise about where. It gives the model numeric ground truth to be checked against.',
        tradeoff: 'Cannot tell a colour tweak from a layout rewrite. The next stage covers that.',
        emits: 'ssim 0.8542 · 1 changed region (x:100 y:200 80×30)',
      },
      {
        id: 'vision', label: 'Vision analysis', tech: 'Gemini 1.5 Flash', layer: 'agent',
        what: 'Multimodal call returns semantic_summary, changed_elements, change_type and severity.',
        why: 'SSIM says where, the model says what and why it matters. Each covers the other’s blind spot.',
        tradeoff: '+1-2s latency and one API call per detection; would need caching at volume.',
        emits: 'change_type: color · severity: minor · "Submit → Continue"',
      },
      {
        id: 'rag', label: 'Retrieve context', tech: 'text-embedding-004 · cosine', layer: 'agent',
        what: 'README chunked by markdown header, embedded, top-3 sections retrieved by cosine similarity. READMEs under 300 chars skip retrieval.',
        why: 'The naive readme[:500] always feeds the intro. A navbar change should see the Navigation section.',
        emits: 'rag_headings: ["UI Components"] · 2 chunks used',
      },
      {
        id: 'gen', label: 'Structured generation', tech: 'JSON schema', layer: 'agent',
        what: 'Model must return {documentation, confidence 0-1, reasoning}. Parser strips markdown fences; malformed output falls back to raw text instead of crashing.',
        why: 'Free text is not an interface. A schema lets the UI, the eval and the PR step each consume one field.',
        emits: 'confidence: 0.91 · reasoning attached',
      },
      {
        id: 'conf', label: 'Confidence gate', tech: '≥ 0.85 / ≥ 0.65', layer: 'eval',
        what: 'Every update is labelled High (≥ 0.85), Medium (≥ 0.65) or Low confidence, with the model’s reasoning shown next to it.',
        why: 'The reviewer should know how much to trust a change before reading it.',
        emits: 'label: High confidence',
      },
      {
        id: 'pr', label: 'Pull request', tech: 'PyGithub', layer: 'human',
        what: 'Creates a branch and opens a PR with the updated README. Nothing is committed to main.',
        why: 'The PR is the human-in-the-loop. Automation drafts; a person merges.',
        emits: 'PR #1 opened on branch docu-sync/auto-update',
      },
      {
        id: 'eval', label: 'Eval suite', tech: 'eval.py · 11 dimensions', layer: 'eval',
        what: '3 test cases (identical images, before→after, reversed) scored on 6 detection and 5 generation dimensions, including semantic quality, confidence validity and RAG use.',
        why: 'The identical-images case checks the system can say “nothing changed”. A pipeline that always finds something is broken.',
        emits: '3 cases × 11 dims scored → verdict',
      },
    ],
    receipts: [
      { value: '4', label: 'pipeline stages' },
      { value: '11', label: 'eval dimensions' },
      { value: '3', label: 'eval cases incl. a null case' },
      { value: 'top-3', label: 'retrieved README sections' },
      { value: '0-1', label: 'confidence on every output' },
      { value: '0', label: 'direct commits to main' },
    ],
    decisions: [
      { id: 'D1', decision: 'SSIM + vision, not one or the other', rationale: 'Pixel precision for where, semantic understanding for what.' },
      { id: 'D2', decision: 'RAG instead of the whole README', rationale: 'Ground generation in the section that actually changed.' },
      { id: 'D3', decision: 'Structured JSON, not free text', rationale: 'Machine-readable fields; graceful fallback on malformed output.' },
      { id: 'D4', decision: 'Open a PR, never push', rationale: 'A human approves every documentation change.' },
    ],
    stack: ['Python', 'Flask', 'OpenCV', 'scikit-image', 'Gemini 1.5 Flash', 'text-embedding-004', 'PyGithub', 'Docker'],
    diagram: {
      lanes: ['Input', 'Detect', 'Generate', 'Gate', 'Human'],
      pos: { in: [1, 0], ssim: [0, 1], vision: [2, 1], rag: [1, 2], gen: [2, 2], conf: [2, 3], eval: [0, 3], pr: [2, 4] },
      edges: [
        { from: 'in', to: 'ssim' },
        { from: 'in', to: 'vision' },
        { from: 'ssim', to: 'vision', label: 'boxes + score' },
        { from: 'vision', to: 'rag', label: 'change_summary' },
        { from: 'rag', to: 'gen', label: 'top-3 sections' },
        { from: 'gen', to: 'conf', label: 'JSON' },
        { from: 'conf', to: 'pr', label: 'branch + PR' },
        { from: 'eval', to: 'gen', label: 'scores 11 dims', dashed: true },
      ],
    },
    gallery: [
      { src: '/systems/docusync/ui.png', w: 1600, h: 1066, caption: 'The running app: detect, write and open a PR, or chain all three in one click.' },
      { src: '/systems/docusync/before.png', w: 1600, h: 1000, caption: 'Demo input: the UI before the change.' },
      { src: '/systems/docusync/after.png', w: 1600, h: 1000, caption: 'Demo input: the UI after. SSIM finds where, Gemini Vision says what.' },
    ],
  },
  {
    id: 'creditpulse',
    name: 'CreditPulse',
    tagline: 'Real-time fraud and credit-risk scoring where every decision carries an explanation, a counterfactual and a fairness check.',
    repo: 'https://github.com/Anshitaa/CreditPulse',
    promptingWouldBe: 'Ask an LLM whether a transaction "looks fraudulent".',
    thisDoes:
      'Scores streaming transactions with pre-computed features, routes them into FRAUD / REVIEW / CLEAR bands, generates the counterfactual a regulator would ask for, and gives analysts an agent that can only answer with tools and cited regulation.',
    nodes: [
      {
        id: 'tx', label: 'Transactions', tech: 'Kafka', layer: 'data',
        what: '150K synthetic transactions at a 12.5% fraud rate on transactions.raw; alerts published to alerts.fraud.',
        why: 'Fraud is an event-stream problem; scoring has to happen as the event arrives.',
        emits: 'transactions.raw → alerts.fraud',
      },
      {
        id: 'feat', label: 'Feature store', tech: 'PySpark · Feast · Redis', layer: 'data',
        what: 'Streaming velocity features materialised to a Feast online store in Redis, over a raw/staging/mart/audit warehouse.',
        why: 'Pre-computed features are what make sub-100ms p99 inference possible.',
        emits: 'velocity features → Redis online store',
      },
      {
        id: 'model', label: 'Scoring', tech: 'XGBoost · Isolation Forest · SHAP', layer: 'model',
        what: 'Fraud detector + anomaly detector + risk scorer; top-5 SHAP features per transaction. Probabilities are isotonic-calibrated (Brier 0.53 → 0.10). AUC 0.681 on synthetic data, 0.90+ on the IEEE-CIS real-data model.',
        why: 'Both AUCs are reported. The synthetic one is low, and saying so is the point.',
        emits: 'score → FRAUD > 75 · REVIEW 40-75 · CLEAR < 40',
      },
      {
        id: 'cf', label: 'Counterfactuals', tech: 'Dice-ML', layer: 'eval',
        what: '“Change X to Y to get a different decision”, plus a what-if simulator.',
        why: 'Adverse-action notices under FCRA §615(a) need a reason a person can act on, not a probability.',
        emits: 'counterfactual: amount ↓ → CLEAR',
      },
      {
        id: 'gov', label: 'Governance gate', tech: 'Fairlearn · PSI · MLflow', layer: 'eval',
        what: 'Demographic-parity gate across 3 protected groups (δ < 0.05); PSI alert above 0.2; SR 11-7 style model risk card.',
        why: 'Fairness is a release condition, not a slide.',
        emits: 'parity δ < 0.05 ✓ · PSI < 0.2 ✓',
      },
      {
        id: 'review', label: 'Analyst review', tech: 'REVIEW band', layer: 'human',
        what: 'The 40-75 band goes to a person instead of being auto-decided.',
        why: 'The model decides the easy cases and routes the ambiguous ones to someone accountable.',
        emits: 'REVIEW queue → analyst',
      },
      {
        id: 'agent', label: 'Analyst agent', tech: 'LangChain ReAct · FAISS', layer: 'agent',
        what: '5 tools (get_risk_summary, explain_decision, run_what_if, query_sql, search_regulations) over a FAISS index of 8 regulatory documents (FCRA, PCI DSS, SR 11-7, Reg E).',
        why: 'The agent answers from the database and the regulations, not from memory.',
        emits: 'tool: explain_decision → search_regulations',
      },
      {
        id: 'api', label: 'API + tests', tech: 'FastAPI · pytest', layer: 'infra',
        what: '16 routes with a WebSocket score feed; 15 unit + 105 integration tests including Kafka → Spark → Postgres end-to-end.',
        why: 'An ML system is software. It gets the same test discipline.',
        emits: '120 tests · ws://…/ws/scores',
      },
    ],
    receipts: [
      { value: '150K', label: 'transactions streamed' },
      { value: '0.90+', label: 'AUC on IEEE-CIS real data' },
      { value: '3', label: 'decision bands' },
      { value: '5', label: 'agent tools' },
      { value: '8', label: 'regulatory docs indexed' },
      { value: '120', label: 'unit + integration tests' },
    ],
    decisions: [
      { id: 'D1', decision: 'Feast + Redis online store', rationale: 'Feature lookup, not computation, on the hot path.' },
      { id: 'D2', decision: 'Three bands, not a binary', rationale: 'Ambiguous cases go to a human.' },
      { id: 'D3', decision: 'Counterfactuals per decision', rationale: 'Adverse-action reasons people can act on.' },
      { id: 'D4', decision: 'Report both AUCs', rationale: 'Honest about synthetic-data limits.' },
      { id: 'FIX', decision: 'Calibrated before banding', rationale: 'Class re-weighting put the mean fraud score at 79% vs a 12.5% base rate, flagging everything. Isotonic calibration + thresholds set by alert budget on validation data.' },
    ],
    stack: ['Kafka', 'PySpark', 'Feast', 'Redis', 'dbt', 'XGBoost', 'SHAP', 'Dice-ML', 'Fairlearn', 'MLflow', 'LangChain', 'FAISS', 'FastAPI', 'React', 'pytest'],
    diagram: {
      lanes: ['Stream', 'Score', 'Govern', 'Serve'],
      pos: { tx: [0, 0], feat: [1, 0], model: [1, 1], cf: [2, 1], gov: [0, 2], review: [2, 2], api: [1, 3], agent: [2, 3] },
      edges: [
        { from: 'tx', to: 'feat', label: 'transactions.raw' },
        { from: 'feat', to: 'model', label: 'Redis lookup' },
        { from: 'model', to: 'cf', label: 'per decision' },
        { from: 'model', to: 'gov', label: 'parity · PSI' },
        { from: 'model', to: 'review', label: 'score 40-75' },
        { from: 'model', to: 'api', label: 'FRAUD / CLEAR' },
        { from: 'agent', to: 'model', label: 'explain_decision', dashed: true, bend: -70 },
        { from: 'api', to: 'agent' },
      ],
    },
    gallery: [
      { src: '/systems/creditpulse/dashboard.png', w: 1600, h: 655, caption: '500 real transactions through the calibrated model: 82% CLEAR, 16% REVIEW, 1.4% FRAUD.' },
      { src: '/systems/creditpulse/governance.png', w: 1600, h: 1044, caption: 'Fairness gate passed on 3 groups (all Δ < 0.05); PSI drift by feature; MLflow model registry.' },
    ],
  },
  {
    id: 'thesis',
    name: 'M.S. Thesis',
    tagline: 'Do federal disaster declarations change birth rates? A causal pipeline, and the time I threw out my own first result.',
    promptingWouldBe: 'Regress births on a disaster dummy and report whatever is significant.',
    thisDoes:
      'Builds a county-month panel, estimates a temporal regression discontinuity at every declaration, corrects for multiple testing, and runs four validity checks. I rebuilt the outcome from scratch when the first version turned out to be measuring evacuation, not fertility.',
    nodes: [
      {
        id: 'src', label: 'Sources', tech: 'FEMA · SHELDUS · births · Census', layer: 'data',
        what: 'FEMA declarations, SHELDUS damage records, county-month births 2007-2024, age-specific population and an SES panel.',
        why: 'Declarations alone include events with no recorded damage; SHELDUS lets the analysis separate the two.',
        emits: 'declarations ⨝ births ⨝ population ⨝ SES  (FIPS × month)',
      },
      {
        id: 'den', label: 'Age-standardised GFR', tech: 'ASFR weights (Preston 2001)', layer: 'data',
        what: 'Each age group’s population is weighted by its national fertility rate before summing, producing log_gfr_adj.',
        why: 'V1 used a crude denominator. When disasters displace 20-29-year-olds, it shrinks and the birth rate appears to rise with no extra births. Fixed weights do not react to who left.',
        emits: 'outcome = log_gfr_adj',
      },
      {
        id: 'rdd', label: 'Temporal RDD', tech: 'statsmodels OLS', layer: 'model',
        what: 'Step and slope models around incidentBeginDate at windows of ±4 to ±20 months, per county-declaration pair.',
        why: 'The declaration date is a sharp cutoff; comparing just before to just after isolates the short-run effect.',
        emits: 'τ (level jump), δ (slope change) per pair × window',
      },
      {
        id: 'fdr', label: 'Multiple testing', tech: 'Benjamini-Hochberg', layer: 'eval',
        what: 'BH-FDR correction across thousands of estimates.',
        why: 'With 25K+ tests, some will be significant by chance. None survive at ±7 months in the observed spec, and that null is the finding.',
        emits: '0 BH-FDR significant at W±7 (observed) → national null holds',
      },
      {
        id: 'valid', label: 'Validity checks', tech: 'McCrary · CCT · dose-response', layer: 'eval',
        what: 'Density manipulation test, CCT optimal bandwidth, continuous damage treatment, and a SHELDUS damage-threshold filter.',
        why: 'An RDD is only as good as its assumptions. Each check attacks one.',
        emits: '4 validity checks passed',
      },
      {
        id: 'self', label: 'Self-audit: V1 → V3', tech: 'comparison run', layer: 'human',
        what: 'Re-ran everything on the corrected outcome. 30.4% of county estimates flipped sign; V1 vs V3 r = 0.666. Findings that did not survive were removed.',
        why: 'The most important result in the thesis is one I deleted. Catching it required checking my own pipeline the way a reviewer would.',
        emits: '30.4% sign flips · artifacts removed',
      },
      {
        id: 'imp', label: 'Imputation check', tech: 'observed vs imputed', layer: 'eval',
        what: 'Imputed panel extends coverage from 572 to 3,227 counties; estimates agree with observed at r = 0.996.',
        why: 'More coverage is only worth having if it does not change the answer.',
        emits: 'obs vs imputed r = 0.996',
      },
      {
        id: 'out', label: 'Findings', tech: 'heterogeneity by hazard & SES', layer: 'infra',
        what: 'There is no national effect after correction. Broken out by hazard and mapped by state, the picture splits: winter storms lower fertility by 3.52% (imputed), low-income counties take a 4.13pp larger hit, and ice storms push it up.',
        why: 'A null average can hide opposing mechanisms. Stratifying is how you find them.',
        emits: 'Winter Storm −3.52%* · income gap −4.13pp*',
      },
    ],
    receipts: [
      { value: '3,227', label: 'counties (imputed panel)' },
      { value: '25,531', label: 'county-declaration pairs' },
      { value: '2007-24', label: 'monthly births' },
      { value: '30.4%', label: 'estimates flipped by my fix' },
      { value: 'r = 0.996', label: 'observed vs imputed' },
      { value: '4', label: 'validity checks' },
    ],
    decisions: [
      { id: 'V3', decision: 'Age-standardised denominator', rationale: 'Remove the evacuation artifact from the outcome.' },
      { id: 'FDR', decision: 'Report the null', rationale: 'Multiple-testing correction before any headline.' },
      { id: 'CUT', decision: 'Delete results that did not replicate', rationale: 'Earthquake and Hurricane × Unemployment removed.' },
    ],
    stack: ['Python', 'pandas', 'statsmodels', 'R (flexCWM)', 'RDD', 'BH-FDR', 'Demography'],
    diagram: {
      lanes: ['Data', 'Outcome', 'Estimate', 'Check', 'Report'],
      pos: { src: [0, 0], den: [1, 1], rdd: [1, 2], fdr: [2, 2], imp: [0, 3], valid: [1, 3], self: [3, 1], out: [2, 4] },
      edges: [
        { from: 'src', to: 'den', label: 'FIPS × month' },
        { from: 'den', to: 'rdd', label: 'log_gfr_adj' },
        { from: 'rdd', to: 'fdr', label: '25K+ τ' },
        { from: 'rdd', to: 'imp' },
        { from: 'rdd', to: 'valid' },
        { from: 'self', to: 'den', label: 'rebuilt V1 → V3', dashed: true },
        { from: 'fdr', to: 'out' },
        { from: 'valid', to: 'out' },
      ],
    },
    gallery: [
      { src: '/systems/thesis/us-map-winter-storm.png', w: 1600, h: 698, wide: true, caption: 'Winter storm effect by state (±7 months, imputed). Red marks a decline; the Northern Plains and New England carry most of it.' },
      { src: '/systems/thesis/state-bins.png', w: 1581, h: 734, wide: true, caption: 'Where the effect concentrates, by state. Winter storms pull fertility down while severe ice storms push it up in a different set of states. Blue marks a decline here, gold a rise.' },
      { src: '/systems/thesis/heatmap.png', w: 1600, h: 1220, caption: 'Effect by hazard × window. Winter storms suppress; severe ice storms raise.' },
      { src: '/systems/thesis/v1-vs-v3.png', w: 1600, h: 673, caption: 'The self-audit: V1 vs V3 estimates, r = 0.666. Much of V1 was a denominator artifact.' },
      { src: '/systems/thesis/density-test.png', w: 1600, h: 569, caption: 'McCrary density test: no bunching at the cutoff.' },
      { src: '/systems/thesis/dose-response.png', w: 1600, h: 981, caption: 'Continuous treatment: effect size against recorded damage.' },
    ],
  },
];

// ─── The six primitives ───────────────────────────────────────────────────────

export const PRIMITIVES: { name: string; meaning: string; cells: Record<string, string> }[] = [
  {
    name: 'Retrieval', meaning: 'The model reads the right source, not its memory.',
    cells: { talentlens: 'FAISS over HR policy + live SQL tool', docusync: 'Top-3 README sections by cosine', creditpulse: 'FAISS over 8 regulations', thesis: 'FIPS × month joins across 5 sources' },
  },
  {
    name: 'State', meaning: 'Decisions persist and can be replayed.',
    cells: { talentlens: 'raw/staging/mart/audit + SCD-2', docusync: 'Branch per update', creditpulse: 'Feast online store + audit schema', thesis: 'Versioned V1 / V3 outputs' },
  },
  {
    name: 'Evaluation', meaning: 'Output is scored, not eyeballed.',
    cells: { talentlens: 'MLflow runs + PSI drift', docusync: '11-dimension eval.py', creditpulse: '120 tests + both AUCs', thesis: 'BH-FDR + 4 validity checks' },
  },
  {
    name: 'Guardrails', meaning: 'Rules decide what reaches a user.',
    cells: { talentlens: 'Fairlearn audit · retrain at PSI > 0.2', docusync: 'JSON schema + confidence label', creditpulse: 'Parity δ < 0.05 gate', thesis: 'Artifacts removed, not reported' },
  },
  {
    name: 'Human in the loop', meaning: 'A person owns the consequential step.',
    cells: { talentlens: 'Overrides → active-learning retrain', docusync: 'Human merges the PR', creditpulse: 'REVIEW band → analyst', thesis: 'Self-audit that rebuilt V1' },
  },
  {
    name: 'Reproducibility', meaning: 'Someone else can run it and get the same answer.',
    cells: { talentlens: 'docker compose up · 7 services', docusync: 'docker compose · OpenAPI spec', creditpulse: 'Compose + pytest suite', thesis: 'step0 → step9 scripts in order' },
  },
];
