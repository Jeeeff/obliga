import { logger } from '../utils/logger'
import nodemailer from 'nodemailer'
import { env } from '../config/env'

interface Attachment {
    filename: string;
    content: Buffer | string;
}

interface EmailOptions {
    to: string
    subject: string
    text: string
    html?: string
    attachments?: Attachment[]
}

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'ethereal_user',
        pass: process.env.SMTP_PASS || 'ethereal_pass',
    },
});

export const sendEmail = async (options: EmailOptions) => {
    // In production, check env vars. If missing, log and return (or throw)
    if (process.env.NODE_ENV === 'test' || !process.env.SMTP_HOST) {
        logger.info(`[EMAIL MOCK] Sending email to ${options.to}`)
        logger.info(`[EMAIL MOCK] Subject: ${options.subject}`)
        if (options.attachments) {
            logger.info(`[EMAIL MOCK] Attachments: ${options.attachments.length}`)
        }
        return true
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Obliga" <noreply@obliga.com>',
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
            attachments: options.attachments
        });
        
        logger.info(`Message sent: ${info.messageId}`);
        return true;
    } catch (error) {
        logger.error({ err: error }, 'Error sending email');
        throw error;
    }
}

export const emailService = {
    sendEmail,

    async sendWelcomeEmail(to: string, userName: string, tenantName: string) {
        const subject = `Bem-vindo ao Obliga - ${tenantName}`
        const text = `Olá ${userName},\n\nSua conta no Obliga foi criada com sucesso para o tenant ${tenantName}.\n\nComece agora: https://app.obliga.com`
        
        await sendEmail({
            to,
            subject,
            text
        })
    }
}
