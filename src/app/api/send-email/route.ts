import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    try {
        const { first_name, last_name, user_email, user_phone, company_name, company_url, country, user_message } = await req.json();

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", // e.g., smtp.gmail.com
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS, // Your email password or app password
            },
        });

        const mailOptions = {
            from: `"${first_name} ${last_name}" <${process.env.EMAIL_USER}>`,
            to: "qamarwordpress@gmail.com, rednice@filmla.org", // Correct format
            subject: "New Form Submission",
            text: `You received a new message from ${first_name} ${last_name}.\n\nEmail: ${user_email}\nPhone: ${user_phone}\nCompany: ${company_name}\nWebsite: ${company_url}\nCountry: ${country}\n\nMessage:\n${user_message}`,
        };
        
        

        await transporter.sendMail(mailOptions);
        return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json({ message: "Email sending failed" }, { status: 500 });
    }
}
