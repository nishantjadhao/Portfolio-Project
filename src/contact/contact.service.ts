import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class ContactService {
  constructor(
    private readonly emailService: EmailService,
  ) {}

  async sendMessage(createContactDto: CreateContactDto) {
    console.log('📩 New Contact Form Submission');
    console.log(createContactDto);

    // Send email
    await this.emailService.sendContactEmail(createContactDto);

    return {
      success: true,
      message: 'Message sent successfully',
    };
  }
}