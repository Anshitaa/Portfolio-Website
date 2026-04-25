# Anshita Bhardwaj - Portfolio Website

A modern, responsive portfolio website built with Next.js and Sanity CMS, showcasing professional experience, research publications, and technical skills.

## Live Website

**Portfolio URL**: [https://portfolio-website-4ho5jygd3-anshitaas-projects.vercel.app/](https://portfolio-website-4ho5jygd3-anshitaas-projects.vercel.app/)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.5.4 with TypeScript
- **Styling**: Tailwind CSS
- **CMS**: Sanity.io
- **Deployment**: Vercel
- **Version Control**: Git & GitHub

## 📋 Features

- ✅ **Responsive Design** - Works on all devices
- ✅ **Dynamic Content** - Easy updates via Sanity CMS
- ✅ **Modern UI/UX** - Professional and clean design
- ✅ **Research Publications** - Showcase academic work
- ✅ **Skills Section** - Organized by categories
- ✅ **Experience Timeline** - Professional journey
- ✅ **Contact Form** - Direct communication
- ✅ **SEO Optimized** - Better search visibility

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── api/contact/     # Contact form API
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Homepage
│   └── lib/
│       ├── queries.ts       # Sanity GROQ queries
│       └── sanity.client.ts # Sanity client config
├── public/                  # Static assets
├── package.json            # Dependencies
└── next.config.ts          # Next.js configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Sanity account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Anshitaa/Portfolio-Website.git
   cd Portfolio-Website/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create `.env.local` file:
   ```env
   SANITY_PROJECT_ID=j6an4il7
   SANITY_DATASET=production
   SANITY_API_VERSION=2023-05-03
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Content Management

### Using Sanity CMS

1. **Start Sanity Studio** (from cms-content directory):
   ```bash
   cd ../cms-content
   npm run dev
   ```

2. **Access CMS**: [http://localhost:3333](http://localhost:3333)

3. **Update content**:
   - Personal information
   - Experience entries
   - Research publications
   - Skills and projects

4. **Publish changes** - Updates appear on live website automatically

### Manual Updates

For design changes or new features:

1. **Edit code** in your preferred editor
2. **Test locally**: `npm run dev`
3. **Commit changes**:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```
4. **Vercel auto-deploys** your changes

## 🎨 Customization

### Colors & Styling
- Edit `src/app/globals.css` for global styles
- Modify Tailwind classes in components
- Update color scheme in `page.tsx`

### Content Structure
- Add new sections in `page.tsx`
- Update Sanity schemas in `cms-content/schemas/`
- Modify GROQ queries in `src/lib/queries.ts`

### Images
- Profile photos: Upload via Sanity CMS
- Static assets: Add to `public/` folder
- Optimized with Next.js Image component

## 📊 Research & Publications

The portfolio showcases:

- **COVID-19 Research**: SEIQRS Mathematical Framework
- **CAPTCHA Security**: CNN-based model using RetinaNet  
- **Deepfake Detection**: AI Hallucination Bias Analysis

All papers include direct links to publications and Google Drive documents.

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Deployment

The website is automatically deployed to Vercel when changes are pushed to the main branch.

**Manual deployment**:
```bash
vercel --prod
```

## 📱 Responsive Design

- **Mobile-first** approach
- **Breakpoints**: sm, md, lg, xl
- **Touch-friendly** navigation
- **Optimized images** for all devices

## 🔧 Environment Variables

Required environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `SANITY_PROJECT_ID` | Sanity project identifier | `j6an4il7` |
| `SANITY_DATASET` | Sanity dataset name | `production` |
| `SANITY_API_VERSION` | Sanity API version | `2023-05-03` |

## 📞 Contact

- **Email**: anshita.inbox@gmail.com
- **LinkedIn**: [Your LinkedIn Profile]
- **GitHub**: [https://github.com/Anshitaa](https://github.com/Anshitaa)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Content managed with [Sanity.io](https://www.sanity.io/)
- Deployed on [Vercel](https://vercel.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

