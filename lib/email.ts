// lib/email.ts - Lightweight email system
import { connectToDatabase } from "./mongodb";
import Winner from "@/models/Winner";
import Draw from "@/models/Draw";
import User from "@/models/User";

type EmailTemplate = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

// Simple email sender (mock in development, real in production)
export async function sendEmail(template: EmailTemplate): Promise<boolean> {
  const emailMode = process.env.EMAIL_MODE || "mock"; // "mock" or "smtp"

  if (emailMode === "mock") {
    console.log("📧 Email Mock:", JSON.stringify(template, null, 2));
    return true;
  }

  // Real implementation using nodemailer (optional)
  try {
    const nodemailer = require("nodemailer");

    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@dheroes.co.in",
      ...template,
    });

    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}

// Email templates
export async function sendWinnerNotification(winnerId: string): Promise<void> {
  await connectToDatabase();

  const winner = await Winner.findById(winnerId).populate("drawId");
  if (!winner || !winner.userId) return;

  const user = await User.findById(winner.userId);
  if (!user) return;

  const draw = winner.drawId as any;

  const template: EmailTemplate = {
    to: user.email,
    subject: `🎊 Congratulations! You won $${winner.prizeAmount.toFixed(2)}!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #059669;">Congratulations, ${user.name}!</h1>
        <p>You matched <strong>${winner.matchType} numbers</strong> in our recent draw!</p>
        <div style="background: #f0fdf4; border: 2px solid #10B981; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <p style="font-size: 24px; font-weight: bold; color: #059669; margin: 0;">
            You won $${winner.prizeAmount.toFixed(2)}!
          </p>
        </div>
        <p>Draw: ${draw.month}/${draw.year}</p>
        <p>Winning Numbers: ${draw.drawNumbers?.join(", ")}</p>
        <p>We'll verify your scores and process your payout soon.</p>
        <p style="color: #6B7280; font-size: 14px;">- The Digital Heroes Team</p>
      </div>
    `,
    text: `Congratulations ${user.name}! You matched ${winner.matchType} numbers and won $${winner.prizeAmount.toFixed(2)}!`,
  };

  await sendEmail(template);
}

export async function sendNoWinnerNotification(drawId: string): Promise<void> {
  await connectToDatabase();

  const draw = await Draw.findById(drawId);
  if (!draw) return;

  const activeUsers = await User.find({ subscriptionStatus: "active" });

  for (const user of activeUsers) {
    const template: EmailTemplate = {
      to: user.email,
      subject: `Draw Results: ${draw.month}/${draw.year}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #374151;">Draw Results</h1>
          <p>Hi ${user.name},</p>
          <p>Unfortunately, you didn't win this month's draw.</p>
          <div style="background: #FEF3C7; border: 2px solid #F59E0B; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <p style="font-size: 18px; color: #92400; margin: 0;">
              No winners this month - Jackpot rolls over!
            </p>
          </div>
          <p>Keep submitting your scores for next month's draw!</p>
          <p>Next draw: ${draw.month + 1}/${draw.year}</p>
          <p style="color: #6B7280; font-size: 14px;">- The Digital Heroes Team</p>
        </div>
      `,
      text: `Draw Results: No winners this month. Jackpot rolls over!`,
    };

    await sendEmail(template);
  }
}

export async function sendDrawPublishedNotification(
  drawId: string,
): Promise<void> {
  await connectToDatabase();

  const draw = await Draw.findById(drawId).populate({
    path: "winners",
    match: { userId: { $exists: true } },
  });

  if (!draw) return;

  // Notify winners
  for (const winner of draw.winners || []) {
    await sendWinnerNotification(winner._id);
  }
}
