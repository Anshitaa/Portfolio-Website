# Anshita Bhardwaj's Portfolio CMS

This is the Sanity.io CMS configuration for Anshita Bhardwaj's portfolio website.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Create Sanity Project**
   - Go to [sanity.io](https://sanity.io)
   - Create a new account or sign in
   - Create a new project
   - Copy the Project ID and Dataset name

3. **Configure Environment**
   ```bash
   cp env.example .env
   ```
   Then edit `.env` and add your Sanity project details:
   ```
   SANITY_STUDIO_PROJECT_ID=your-project-id
   SANITY_STUDIO_DATASET=production
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Deploy to Sanity**
   ```bash
   npm run deploy
   ```

## Content Types

- **Personal Information**: Basic info, bio, contact details
- **Projects**: Portfolio projects with descriptions, tech stack, and links
- **Experience**: Work experience with achievements and skills
- **Education**: Academic background and achievements
- **Skills**: Technical skills organized by category
- **Publications**: Research publications and papers

## Usage

1. Access the CMS at `http://localhost:3333` during development
2. Create and manage content through the intuitive interface
3. Content is automatically available via the Sanity API for the frontend
4. Use the Vision tool to test GraphQL queries

## Integration with Frontend

The frontend Next.js application will consume content from this CMS using the Sanity client. The API endpoint will be available at:
```
https://[project-id].api.sanity.io/v2023-05-03/data/query/[dataset]
```

## Content Structure

All content is structured to support:
- SEO optimization
- Rich text formatting
- Image optimization
- Flexible querying
- Real-time updates
