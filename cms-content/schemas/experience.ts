import { defineField, defineType } from 'sanity'

export const experience = defineType({
  name: 'experience',
  title: 'Work Experience',
  type: 'document',
  fields: [
    defineField({
      name: 'company',
      title: 'Company Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'position',
      title: 'Position/Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g., "Tempe, AZ" or "Haryana, India"',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      description: 'Leave empty if currently employed',
    }),
    defineField({
      name: 'isCurrent',
      title: 'Currently Employed',
      type: 'boolean',
      description: 'Check if this is your current position',
      initialValue: false,
    }),
    defineField({
      name: 'description',
      title: 'Job Description & Achievements',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Detailed description of responsibilities and achievements',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'achievements',
      title: 'Key Achievements',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Bullet points of key achievements and metrics',
    }),
    defineField({
      name: 'skills',
      title: 'Skills Used',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'Technologies and skills used in this role',
    }),
    defineField({
      name: 'companyLogo',
      title: 'Company Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'companyUrl',
      title: 'Company Website',
      type: 'url',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first (most recent should be 0)',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Most Recent First',
      name: 'recentFirst',
      by: [
        { field: 'order', direction: 'asc' },
        { field: 'startDate', direction: 'desc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'position',
      subtitle: 'company',
      media: 'companyLogo',
    },
    prepare(selection) {
      const { title, subtitle } = selection
      return {
        title,
        subtitle,
      }
    },
  },
})
