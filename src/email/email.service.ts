import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { Resend } from 'resend';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    // private readonly resend: Resend;
    private readonly transporter: nodemailer.Transporter;

    // constructor(private readonly configService: ConfigService) {
    //     const apiKey = this.configService.get<string>('RESEND_API_KEY');

    //     console.log('RESEND_API_KEY =>', apiKey);

    //     this.resend = new Resend(apiKey);
    // }
    constructor(private readonly configService: ConfigService) {
        const host = this.configService.get<string>('SMTP_HOST');
        const port = Number(this.configService.get<string>('SMTP_PORT'));
        const user = this.configService.get<string>('SMTP_USER');
        const pass = this.configService.get<string>('SMTP_PASS');

        if (!host || !port || !user || !pass) {
            throw new Error(
                'Missing SMTP configuration. Required env vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS',
            );
        }

        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: {
                user,
                pass,
            },
        });
    }

    async sendContactEmail(data: {
        name: string;
        email: string;
        subject: string;
        message: string;
    }) {
        // try {
        //     const { data: response, error } = await this.resend.emails.send({
        //         from: this.configService.get<string>('MAIL_FROM')!,
        //         to: this.configService.get<string>('MAIL_TO')!,
        //         replyTo: data.email,
        //         subject: `Portfolio Contact: ${data.subject}`,
        //         html: `
        //   <h2>New Contact Form Submission</h2>

        //   <p><strong>Name:</strong> ${data.name}</p>

        //   <p><strong>Email:</strong> ${data.email}</p>

        //   <p><strong>Subject:</strong> ${data.subject}</p>

        //   <hr />

        //   <p>${data.message}</p>
        // `,
        //     });

        //     if (error) {
        //         throw new Error(error.message);
        //     }

        //     return response;
        // } catch (error) {
        try {
            const from = this.configService.get<string>('MAIL_FROM');
            const to = this.configService.get<string>('MAIL_TO');

            if (!from || !to) {
                throw new Error('Missing mail routing configuration. Required env vars: MAIL_FROM, MAIL_TO');
            }

            const info = await this.transporter.sendMail({
                from,
                to,
                replyTo: data.email,
                subject: `Portfolio Contact: ${data.subject}`,
                html: `
        <h2>New Contact Form Submission</h2>

        <p><strong>Name:</strong> ${data.name}</p>

        <p><strong>Email:</strong> ${data.email}</p>

        <p><strong>Subject:</strong> ${data.subject}</p>

        <hr />

        <p>${data.message}</p>
      `,
            });

            console.log('Email sent:', info.messageId);

            return info;
        } catch (error) {
            console.error('Email Error:', error);
            throw error;
        }
    }
}
