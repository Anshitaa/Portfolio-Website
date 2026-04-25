import { NextRequest, NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity.client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Get client IP and user agent for analytics
    const forwarded = request.headers.get('x-forwarded-for')
    const ipAddress = forwarded ? forwarded.split(',')[0] : 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Save message to Sanity CMS
    const messageDoc = await sanityClient.create({
      _type: 'message',
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      receivedAt: new Date().toISOString(),
      isRead: false,
      ipAddress: ipAddress,
      userAgent: userAgent
    })

    console.log('Contact message saved to Sanity:', messageDoc._id)

    // You can also integrate with email services here:
    // Example with SendGrid:
    // await sgMail.send({
    //   to: 'anshita.inbox@gmail.com',
    //   from: 'noreply@yourdomain.com',
    //   subject: `Portfolio Contact: ${subject}`,
    //   html: `
    //     <h3>New Contact Form Submission</h3>
    //     <p><strong>Name:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Subject:</strong> ${subject}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message}</p>
    //   `
    // })

    return NextResponse.json(
      { message: 'Message sent successfully!', messageId: messageDoc._id },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
