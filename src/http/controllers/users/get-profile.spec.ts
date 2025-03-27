import { app } from '@/app'
import { describe, afterAll, beforeAll, expect, it } from 'vitest'
import request from 'supertest'

describe('Profile tests', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate user', async () => {
    await request(app.server).post('/users').send({
      name: 'samuel',
      email: 'Amancio@gmail.com',
      password: '123123',
    })

    const userAuthenticate = await request(app.server).post('/sessions').send({
      email: 'Amancio@gmail.com',
      password: '123123',
    })

    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${userAuthenticate.body.token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.user.id).toEqual(expect.any(String))
  })
})
