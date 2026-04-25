import { sanityClient } from '@/lib/sanity.client';
import { personalInfoQuery, experienceQuery, publicationsQuery } from '@/lib/queries';
import Image from 'next/image';
import NavBar from './components/NavBar';
import TypingAnimation from './components/TypingAnimation';
import ScrollAnimation from './components/ScrollAnimation';
import ContactForm from './components/ContactForm';

// ─── Type Definitions ────────────────────────────────────────────────────────

interface Experience {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  achievements: string[];
  skills: string[];
}

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

function getPublicationLink(pub: Publication): string | null {
  return PUBLICATION_LINKS[pub.title] ?? (pub.doi ? `https://doi.org/${pub.doi}` : null);
}

// ─── Data Fetching ────────────────────────────────────────────────────────────

async function getData() {
  const [personalInfo, experience, publications] = await Promise.all([
    sanityClient.fetch(personalInfoQuery),
    sanityClient.fetch(experienceQuery),
    sanityClient.fetch(publicationsQuery),
  ]);
  return { personalInfo, experience, publications };
}

// ─── Skill categories (static, curated) ──────────────────────────────────────

const SKILL_CATEGORIES = [
  {
    title: 'ML & AI',
    color: 'purple',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    skills: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'XGBoost', 'LSTM/GRU',
      'SHAP', 'Fairlearn', 'Explainable AI (XAI)', 'Time-Series Forecasting',
      'Causal Inference', 'A/B Testing', 'Statistical Modeling'],
  },
  {
    title: 'LLM & GenAI',
    color: 'indigo',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    skills: ['LangChain', 'RAG', 'Hugging Face Transformers', 'BERT',
      'Prompt Engineering', 'Fine-tuning', 'Vector Databases (FAISS)',
      'OpenAI API', 'Agentic AI'],
  },
  {
    title: 'MLOps, APIs & Infrastructure',
    color: 'violet',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
    skills: ['Apache Kafka', 'Apache Spark', 'Docker', 'Kubernetes',
      'FastAPI', 'Flask', 'REST API Design', 'Airflow', 'MLflow',
      'AWS (S3, Lambda)', 'CI/CD', 'ETL Pipelines', 'System Design'],
  },
  {
    title: 'Languages & Data',
    color: 'purple',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    skills: ['Python', 'SQL', 'JavaScript', 'C/C++',
      'PostgreSQL', 'MySQL', 'MongoDB',
      'Tableau', 'Power BI', 'Streamlit', 'Git', 'Linux'],
  },
];

// ─── GitHub repos (all fetched 2026-04) ──────────────────────────────────────

