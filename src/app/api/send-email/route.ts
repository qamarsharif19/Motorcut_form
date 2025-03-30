import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    try {
        const requestData = await req.json();
        console.log("Received Data:", requestData); 

        const {
            first_name, last_name, user_email, user_phone,
            company_name, company_url, country, user_message,
            selected_files
        } = requestData;

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://motorcut-form.vercel.app/"; // Ensure full URLs
        const fileLinks = selected_files?.map((filePath: string) => {
            const fullUrl = filePath.startsWith("http") ? filePath : `${baseUrl}${filePath}`;
            return `<a href="${fullUrl}" target="_blank">${fullUrl}</a>`;
        }).join("<br>") || "No files selected.";

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"${first_name} ${last_name}" <${process.env.EMAIL_USER}>`,
            to: "qamarwordpress@gmail.com, rednice@filmla.org, support@motorcut.com",
            subject: "New Form Submission with Selected Files",
            html: `
                <h2>New Form Submission</h2>
                <p><strong>Name:</strong> ${first_name} ${last_name}</p>
                <p><strong>Email:</strong> ${user_email}</p>
                <p><strong>Phone:</strong> ${user_phone}</p>
                <p><strong>Company:</strong> ${company_name}</p>
                <p><strong>Website:</strong> ${company_url}</p>
                <p><strong>Country:</strong> ${country}</p>
                <p><strong>Message:</strong><br>${user_message}</p>
                <h3>Selected Files:</h3>
                <p>${fileLinks}</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        return NextResponse.json({ message: "Email sent successfully with file links" }, { status: 200 });

    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json({ message: "Email sending failed" }, { status: 500 });
    }
}
