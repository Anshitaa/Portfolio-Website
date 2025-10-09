import { defineField, defineType } from 'sanity'

export const personalInfo = defineType({
  name: 'personalInfo',
  title: 'Personal Information',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Professional Title',
      type: 'string',
      description: 'e.g., "M.S. Data Science @ ASU | Specializing in Explainable AI"',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.email().required(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
    }),
    defineField({
      name: 'github',
      title: 'GitHub URL',
      type: 'url',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g., "Tempe, AZ"',
    }),
    defineField({
      name: 'summary',
      title: 'Professional Summary',
      type: 'text',
      rows: 4,
      description: 'Brief professional summary for the hero section',
    }),
    defineField({
      name: 'bio',
      title: 'Detailed Bio',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Detailed bio for the About page',
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'resume',
      title: 'Resume/CV File',
      type: 'file',
      options: {
        accept: '.pdf',
      },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'title',
    },
  },
})
