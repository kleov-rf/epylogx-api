import { OAuth2Client } from 'google-auth-library'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const googleVerify = async (idToken: string) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  })

  const {
    email,
    picture: pictureURL,
    given_name: givenName,
    family_name: familyName,
  } = <any>ticket.getPayload()

  return {
    email,
    pictureURL,
    givenName,
    familyName,
  }
}

export default googleVerify