const GITHUB_PROJECTS = [
  // ── Featured (top row 3-col) ──────────────────────────────────────────────
  {
    title: 'TalentLens — AI-Powered Workforce Intelligence Platform',
    description:
      'End-to-end ML platform for HR risk analytics: synthetic 85K-employee dataset → Kafka → PostgreSQL/dbt → PySpark feature engineering → XGBoost + Isolation Forest composite risk index (0–100) with SHAP explainability. Includes MLflow governance, Fairlearn bias auditing, HITL active learning loop, LangChain ReAct agent with FAISS RAG, FastAPI (22 routes, JWT, WebSocket), React dashboard, and Kubernetes manifests (KEDA autoscaling on Kafka lag).',
    techStack: ['Python', 'PySpark', 'Kafka', 'XGBoost', 'SHAP', 'MLflow', 'LangChain', 'FastAPI', 'React', 'PostgreSQL', 'dbt', 'Docker', 'Kubernetes'],
    githubUrl: 'https://github.com/Anshitaa/TalentLens',
    featured: true,
  },
  {
    title: 'End-to-End MLOps Pipeline — Real-Time Anomaly Detection',
    description:
      'Production-grade MLOps system using LSTM autoencoders & Isolation Forest on live IoT sensor streams. Full Kafka → Spark → REST API → dashboard stack containerised with Docker & Kubernetes.',
    techStack: ['Python', 'TensorFlow', 'Kafka', 'Apache Spark', 'Docker', 'Kubernetes', 'Flask'],
    githubUrl: 'https://github.com/Anshitaa/End-to-End-MLOps-Pipeline-for-Real-Time-Anomaly-Detection',
    featured: true,
  },
  {
    title: 'Full-Stack LLM Agent with Dynamic Knowledge Base',
    description:
      'Production-ready RAG chatbot with FastAPI backend, React frontend, and drag-and-drop PDF ingestion. Real-time source attribution via LangChain + ChromaDB; deployable to AWS/GCP/Azure.',
    techStack: ['FastAPI', 'LangChain', 'React', 'ChromaDB', 'OpenAI', 'Docker'],
    githubUrl: 'https://github.com/Anshitaa/Full-Stack-LLM-Agent-with-a-Dynamic-Knowledge-Base',
    featured: true,
  },
  {
    title: 'Real-Time Streaming Pipeline — Kafka · Neo4j · Kubernetes',
    description:
      'Cloud-native streaming architecture that ingests live events via Kafka, routes them into a Neo4j graph database, and runs BFS & PageRank analytics continuously inside a Kubernetes cluster.',
    techStack: ['Kafka', 'Neo4j', 'Kubernetes', 'Python', 'Helm', 'Kafka Connect', 'Zookeeper'],
    githubUrl: 'https://github.com/Anshitaa/Real-Time-Streaming-Pipeline-Kafka-Neo4j-Kubernetes',
    featured: false,
  },
  // ── Other projects (2-col grid) ───────────────────────────────────────────
  {
    title: 'Responsible AI for Diabetic Patient Readmission',
    description:
      'XGBoost readmission predictor with SHAP explainability, Fairlearn bias auditing, and a Streamlit dashboard for clinical stakeholders.',
    techStack: ['Python', 'XGBoost', 'SHAP', 'Fairlearn', 'Streamlit'],
    githubUrl: 'https://github.com/Anshitaa/Responsible-AI-for-Predicting-Diabetic-Patient-Readmission',
    featured: false,
  },
  {
    title: 'LLM-Powered Document Intelligence Agent',
    description:
      'Enterprise RAG pipeline with persistent ChromaDB vector storage, HuggingFace sentence embeddings, and both Streamlit UI and CLI interfaces. 75% reduction in query answer-time.',
    techStack: ['Python', 'LangChain', 'ChromaDB', 'OpenAI', 'Streamlit', 'HuggingFace'],
    githubUrl: 'https://github.com/Anshitaa/Document-intelligence-agent',
    featured: false,
  },
  {
    title: 'NYC Taxi Hotspot Analysis — Spark & Scala',
    description:
      'Distributed hotspot detection on NYC Yellow Taxi data using the Getis-Ord G* statistic over a 3D (lon × lat × time) grid. Hot-zone range queries via Spark spatial joins.',
    techStack: ['Apache Spark', 'Scala', 'Spatial Statistics', 'RDD', 'DataFrame API'],
    githubUrl: 'https://github.com/Anshitaa/NYC-Taxi-Hotspot-Analysis-Spark-Scala',
    featured: false,
  },
  {
    title: 'NYC Taxi Graph ETL Pipeline — Neo4j & Docker',
    description:
      'End-to-end pipeline that ingests Parquet taxi data, models it as a property graph in Neo4j, then runs BFS and PageRank to surface the most central transit hubs across NYC boroughs.',
    techStack: ['Python', 'Neo4j', 'PyArrow', 'Pandas', 'Docker', 'Cypher', 'Graph Data Science'],
    githubUrl: 'https://github.com/Anshitaa/NYC-Taxi-Graph-ETL-Pipeline-Neo4j-Docker',
    featured: false,
  },
  {
    title: 'Geospatial Query Engine — Apache Spark & Scala',
    description:
      'Distributed spatial query engine (range, range-join, distance, distance-join) built on Spark SQL with custom geospatial UDFs — mimicking PostGIS at big-data scale.',
    techStack: ['Apache Spark', 'Scala', 'Spark SQL', 'Custom UDFs', 'Geospatial'],
    githubUrl: 'https://github.com/Anshitaa/Geospatial-Query-Engine-Apache-Spark-Scala',
    featured: false,
  },
  {
    title: 'Database Partitioning Engine — PostgreSQL & Python',
    description:
      'Implements horizontal range-based and round-robin partitioning in PostgreSQL with trigger-based routing, bulk CSV loading, and dynamic SQL generation — mirroring Hive/Redshift/Citus patterns.',
    techStack: ['Python', 'PostgreSQL', 'psycopg2', 'SQL', 'Database Engineering'],
    githubUrl: 'https://github.com/Anshitaa/Database-Partitioning-PostgreSQL-Python',
    featured: false,
  },
  {
    title: 'TikTok Shop ETL & Analytics Dashboard',
    description:
      'Simulated eCommerce ETL pipeline generating synthetic TikTok Shop orders, loading them into PostgreSQL, and visualising sales metrics through an interactive Streamlit dashboard.',
    techStack: ['Python', 'PostgreSQL', 'psycopg2', 'Streamlit', 'Faker'],
    githubUrl: 'https://github.com/Anshitaa/Tiktok-ETL-Project',
    featured: false,
  },
];

