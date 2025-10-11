import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'message',
  title: 'Contact Message',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required().min(2).max(100)
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email()
    }),
    defineField({
      name: 'subject',
      title: 'Subject',
      type: 'string',
      validation: Rule => Rule.required().min(5).max(200)
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      validation: Rule => Rule.required().min(10).max(2000)
    }),
    defineField({
      name: 'receivedAt',
      title: 'Received At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true
    }),
    defineField({
      name: 'isRead',
      title: 'Read Status',
      type: 'boolean',
      initialValue: false,
      description: 'Mark as read when you have reviewed this message'
    }),
    defineField({
      name: 'ipAddress',
      title: 'IP Address',
      type: 'string',
      description: 'For spam protection and analytics'
    }),
    defineField({
      name: 'userAgent',
      title: 'User Agent',
      type: 'text',
      description: 'Browser/device information'
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      media: 'email'
    },
    prepare(selection) {
      const { title, subtitle } = selection
      return {
        title: title,
        subtitle: `${subtitle} - ${new Date().toLocaleDateString()}`,
        media: '📧'
      }
    }
  },
  orderings: [
    {
      title: 'Date (Newest)',
      name: 'dateDesc',
      by: [
        { field: 'receivedAt', direction: 'desc' }
      ]
    },
    {
      title: 'Date (Oldest)',
      name: 'dateAsc',
      by: [
        { field: 'receivedAt', direction: 'asc' }
      ]
    },
    {
      title: 'Unread First',
      name: 'unreadFirst',
      by: [
        { field: 'isRead', direction: 'asc' },
        { field: 'receivedAt', direction: 'desc' }
      ]
    }
  ]
})
