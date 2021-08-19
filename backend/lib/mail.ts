import { createTransport } from "nodemailer";
import 'dotenv/config';

const transport = createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    }
});

function createEmail(text: string) {
    return `
    <div style="
    border: 1px solid black;
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px;
    " />
    <h2>Hello There</h2>
    <p>${text}</p>
    </div>
    `;
}

export async function sendPasswordResetEmail(resetToken: string, to: string) {
    const info = await transport.sendMail({
        to,
        from: 'wes@wesbos.com',
        subject: 'Your password reset token',
        html: createEmail(`Your password reset token is here!
            <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click Here to reset</a>
        `)
    });
    console.log(info);
}