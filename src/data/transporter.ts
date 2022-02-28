import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS
    },
    tls: { ciphers: "SSLv3" }
   })

export const sendMail = async (name: string, email: string) => {
    await transporter.sendMail({
        from: `<${process.env.NODEMAILER_USER}>`,
        to: `${email}`,
        subject: "Redefinição de senha",
        text: `Olá ${name}, uma redefinição de senha foi pedida.
        Aqui está uma senha padrão: senhapadrao123.
        `,
        html: `<p>Olá ${name},</p>
        </br>
        <p>Uma redefinição de senha foi pedida.</p>
        </br>
        <p>Aqui está uma senha padrão: <strong>senhapadrao123</strong>.</p>`
    })
}