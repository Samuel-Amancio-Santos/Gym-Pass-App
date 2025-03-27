import { app } from '@/app'
import request from 'supertest'

export async function createAndAuthenticateUser() {
  await request(app.server).post('/users').send({
    name: 'samuel',
    email: 'Amancio@gmail.com',
    password: '123123',
  })

  const userAuthenticate = await request(app.server).post('/sessions').send({
    email: 'Amancio@gmail.com',
    password: '123123',
  })

  const [cookies] = userAuthenticate.headers['set-cookie']

  const userToken = userAuthenticate.body.token

  const getUser = await request(app.server)
    .get('/me')
    .set('Authorization', `Bearer ${userAuthenticate.body.token}`)

  const { user } = getUser.body

  return {
    userToken,
    user,
    cookies,
  }
}
