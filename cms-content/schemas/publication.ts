import { defineField, defineType } from 'sanity'

export const publication = defineType({
  name: 'publication',
  title: 'Research Publication',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Publication Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'authors',
      title: 'Authors',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of authors (include yourself as "Anshita Bhardwaj")',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'venue',
      title: 'Venue/Conference',
      type: 'string',
      description: 'e.g., "AIAMMS-2023" or "Journal Name"',
    }),
    defineField({
      name: 'year',
      title: 'Publication Year',
      type: 'number',
      validation: Rule => Rule.required().min(2020).max(2030),
    }),
    defineField({
      name: 'status',
      title: 'Publication Status',
      type: 'string',
      options: {
        list: [
          { title: 'Published', value: 'published' },
          { title: 'Accepted', value: 'accepted' },
          { title: 'Under Review', value: 'under-review' },
          { title: 'In Preparation', value: 'in-preparation' },
          { title: 'Not Yet Published', value: 'not-published' },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'abstract',
      title: 'Abstract',
      type: 'text',
      rows: 4,
      description: 'Brief abstract or summary of the research',
    }),
    defineField({
      name: 'description',
      title: 'Detailed Description',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Detailed description of the research and key findings',
    }),
    defineField({
      name: 'keyFindings',
      title: 'Key Findings',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Key research findings and achievements',
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies Used',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'Technologies, frameworks, and tools used in the research',
    }),
    defineField({
      name: 'datasets',
      title: 'Datasets Used',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Datasets used in the research',
    }),
    defineField({
      name: 'metrics',
      title: 'Key Metrics',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Key performance metrics and results',
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'object',
      fields: [
        {
          name: 'paper',
          title: 'Paper URL',
          type: 'url',
          description: 'Link to published paper',
        },
        {
          name: 'code',
          title: 'Code Repository',
          type: 'url',
          description: 'Link to code repository',
        },
        {
          name: 'demo',
          title: 'Demo/Visualization',
          type: 'url',
          description: 'Link to demo or visualization',
        },
      ],
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Main image representing the research',
    }),
    defineField({
      name: 'gallery',
      title: 'Research Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
      description: 'Additional images, charts, or visualizations',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Publication',
      type: 'boolean',
      description: 'Show prominently on homepage',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Featured First, Then by Year',
      name: 'featuredYear',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'year', direction: 'desc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'venue',
      year: 'year',
    },
    prepare(selection) {
      const { title, subtitle, year } = selection
      return {
        title,
        subtitle: `${subtitle || 'Research'} (${year})`,
      }
    },
  },
})
