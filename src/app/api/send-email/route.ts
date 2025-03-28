import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
    try {
        const requestData = await req.json(); // Read request body
        console.log("Received Data:", requestData); // Debugging log

        // Ensure selected_files is an array, even if it's empty
        const selected_files: string[] = Array.isArray(requestData.selected_files)
            ? requestData.selected_files
            : [];

        const {
            first_name, last_name, user_email, user_phone,
            company_name, company_url, country, user_message
        } = requestData;

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Generate file attachments (only if files exist)
        const attachments = selected_files
            .map((fileName: string) => {
                const filePath = path.join(process.cwd(), "public/uploads", fileName);

                if (fs.existsSync(filePath)) {
                    return {
                        filename: fileName,
                        path: filePath, // Attach file from server
                    };
                } else {
                    console.warn(`File not found: ${filePath}`);
                    return null;
                }
            })
            .filter((attachment): attachment is { filename: string; path: string } => attachment !== null); // ✅ Type-safe filter

        const mailOptions = {
            from: `"${first_name} ${last_name}" <${process.env.EMAIL_USER}>`,
            to: "qamarwordpress@gmail.com, rednice@filmla.org",
            subject: "New Form Submission with Attachments",
            text: `You received a new message from ${first_name} ${last_name}.\n\n
                Email: ${user_email}\nPhone: ${user_phone}\nCompany: ${company_name}\n
                Website: ${company_url}\nCountry: ${country}\n\nMessage:\n${user_message}`,
            attachments, // ✅ Now correctly typed
        };

        await transporter.sendMail(mailOptions);
        return NextResponse.json({ message: "Email sent successfully with attachments" }, { status: 200 });

    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json({ message: "Email sending failed" }, { status: 500 });
    }
}
