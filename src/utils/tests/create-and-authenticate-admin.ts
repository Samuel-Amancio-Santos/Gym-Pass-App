import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import request from 'supertest'

export async function createAndAuthenticateAdmin() {
  // Criando o usuário com a função ADMIN
  await request(app.server).post('/users').send({
    name: 'samuel',
    email: 'AmancioAdmin@gmail.com',
    password: '123123',
  })

  await prisma.user.update({
    where: { email: 'AmancioAdmin@gmail.com' },
    data: { role: 'ADMIN' },
  })

  const userAuthenticate = await request(app.server).post('/sessions').send({
    email: 'AmancioAdmin@gmail.com',
    password: '123123',
  })

  const [cookies] = userAuthenticate.headers['set-cookie']
  const userToken = userAuthenticate.body.token

  // Obtendo informações do usuário autenticado
  const getUser = await request(app.server)
    .get('/me')
    .set('Authorization', `Bearer ${userToken}`)

  const { user } = getUser.body

  return {
    userToken,
    user,
    cookies,
  }
}
