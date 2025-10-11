import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

// Import schemas
import { project } from './schemas/project'
import { experience } from './schemas/experience'
import { education } from './schemas/education'
import { personalInfo } from './schemas/personalInfo'
import { skill } from './schemas/skill'
import { publication } from './schemas/publication'
import message from './schemas/message'

export default defineConfig({
  name: 'anshita-portfolio',
  title: "Anshita Bhardwaj's Portfolio CMS",
  
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Personal Information')
              .child(
                S.document()
                  .schemaType('personalInfo')
                  .documentId('personal-info')
              ),
            S.divider(),
            S.listItem()
              .title('Projects')
              .child(S.documentTypeList('project').title('Projects')),
            S.listItem()
              .title('Experience')
              .child(S.documentTypeList('experience').title('Work Experience')),
            S.listItem()
              .title('Education')
              .child(S.documentTypeList('education').title('Education')),
            S.listItem()
              .title('Skills')
              .child(S.documentTypeList('skill').title('Skills')),
            S.listItem()
              .title('Publications')
              .child(S.documentTypeList('publication').title('Research Publications')),
            S.divider(),
            S.listItem()
              .title('Contact Messages')
              .child(S.documentTypeList('message').title('Contact Form Messages')),
          ])
    }),
    visionTool(),
  ],

  schema: {
    types: [
      personalInfo,
      project,
      experience,
      education,
      skill,
      publication,
      message,
    ],
  },
})
