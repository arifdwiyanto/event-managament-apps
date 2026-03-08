import nodemailer from "nodemailer";

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: Number(process.env.NODEMAILER_PORT),
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
      secure: false,
    });
  }

  public async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    try {
      if (!process.env.NODEMAILER_USER) {
        console.warn("NODEMAILER_USER is missing, skipping email send");
        return;
      }

      const info = await this.transporter.sendMail({
        from: `"Hype Event Platform" <${process.env.NODEMAILER_USER}>`,
        to,
        subject,
        html,
      });

      console.log("Email send: %s", info.messageId);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}
