import { defineField, defineType } from 'sanity'

export const skill = defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Skill Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Programming Languages', value: 'programming' },
          { title: 'Frameworks & Libraries', value: 'frameworks' },
          { title: 'Databases', value: 'databases' },
          { title: 'Tools & Software', value: 'tools' },
          { title: 'Cloud & DevOps', value: 'cloud' },
          { title: 'AI/ML Libraries', value: 'ai-ml' },
          { title: 'Data Visualization', value: 'visualization' },
          { title: 'Methodologies', value: 'methodologies' },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'level',
      title: 'Proficiency Level',
      type: 'string',
      options: {
        list: [
          { title: 'Beginner', value: 'beginner' },
          { title: 'Intermediate', value: 'intermediate' },
          { title: 'Advanced', value: 'advanced' },
          { title: 'Expert', value: 'expert' },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'yearsExperience',
      title: 'Years of Experience',
      type: 'number',
      description: 'Approximate years of experience with this skill',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'Brief description of how you use this skill',
    }),
    defineField({
      name: 'icon',
      title: 'Skill Icon',
      type: 'string',
      description: 'Name of the icon (e.g., "python", "react", "aws") for display',
    }),
    defineField({
      name: 'color',
      title: 'Display Color',
      type: 'string',
      description: 'Hex color code for skill display',
      initialValue: '#3B82F6',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first within category',
      initialValue: 0,
    }),
    defineField({
      name: 'featured',
      title: 'Featured Skill',
      type: 'boolean',
      description: 'Show prominently on homepage',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: 'Category, Then by Order',
      name: 'categoryOrder',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'order', direction: 'asc' },
        { field: 'level', direction: 'desc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
    },
    prepare(selection) {
      const { title, subtitle } = selection
      return {
        title,
        subtitle: subtitle ? subtitle.charAt(0).toUpperCase() + subtitle.slice(1) : '',
      }
    },
  },
})
