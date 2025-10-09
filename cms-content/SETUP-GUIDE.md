# 🚀 Anshita's Portfolio CMS - Setup Guide

## ✅ Sprint 1 Complete: CMS & Content Foundation

Congratulations! The Sanity.io CMS setup is complete with all your content schemas and data ready for import.

## 📁 What's Been Created

### CMS Structure
- **Content Schemas**: Personal Info, Projects, Experience, Education, Skills, Publications
- **Data Files**: All your content pre-populated and ready for import
- **Setup Scripts**: Automated setup and data import scripts
- **Knowledge Base**: Files for AnshitaBot RAG system

### Content Included
- ✅ **6 Featured Projects** with detailed descriptions and tech stacks
- ✅ **3 Work Experiences** (ASU Research, Escorts Kubota, Justdial)
- ✅ **2 Education Records** (ASU MS, Amity BTech)
- ✅ **16 Technical Skills** organized by category
- ✅ **5 Research Publications** with metrics and achievements
- ✅ **Personal Information** with bio and contact details

## 🎯 Next Steps to Complete Sprint 1

### 1. Create Sanity.io Account
```bash
# Visit https://sanity.io and create an account
# Create a new project and note your:
# - Project ID
# - Dataset name (usually "production")
```

### 2. Configure Environment
```bash
cd cms-content
cp env.example .env
# Edit .env with your Sanity credentials:
# SANITY_STUDIO_PROJECT_ID=your-project-id
# SANITY_STUDIO_DATASET=production
```

### 3. Install Dependencies & Setup
```bash
# Run the automated setup script
./scripts/setup.sh

# Or manually:
npm install
node scripts/import-data.js
```

### 4. Start Sanity Studio
```bash
npm run dev
# Open http://localhost:3333
```

### 5. Import Your Data
**Option A: CLI Import (Recommended)**
```bash
# Install Sanity CLI
npm install -g @sanity/cli

# Login to Sanity
sanity login

# Import data
sanity dataset import sanity-import.json production --replace
```

**Option B: Manual Import**
- Use the Sanity Studio interface
- Create documents manually using the generated JSON files

## 📊 Content Overview

### Projects (6 total)
1. **LLM-Powered Agent for Enterprise Document Intelligence** ⭐ Featured
2. **Responsible AI for Healthcare Risk Prediction** ⭐ Featured  
3. **End-to-End MLOps Pipeline for Real-Time Anomaly Detection** ⭐ Featured
4. **Full-Stack LLM Agent with Dynamic Knowledge Base**
5. **OS Scheduler Pro: Visual Process Management**
6. **Sentiment Analysis in Twitter using LSTM Networks**

### Experience (3 total)
- **Research Assistant** @ Arizona State University (Current)
- **Data Analyst Intern** @ Escorts Kubota Limited
- **Data Analyst Intern** @ Justdial Ltd.

### Skills (16 total)
- **Programming**: Python, JavaScript, C/C++
- **AI/ML**: TensorFlow, PyTorch, LangChain, SHAP
- **Frontend**: React, NextJS
- **Backend**: FastAPI, Django
- **Cloud**: AWS, Docker, Kubernetes
- **Databases**: PostgreSQL, MongoDB
- **Tools**: Git, Tableau, Power BI

### Publications (5 total)
- **2 Not Yet Published** (Deepfake Detection, LSTM Optimization)
- **3 Published** (AIAMMS-2023 conference)

## 🤖 AnshitaBot Knowledge Base Ready

The knowledge base files are prepared for your AI assistant:
- `knowledge-base/anshita-resume.txt` - Complete resume content
- `knowledge-base/project-details.txt` - Detailed project information

These will power the RAG system in Sprint 3.

## 🔗 API Endpoints Ready

Once deployed, your CMS will provide:
```
https://[project-id].api.sanity.io/v2023-05-03/data/query/[dataset]
```

GraphQL endpoint will be available at:
```
https://[project-id].api.sanity.io/v2023-05-03/graphql/[dataset]/default
```

## 🎉 Sprint 1 Success Metrics

- ✅ **Content Schemas**: 6 comprehensive schemas created
- ✅ **Data Population**: All content structured and ready
- ✅ **Setup Automation**: Scripts for easy deployment
- ✅ **Knowledge Base**: RAG-ready content prepared
- ✅ **Documentation**: Complete setup and usage guides

## 🚀 Ready for Sprint 2: Frontend Development

Your CMS foundation is solid! Next up:
- Initialize Next.js project with Tailwind CSS
- Build responsive pages and components
- Integrate with Sanity.io API
- Create dynamic content rendering

## 📞 Support

If you encounter any issues:
1. Check the Sanity.io documentation
2. Verify your Project ID and Dataset name
3. Ensure all dependencies are installed
4. Check the generated `sanity-import.json` file

**Your portfolio CMS is ready to power an amazing website! 🎯**
