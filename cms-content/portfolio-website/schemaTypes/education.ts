import { defineField, defineType } from 'sanity'

export const education = defineType({
  name: 'education',
  title: 'Education',
  type: 'document',
  fields: [
    defineField({
      name: 'institution',
      title: 'Institution Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'degree',
      title: 'Degree',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'field',
      title: 'Field of Study',
      type: 'string',
      description: 'e.g., "Data Science, Analytics and Engineering"',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g., "Tempe, AZ" or "Rajasthan, India"',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      description: 'Expected graduation date if currently enrolled',
    }),
    defineField({
      name: 'isCurrent',
      title: 'Currently Enrolled',
      type: 'boolean',
      description: 'Check if currently enrolled in this program',
      initialValue: false,
    }),
    defineField({
      name: 'gpa',
      title: 'GPA',
      type: 'string',
      description: 'e.g., "3.8/4.0"',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Additional details about the program or achievements',
    }),
    defineField({
      name: 'relevantCoursework',
      title: 'Relevant Coursework',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Key courses relevant to your field',
    }),
    defineField({
      name: 'achievements',
      title: 'Achievements & Honors',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Academic achievements, honors, or awards',
    }),
    defineField({
      name: 'institutionLogo',
      title: 'Institution Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
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
        { field: 'endDate', direction: 'desc' },
        { field: 'startDate', direction: 'desc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'degree',
      subtitle: 'institution',
      media: 'institutionLogo',
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
