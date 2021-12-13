import sgMail from '@sendgrid/mail'
import { AES } from 'crypto-js'
import { Request, Response } from 'express'
import { Admin, User } from '../models'

const postResetPassword = async (req: Request, res: Response) => {
  const { email } = req.body

  const [user, admin] = await Promise.all([
    User.findOne({ email }),
    Admin.findOne({ email }),
  ])

  const metaUser = user ?? admin

  const encryptedId = AES.encrypt(
    (<any>metaUser)._id.toString(),
    <any>process.env.SECRETORPRIVATEKEY
  )

  const mailOptions = {
    from: 'epylogx@gmail.com',
    to: email,
    subject: `Reset your epylogx password, ${metaUser?.givenName}`,
    text: 'Monda',
    html: `
      <h2>Hi! It seems that you've forgotten your epylogx password, let us help you</h2>
      <h4>Please click on the following link, this will send you to a page for reset your password :)</h4>
      <a href="http://192.168.1.134:3000/recover-password?meta=${encryptedId}">Recover your password</a> 
    `,
  }
  sgMail.setApiKey(<any>process.env.SENDGRID_API_KEY)

  sgMail
    .send(mailOptions)
    .then(data => res.json({ data }))
    .catch(error => res.json({ error }))
}

export default postResetPassword
