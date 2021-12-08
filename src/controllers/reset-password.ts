import sgMail from '@sendgrid/mail'
import { Request, Response } from 'express'
import { Admin, User } from '../models'

const postResetPassword = async (req: Request, res: Response) => {
  const { email } = req.body

  const [user, admin] = await Promise.all([
    User.findOne({ email }),
    Admin.findOne({ email }),
  ])

  const metaUser = user ?? admin

  const mailOptions = {
    from: 'epylogx@gmail.com',
    to: email,
    subject: `Reset your epylogx password, ${metaUser?.givenName}`,
    text: 'Monda',
    html: `
      <h2>Hi! It seems that you've forgotten your epylogx password, let us help you</h2>
      <h4>Please click on the following link, this will send you to a page for reset your password :)</h4>
      <a href="http://www.google.com">Recover your password</a> 
    `,
  }
  sgMail.setApiKey(<any>process.env.SENDGRID_API_KEY)

  sgMail
    .send(mailOptions)
    .then(data => res.json({ data }))
    .catch(error => res.json({ error }))
}

export default postResetPassword
