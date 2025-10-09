import { sanityClient } from '@/lib/sanity.client';
import { personalInfoQuery, projectsQuery, experienceQuery, publicationsQuery } from '@/lib/queries';
import Image from 'next/image';

// Type definitions
interface Project {
  _id: string;
  title: string;
  summary: string;
  techStack?: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  featured?: boolean;
}

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

// Utility function to format dates
function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  });
}

async function getData() {
  const [personalInfo, projects, experience, publications] = await Promise.all([
    sanityClient.fetch(personalInfoQuery),
    sanityClient.fetch(projectsQuery),
    sanityClient.fetch(experienceQuery),
    sanityClient.fetch(publicationsQuery)
  ]);

  return { personalInfo, projects, experience, publications };
}

export default async function Home() {
  const { personalInfo, projects, experience, publications } = await getData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-50/95 backdrop-blur-sm z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="text-lg font-medium text-gray-900">
              {personalInfo?.name || 'Anshita Bhardwaj'}
            </div>
            <div className="hidden md:flex space-x-12">
              <a href="#about" className="text-sm text-gray-600 hover:text-purple-800 transition-colors font-bold">✨ About</a>
              <a href="#projects" className="text-sm text-gray-600 hover:text-purple-800 transition-colors font-bold">🚀 Projects</a>
              <a href="#skills" className="text-sm text-gray-600 hover:text-purple-800 transition-colors font-bold">💎 Skills</a>
              <a href="#research" className="text-sm text-gray-600 hover:text-purple-800 transition-colors font-bold">🔬 Research</a>
              <a href="#experience" className="text-sm text-gray-600 hover:text-purple-800 transition-colors font-bold">💼 Experience</a>
              <a href="#contact" className="text-sm text-gray-600 hover:text-purple-800 transition-colors font-bold">📧 Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="about" className="pt-40 pb-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-6xl lg:text-7xl font-light text-gray-900 leading-tight">
                  Hello, I&apos;m{' '}
                  <span className="font-medium bg-gradient-to-r from-purple-800 to-indigo-800 bg-clip-text text-transparent">
                    {personalInfo?.name?.split(' ')[0] || 'Anshita'}
                  </span>
                </h1>
                <p className="text-xl text-gray-700 font-light leading-relaxed max-w-2xl">
                  {personalInfo?.title || 'M.S. Data Science @ ASU | Specializing in Explainable AI'}
                </p>
                <div className="flex items-center gap-2 text-gray-800">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-lg">{personalInfo?.email || 'anshita.inbox@gmail.com'}</span>
                </div>
              </div>
              
              <p className="text-lg text-gray-700 leading-relaxed max-w-2xl">
                {personalInfo?.summary || 'Passionate about building intelligent systems that make a difference. Currently pursuing advanced research in AI and machine learning.'}
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <a 
                  href={personalInfo?.github || '#'}
                  className="inline-flex items-center px-6 py-3 bg-purple-800 text-white text-sm font-medium hover:bg-purple-900 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                  GitHub
                </a>
                <a 
                  href={personalInfo?.linkedin || '#'}
                  className="inline-flex items-center px-6 py-3 border border-purple-800 text-purple-800 text-sm font-medium hover:bg-purple-50 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                  </svg>
                  LinkedIn
                </a>
                <a 
                  href={`mailto:${personalInfo?.email || 'anshita.inbox@gmail.com'}`}
                  className="inline-flex items-center px-6 py-3 bg-indigo-800 text-white text-sm font-medium hover:bg-indigo-900 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Email
                </a>
                <a 
                  href="https://drive.google.com/file/d/1CEeqCaLKfgnpCptHEH1NYL8wuPFkm-wh/view?usp=sharing"
                  className="inline-flex items-center px-6 py-3 bg-indigo-100 text-indigo-800 text-sm font-medium hover:bg-indigo-200 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Resume
                </a>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              {personalInfo?.image ? (
                <div className="relative">
        <Image
                    src={personalInfo.image}
                    alt={personalInfo.imageAlt || personalInfo.name || "Anshita Bhardwaj"}
                    width={400}
                    height={500}
                    className="object-cover"
          priority
        />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
                </div>
              ) : (
                <div className="w-80 h-96 bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-2xl">👩‍💻</span>
                    </div>
                    <p className="text-sm">Photo placeholder</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="projects" className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              🚀 <span className="text-purple-800">Projects</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Selected work showcasing technical expertise and innovative solutions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects?.filter((project: Project) => project.featured).map((project: Project) => (
              <div key={project._id} className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-gray-200 hover:bg-white/80 transition-all duration-300 shadow-lg hover:shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">{project.summary}</p>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  {project.techStack?.map((tech: string, index: number) => (
                    <span key={index} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-3">
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      GitHub →
                    </a>
                  )}
                  {project.liveDemoUrl && (
                    <a 
                      href={project.liveDemoUrl}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Live Demo →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Projects Section */}
      <section className="py-20 px-6 bg-white/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">All Projects</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {projects?.map((project: Project) => (
              <div key={project._id} className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-gray-200 hover:bg-white transition-all duration-300 shadow-md">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                  {project.featured && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                      Featured
                    </span>
                  )}
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed text-sm">{project.summary}</p>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  {project.techStack?.slice(0, 6).map((tech: string, index: number) => (
                    <span key={index} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                  {project.techStack && project.techStack.length > 6 && (
                    <span className="px-4 py-2 bg-blue-200 text-blue-900 rounded-full text-sm font-medium">
                      +{project.techStack.length - 6} more
                    </span>
                  )}
                </div>
                
                <div className="flex gap-3 text-sm">
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      GitHub →
                    </a>
                  )}
                  {project.liveDemoUrl && (
                    <a 
                      href={project.liveDemoUrl}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Live Demo →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 px-8 bg-gradient-to-br from-purple-50/50 to-indigo-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              💎 <span className="text-purple-800">Skills</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Technical expertise and tools I work with
            </p>
          </div>
          
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Programming Skills */}
            <div className="bg-gray-50/70 backdrop-blur-md rounded-2xl p-6 border border-gray-200 hover:bg-gray-50/80 transition-all duration-300 shadow-lg hover:shadow-xl">
              <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                <span>💻</span> Programming Skills
              </h3>
              <div className="flex flex-wrap gap-3">
                {['Python', 'Django', 'C/C++', 'JavaScript', 'HTML', 'CSS', 'ReactJS', 'NextJS', 'Hugging Face Transformers', 'Time Series Forecasting', 'Anomaly Detection'].map((skill) => (
                  <span key={skill} className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Databases */}
            <div className="bg-gray-50/70 backdrop-blur-md rounded-2xl p-6 border border-gray-200 hover:bg-gray-50/80 transition-all duration-300 shadow-lg hover:shadow-xl">
              <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center gap-2">
                <span>🗄️</span> Databases
              </h3>
              <div className="flex flex-wrap gap-3">
                {['MySQL', 'MongoDB', 'SQL Server Management Studio'].map((skill) => (
                  <span key={skill} className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Tools & Software */}
            <div className="bg-gray-50/70 backdrop-blur-md rounded-2xl p-6 border border-gray-200 hover:bg-gray-50/80 transition-all duration-300 shadow-lg hover:shadow-xl">
              <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                <span>🛠️</span> Tools & Software
              </h3>
              <div className="flex flex-wrap gap-3">
                {['AWS', 'Tableau', 'Jupyter Notebook', 'Power BI', 'Anaconda', 'Docker', 'Kafka', 'Kubernetes', 'ArcGIS', 'GeoPandas', 'Apache Spark (PySpark-style processing)'].map((skill) => (
                  <span key={skill} className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Publications */}
      <section id="research" className="py-32 px-8 bg-gradient-to-br from-violet-50/30 to-purple-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              🔬 <span className="text-purple-800">Research</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Academic contributions advancing the field of artificial intelligence and machine learning
            </p>
          </div>
          
          <div className="space-y-12">
            {publications?.map((publication: Publication) => (
              <div key={publication._id} className="border-b border-gray-200 pb-12 last:border-b-0">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Left column - Publication info */}
                  <div className="lg:col-span-1">
                    <div className="space-y-4">
                      <div className="text-sm text-purple-600 uppercase tracking-wide font-medium">
                        {publication.year}
                      </div>
                      <div className="space-y-2">
                        <div className="text-gray-700 font-medium">{publication.journal || 'Research Paper'}</div>
                        <div className="text-sm text-gray-500">{publication.authors}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right column - Title & Abstract */}
                  <div className="lg:col-span-2">
                    <div className="space-y-6">
                      <h3 className="text-xl font-medium text-gray-900 leading-tight">
                        {publication.title === "Reimagining CAPTCHA Security: A Case for Retiring Alphanumeric Text-Based CAPTCHAs" ? (
                          <a 
                            href="https://drive.google.com/file/d/14fs1fwkJptnpICUDdoBbEXmEVgB9DUiM/view?usp=sharing"
                            className="text-gray-900 hover:text-purple-600 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {publication.title}
                          </a>
                        ) : publication.title === "Modeling the Spread of COVID-19 in Lombardy: Adaptation of the SEIQRS Mathematical Framework" ? (
                          <a 
                            href="https://drive.google.com/file/d/1HoMtn74ZgIcbb1lmhK7G1BkI9YV6ZsRs/view?usp=sharing"
                            className="text-gray-900 hover:text-purple-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
                            {publication.title}
                          </a>
                        ) : publication.title === "Artificial Intelligence Hallucinations Fueling Deepfake Threats: Detection and Prevention Approaches" ? (
                          <a 
                            href="https://www.researchsquare.com/article/rs-6771530/v1"
                            className="text-gray-900 hover:text-purple-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
                            {publication.title}
          </a>
                        ) : publication.doi ? (
        <a
                            href={`https://doi.org/${publication.doi}`}
                            className="text-gray-900 hover:text-purple-600 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
                            {publication.title}
                          </a>
                        ) : (
                          publication.title
                        )}
                      </h3>
                      
                      {publication.abstract && (
                        <p className="text-gray-600 leading-relaxed text-base">
                          {publication.abstract}
                        </p>
                      )}
                      
                      <div className="pt-2 flex flex-wrap gap-3">
                        {publication.title === "Reimagining CAPTCHA Security: A Case for Retiring Alphanumeric Text-Based CAPTCHAs" && (
                          <a 
                            href="https://drive.google.com/file/d/14fs1fwkJptnpICUDdoBbEXmEVgB9DUiM/view?usp=sharing"
                            className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors font-medium text-sm rounded-lg"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            📄 Link
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                        {publication.title === "Modeling the Spread of COVID-19 in Lombardy: Adaptation of the SEIQRS Mathematical Framework" && (
                          <a 
                            href="https://drive.google.com/file/d/1HoMtn74ZgIcbb1lmhK7G1BkI9YV6ZsRs/view?usp=sharing"
                            className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors font-medium text-sm rounded-lg"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            📄 Link
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                        {publication.title === "Artificial Intelligence Hallucinations Fueling Deepfake Threats: Detection and Prevention Approaches" && (
                          <a 
                            href="https://www.researchsquare.com/article/rs-6771530/v1"
                            className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors font-medium text-sm rounded-lg"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            🔗 Link
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                        {publication.doi && (
                          <a 
                            href={`https://doi.org/${publication.doi}`}
                            className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors font-medium text-sm rounded-lg"
          target="_blank"
          rel="noopener noreferrer"
        >
                            📖 DOI
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-32 px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              💼 <span className="text-purple-800">Experience</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional journey building intelligent systems and driving innovation
            </p>
          </div>
          
          <div className="space-y-16">
            {experience?.map((exp: Experience, index: number) => (
              <div key={index} className="border-b border-gray-200 pb-16 last:border-b-0">
                <div className="grid lg:grid-cols-3 gap-12">
                  {/* Left column - Company & Position */}
                  <div className="lg:col-span-1">
                    <div className="space-y-4">
                      <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                        {formatDate(exp.startDate)} — {exp.isCurrent ? 'Present' : (exp.endDate ? formatDate(exp.endDate) : 'Present')}
                      </div>
                      <h3 className="text-xl font-medium text-gray-900">{exp.position}</h3>
                      <div className="space-y-2">
                        <div className="text-gray-700 font-medium">{exp.company}</div>
                        <div className="text-sm text-gray-500">{exp.location}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right column - Description & Achievements */}
                  <div className="lg:col-span-2">
                    <div className="space-y-8">
                      {/* Role description */}
                      <div>
                        <p className="text-gray-600 leading-relaxed">
                          {exp.company === 'Arizona State University' && 
                            "Leading cutting-edge research in Explainable AI and Large Language Models, developing innovative solutions for enterprise document intelligence and healthcare risk prediction systems."
                          }
                          {exp.company === 'Escorts Kubota Limited' && 
                            "Transformed agricultural machinery data into actionable insights, optimizing manufacturing processes and improving product performance through advanced statistical methods and machine learning techniques."
                          }
                          {exp.company === 'Justdial Ltd.' && 
                            "Engineered data-driven solutions for business optimization, creating predictive models that enhanced user engagement and improved platform performance across millions of users."
                          }
                        </p>
                      </div>
                      
                      {/* Key achievements */}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Key Achievements</h4>
                          <ul className="space-y-2">
                            {exp.achievements.map((achievement: string, i: number) => (
                              <li key={i} className="flex items-start gap-3 text-gray-600">
                                <div className="w-1 h-1 bg-gray-400 rounded-full mt-3 flex-shrink-0"></div>
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Technologies */}
                      {exp.skills && exp.skills.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Technologies</h4>
                          <div className="flex flex-wrap gap-3">
                            {exp.skills.slice(0, 8).map((skill: string, i: number) => (
                              <span key={i} className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-32 px-8 bg-gradient-to-br from-purple-50/30 to-indigo-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              📧 <span className="text-purple-800">Contact</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
              I&apos;m always interested in discussing new opportunities and collaborations.
            </p>
            
            {/* Contact Information */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <a 
                href={`mailto:${personalInfo?.email || 'anshita.inbox@gmail.com'}`}
                className="inline-flex items-center gap-2 text-purple-800 hover:text-purple-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {personalInfo?.email || 'anshita.inbox@gmail.com'}
        </a>
        <a
                href={`tel:${personalInfo?.phone || '+1 (480) 765-3612'}`}
                className="inline-flex items-center gap-2 text-purple-800 hover:text-purple-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                {personalInfo?.phone || '+1 (480) 765-3612'}
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 max-w-2xl mx-auto">
            <form id="contact-form" className="space-y-6">
              <div id="form-message" className="hidden p-4 rounded-lg mb-6"></div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="What's this about?"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Tell me about your project or opportunity..."
                ></textarea>
              </div>
              <button
                type="submit"
                id="submit-btn"
                className="w-full bg-purple-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span id="submit-text">Send Message</span>
                <span id="submit-loading" className="hidden">Sending...</span>
              </button>
            </form>
          </div>

          <script
            dangerouslySetInnerHTML={{
              __html: `
                document.getElementById('contact-form').addEventListener('submit', async function(e) {
                  e.preventDefault();
                  
                  const form = e.target;
                  const submitBtn = document.getElementById('submit-btn');
                  const submitText = document.getElementById('submit-text');
                  const submitLoading = document.getElementById('submit-loading');
                  const formMessage = document.getElementById('form-message');
                  
                  // Show loading state
                  submitBtn.disabled = true;
                  submitText.classList.add('hidden');
                  submitLoading.classList.remove('hidden');
                  formMessage.classList.add('hidden');
                  
                  try {
                    const formData = new FormData(form);
                    const data = {
                      name: formData.get('name'),
                      email: formData.get('email'),
                      subject: formData.get('subject'),
                      message: formData.get('message')
                    };
                    
                    const response = await fetch('/api/contact', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(data),
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok) {
                      formMessage.className = 'p-4 rounded-lg mb-6 bg-green-100 text-green-800 border border-green-200';
                      formMessage.textContent = 'Message sent successfully! I&apos;ll get back to you soon.';
                      form.reset();
                    } else {
                      formMessage.className = 'p-4 rounded-lg mb-6 bg-red-100 text-red-800 border border-red-200';
                      formMessage.textContent = result.error || 'Failed to send message. Please try again.';
                    }
                  } catch (error) {
                    formMessage.className = 'p-4 rounded-lg mb-6 bg-red-100 text-red-800 border border-red-200';
                    formMessage.textContent = 'Network error. Please check your connection and try again.';
                  } finally {
                    formMessage.classList.remove('hidden');
                    submitBtn.disabled = false;
                    submitText.classList.remove('hidden');
                    submitLoading.classList.add('hidden');
                  }
                });
              `,
            }}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-200 bg-gray-50/50">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <p>&copy; 2024 Anshita Bhardwaj. Built with Next.js and Sanity CMS.</p>
        </div>
      </footer>
    </div>
  );
}