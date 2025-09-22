import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message, type, to, data: emailData } = body;

    if (!email && !to) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    let emailSubject: string;
    let emailContent: string;
    let recipientEmail: string;

    if (type === 'password-reset') {
      emailSubject = subject || 'Reset Your Portfolio Oracle Password';
      recipientEmail = to || email;
      
      const resetUrl = emailData?.resetUrl || '';
      const userName = emailData?.userName || 'User';
      
      emailContent = `
Hello ${userName},

You requested to reset your password for your Portfolio Oracle account.

Click the link below to reset your password:
${resetUrl}

This link will expire in 1 hour for security reasons.

If you didn't request this password reset, please ignore this email.

Best regards,
The Portfolio Oracle Team
      `.trim();
    } else if (type === 'email-verification') {
      // Email verification email
      emailSubject = subject || 'Verify Your Email - Portfolio Oracle';
      recipientEmail = to || email;
      
      const verificationUrl = emailData?.verificationUrl || '';
      const firstName = emailData?.firstName || 'there';
      
      emailContent = `
Hello ${firstName}!

Thanks for signing up for Portfolio Oracle. To complete your registration and start building amazing projects, please verify your email address by clicking the link below:

${verificationUrl}

If the link doesn't work, you can copy and paste it into your browser.

This link will expire in 24 hours.

If you didn't create an account with Portfolio Oracle, you can safely ignore this email.

Best regards,
The Portfolio Oracle Team
      `.trim();
    } else if (type === 'support') {
      emailSubject = `Support Request: ${subject}`;
      emailContent = `
Name: ${name}
Email: ${email}
Subject: ${subject}

${message}
      `.trim();
      recipientEmail = 'alegbeyemi@gmail.com';
    } else {
      emailSubject = 'Contact Form Submission - Portfolio Oracle';
      emailContent = `
Email: ${email}

${message}
      `.trim();
      recipientEmail = 'alegbeyemi@gmail.com';
    }


    const { error } = await resend.emails.send({
      from: 'Portfolio Oracle <onboarding@resend.dev>',
      to: [recipientEmail],
      replyTo: type === 'password-reset' ? undefined : email,
      subject: emailSubject,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>'),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 