// Recruiter-friendly descriptions drawn directly from resume
const EXPERIENCE_DESCRIPTIONS: Record<string, string> = {
  'Arizona State University':
    'Engineered large-scale data pipelines processing a 1.5M+ record, 28-year longitudinal dataset — increasing data granularity 200× through automated validation frameworks, root cause analysis, and reproducible statistical workflows in Python and SQL. Applied Regression Discontinuity Design (RDD) causal inference models to quantify disaster impact on fertility outcomes, contributing to 3 peer-reviewed publications.',
  'Escorts Kubota Limited':
    'Deployed LSTM-based time-series forecasting models for 50+ product lines, improving production planning efficiency by 25% and reducing inventory costs by 10%. Boosted demand prediction accuracy by 18% by integrating internal sales APIs with external economic indicators through end-to-end feature engineering and preprocessing pipelines.',
  'Justdial Ltd.':
    'Built an NLP pipeline using BERT and VADER sentiment analysis achieving 92% classification accuracy on 10K+ customer reviews, enabling automated review tagging at scale. Implemented a TF-IDF keyword extraction pipeline that increased site search relevance by 15%, and delivered actionable findings to product stakeholders via Tableau dashboards.',
};

// Skills shown per company on the website (recruiter-friendly keywords)
const EXPERIENCE_SKILLS: Record<string, string[]> = {
  'Arizona State University': [
    'Python', 'SQL', 'Data Pipelines', 'Causal Inference', 'Statistical Modeling',
    'RDD', 'Reproducible Research', 'ETL', 'Root Cause Analysis',
  ],
  'Escorts Kubota Limited': [
    'Python', 'LSTM', 'Time-Series Forecasting', 'REST APIs', 'Feature Engineering',
    'Scikit-learn', 'Demand Forecasting', 'Manufacturing Analytics',
  ],
  'Justdial Ltd.': [
    'Python', 'BERT', 'NLP', 'VADER', 'TF-IDF', 'Sentiment Analysis',
    'Tableau', 'A/B Testing', 'Search Relevance',
  ],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function Home() {
  const { personalInfo, experience, publications } = await getData();

  const heroRoles = [
    'M.S. Data Science @ ASU',
    'Machine Learning Engineer',
    'AI Systems Developer',
    'Data Scientist',
  ];


  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
      {/* ── Navigation ── */}
      <NavBar name={personalInfo?.name || 'Anshita Bhardwaj'} />

      {/* ── Hero ── */}
      <section id="about" className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* subtle background grid like Omkar's site */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%237c3aed' fill-opacity='0.8'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}} />
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left — text */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Hi, I&apos;m{' '}
                  <span className="bg-gradient-to-r from-purple-600 to-violet-500 bg-clip-text text-transparent">
                    {personalInfo?.name || 'Anshita Bhardwaj'}
                  </span>
                </h1>
                <div className="text-xl sm:text-2xl text-gray-500 font-normal min-h-[2.5rem] flex items-center">
                  <TypingAnimation texts={heroRoles} className="text-purple-600 font-semibold" />
                </div>
              </div>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
                {personalInfo?.summary ||
                  'Data Science graduate student specializing in end-to-end AI systems — from RAG pipelines and LLM agents to MLOps, anomaly detection, and responsible AI. Currently at Arizona State University.'}
              </p>

              {/* Contact info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <a
                  href={`mailto:${personalInfo?.email || 'anshita.inbox@gmail.com'}`}
                  className="flex items-center gap-1.5 hover:text-purple-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {personalInfo?.email || 'anshita.inbox@gmail.com'}
                </a>
                <span className="hidden sm:inline text-gray-300">·</span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Tempe, AZ
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href={personalInfo?.github || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium rounded-xl transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </a>
                <a
                  href={personalInfo?.linkedin || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
                <a
                  href="https://drive.google.com/file/d/1CEeqCaLKfgnpCptHEH1NYL8wuPFkm-wh/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-purple-200 text-purple-600 hover:bg-purple-50 text-sm font-medium rounded-xl transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Resume
                </a>
              </div>
            </div>

            {/* Right — photo (Omkar-style: rotated bg + hover lift) */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-[340px] sm:w-[400px] lg:w-[440px]">
                {/* Rotated background rectangle */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-300/40 to-violet-300/40 rounded-2xl transform rotate-6 scale-105" />
                {/* Photo */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl hover:-translate-y-2 transition-transform duration-300">
                  {personalInfo?.image ? (
                    <Image
                      src={personalInfo.image}
                      alt={personalInfo.imageAlt || personalInfo.name || 'Anshita Bhardwaj'}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center">
                      <div className="text-center text-gray-400 space-y-3">
                        <div className="w-24 h-24 mx-auto rounded-full bg-purple-100 flex items-center justify-center">
                          <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <p className="text-sm">Photo</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Projects (GitHub Pinned) ── */}
      <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <ScrollAnimation>
            <div className="mb-14 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Projects</h2>
            </div>
          </ScrollAnimation>

          {/* Featured 3-column grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {GITHUB_PROJECTS.filter(p => p.featured).map((project, i) => (
              <ScrollAnimation key={project.githubUrl} delay={i * 80}>
                <div className="h-full bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-base font-semibold text-gray-900 leading-snug">{project.title}</h3>
                    <svg className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                  </div>
                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1">{project.description}</p>
                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack.map((tech, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                  {/* Link */}
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors">
                    View on GitHub →
                  </a>
                </div>
              </ScrollAnimation>
            ))}
          </div>

          {/* Non-featured row */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GITHUB_PROJECTS.filter(p => !p.featured).map((project, i) => (
              <ScrollAnimation key={project.githubUrl} delay={i * 60}>
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug">{project.title}</h3>
                    <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3 flex-1">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.techStack.slice(0, 4).map((tech, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded-md text-xs border border-gray-100">
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 4 && (
                      <span className="px-2 py-0.5 bg-gray-50 text-gray-400 rounded-md text-xs border border-gray-100">
                        +{project.techStack.length - 4}
                      </span>
                    )}
                  </div>
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors">
                    View on GitHub →
                  </a>
                </div>
              </ScrollAnimation>
            ))}
          </div>

          {/* View all repos CTA */}
          <ScrollAnimation delay={100}>
            <div className="text-center mt-10">
              <a
                href="https://github.com/Anshitaa?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-600 text-sm font-semibold rounded-xl transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                View all 18 repositories on GitHub
              </a>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* ── Skills ── */}
      <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollAnimation>
            <div className="mb-14 text-center">
              <p className="text-sm font-semibold text-purple-600 uppercase tracking-widest mb-2">Expertise</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Skills & Technologies</h2>
              <p className="mt-3 text-gray-500 max-w-xl mx-auto">
                Tools and technologies I use to bring ideas to life
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SKILL_CATEGORIES.map((cat, i) => {
              const colorMap: Record<string, { card: string; icon: string; badge: string }> = {
                purple: { card: 'border-purple-100', icon: 'bg-purple-100 text-purple-600', badge: 'bg-purple-50 text-purple-700 border-purple-100' },
                indigo: { card: 'border-indigo-100', icon: 'bg-indigo-100 text-indigo-600', badge: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
                violet: { card: 'border-violet-100', icon: 'bg-violet-100 text-violet-600', badge: 'bg-violet-50 text-violet-700 border-violet-100' },
              };
              const c = colorMap[cat.color];
              return (
                <ScrollAnimation key={cat.title} delay={i * 100}>
                  <div className={`bg-white rounded-2xl p-6 border ${c.card} shadow-sm h-full`}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`w-9 h-9 rounded-xl ${c.icon} flex items-center justify-center`}>
                        {cat.icon}
                      </div>
                      <h3 className="text-sm font-semibold text-gray-800">{cat.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cat.skills.map(skill => (
                        <span key={skill} className={`px-3 py-1.5 ${c.badge} border rounded-lg text-xs font-medium`}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </ScrollAnimation>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Research Publications ── */}
      <section id="research" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <ScrollAnimation>
            <div className="mb-14 text-center">
              <p className="text-sm font-semibold text-purple-600 uppercase tracking-widest mb-2">Academia</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Research & Publications</h2>
              <p className="mt-3 text-gray-500 max-w-xl mx-auto">
                Academic contributions advancing AI and machine learning
              </p>
            </div>
          </ScrollAnimation>

          <div className="space-y-6">
            {publications?.map((pub: Publication, i: number) => {
              const link = getPublicationLink(pub);
              return (
                <ScrollAnimation key={pub._id} delay={i * 80}>
                  <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Year badge */}
                      <div className="shrink-0">
                        <span className="inline-block px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs font-semibold uppercase tracking-wide">
                          {pub.year}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-3">
                        <div>
                          {link ? (
                            <a href={link} target="_blank" rel="noopener noreferrer"
                              className="text-base font-semibold text-gray-900 hover:text-purple-600 transition-colors leading-snug">
                              {pub.title}
                            </a>
                          ) : (
                            <p className="text-base font-semibold text-gray-900 leading-snug">{pub.title}</p>
                          )}
                          <p className="text-sm text-gray-500 mt-1">
                            {pub.authors} &middot; <span className="italic">{pub.journal}</span>
                          </p>
                        </div>

                        {pub.abstract && (
                          <p className="text-sm text-gray-600 leading-relaxed">{pub.abstract}</p>
                        )}

                        {link && (
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            View Paper
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollAnimation>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Experience ── */}
      <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollAnimation>
            <div className="mb-14 text-center">
              <p className="text-sm font-semibold text-purple-600 uppercase tracking-widest mb-2">Career</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Experience</h2>
              <p className="mt-3 text-gray-500 max-w-xl mx-auto">
                Professional journey building intelligent systems
              </p>
            </div>
          </ScrollAnimation>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line (desktop) */}
            <div className="hidden lg:block absolute left-[calc(33.333%-1px)] top-0 bottom-0 w-px bg-gray-100" />

            <div className="space-y-10">
              {experience?.map((exp: Experience, index: number) => (
                <ScrollAnimation key={index} delay={index * 100}>
                  <div className="grid lg:grid-cols-3 gap-6 lg:gap-12">
                    {/* Left — meta */}
                    <div className="lg:col-span-1 lg:text-right lg:pr-10 space-y-1.5 relative">
                      {/* Timeline dot */}
                      <div className="hidden lg:block absolute right-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-purple-400 border-2 border-white ring-2 ring-purple-200" />

                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        {formatDate(exp.startDate)} — {exp.isCurrent ? 'Present' : (exp.endDate ? formatDate(exp.endDate) : 'Present')}
                      </p>
                      <h3 className="text-base font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-sm font-medium text-purple-600">{exp.company}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 lg:justify-end">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {exp.location}
                      </p>
                    </div>

                    {/* Right — details */}
                    <div className="lg:col-span-2 space-y-5">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {EXPERIENCE_DESCRIPTIONS[exp.company] ||
                          `${exp.position} at ${exp.company}, focusing on data-driven solutions and innovation.`}
                      </p>

                      {exp.achievements?.length > 0 && (
                        <div>
                          <p className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-2.5">Key Achievements</p>
                          <ul className="space-y-2">
                            {exp.achievements.map((achievement: string, i: number) => (
                              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {(EXPERIENCE_SKILLS[exp.company] ?? exp.skills)?.length > 0 && (
                        <div>
                          <p className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-2.5">Technologies & Skills</p>
                          <div className="flex flex-wrap gap-1.5">
                            {(EXPERIENCE_SKILLS[exp.company] ?? exp.skills.slice(0, 8)).map((skill: string, i: number) => (
                              <span key={i} className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg text-xs font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <ScrollAnimation>
            <div className="mb-14 text-center">
              <p className="text-sm font-semibold text-purple-600 uppercase tracking-widest mb-2">Let&apos;s Talk</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Get In Touch</h2>
              <p className="mt-3 text-gray-500 max-w-xl mx-auto">
                Always open to discussing new opportunities, research collaborations, or just a good conversation.
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid lg:grid-cols-5 gap-10 items-start">
            {/* Left — info */}
            <ScrollAnimation direction="left" className="lg:col-span-2">
              <div className="space-y-6">
                <div className="space-y-4">
                  <a
                    href={`mailto:${personalInfo?.email || 'anshita.inbox@gmail.com'}`}
                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Email</p>
                      <p className="text-sm text-gray-700 font-medium">{personalInfo?.email || 'anshita.inbox@gmail.com'}</p>
                    </div>
                  </a>

                  <a
                    href={`tel:${personalInfo?.phone || '+14807653612'}`}
                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Phone</p>
                      <p className="text-sm text-gray-700 font-medium">{personalInfo?.phone || '+1 (480) 765-3612'}</p>
                    </div>
                  </a>
                </div>

                {/* Social links */}
                <div className="flex gap-3">
                  {personalInfo?.github && (
                    <a href={personalInfo.github} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 shadow-sm transition-all">
                      <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                  )}
                  {personalInfo?.linkedin && (
                    <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all">
                      <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </ScrollAnimation>

            {/* Right — form */}
            <ScrollAnimation direction="right" delay={100} className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                <ContactForm />
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-6 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Anshita Bhardwaj. Built with Next.js &amp; Sanity CMS.
          </p>
          <div className="flex items-center gap-4">
            {personalInfo?.github && (
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer"
                className="hover:text-gray-600 transition-colors">GitHub</a>
            )}
            {personalInfo?.linkedin && (
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer"
                className="hover:text-gray-600 transition-colors">LinkedIn</a>
            )}
            <a href={`mailto:${personalInfo?.email || 'anshita.inbox@gmail.com'}`}
              className="hover:text-gray-600 transition-colors">Email</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
