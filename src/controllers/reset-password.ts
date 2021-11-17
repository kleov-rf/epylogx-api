import { Request, Response } from 'express'
import nodemailer, { Transporter, SendMailOptions } from 'nodemailer'
import { Admin, User } from '../models'

const postResetPassword = async (req: Request, res: Response) => {
  const { email } = req.body

  const [user, admin] = await Promise.all([
    User.findOne({ email }),
    Admin.findOne({ email }),
  ])

  const metaUser = user ?? admin

  const transporter: Transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_ACCOUNT,
      pass: process.env.EMAIL_PASSWORD,
    },
    // tls: { servername: 'smtp.gmail.com' },
  })

  const mailOptions: SendMailOptions = {
    from: 'Forgot password uwu, epylogx@gmail.com',
    to: email,
    subject: `Reset your Epylogx Password, ${metaUser?.givenName}`,
    html: `
      <h2>Email enviado desde node.js</h2>
      <h4>Please click on th efollowing link, or paste this into your browser to compolete the process:</h4>
      <a href="http://www.google.com">Recover your password</a> 
    `
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).json({
        errors: true,
        reason: error,
      })
    } else {
      res.json({
        info: `Email sent: ${info.response}`,
      })
    }
  })
}

export default postResetPassword
