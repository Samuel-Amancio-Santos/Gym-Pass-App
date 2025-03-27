import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import { describe, afterAll, beforeAll, expect, it } from 'vitest'
import request from 'supertest'
import { createAndAuthenticateAdmin } from '@/utils/tests/create-and-authenticate-admin'

describe('Create Check-in Tests', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create check-in', async () => {
    const userAdmin = await createAndAuthenticateAdmin()

    await request(app.server)
      .post('/create')
      .send({
        title: 'JS Academy',
        description: '',
        phone: '',
        latitude: -8.0919179,
        longitude: -34.8869787,
      })
      .set('Authorization', `Bearer ${userAdmin.userToken}`)

    const user = await createAndAuthenticateUser()

    const gym = await request(app.server)
      .get('/gyms/search')
      .query({ q: 'JS Academy', page: 1 })
      .set('Authorization', `Bearer ${userAdmin.userToken}`)

    const gymId = gym.body.gyms[0].id

    const response = await request(app.server)
      .post(`/gyms/${gymId}/check-ins`)
      .send({
        latitude: -8.0919179,
        longitude: -34.8869787,
      })
      .set('Authorization', `Bearer ${user.userToken}`)

    expect(response.statusCode).toEqual(201)
  })
})
