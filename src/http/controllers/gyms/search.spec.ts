import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import { describe, afterAll, beforeAll, expect, it } from 'vitest'
import request from 'supertest'
import { createAndAuthenticateAdmin } from '@/utils/tests/create-and-authenticate-admin'

describe('Search Gym tests ', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search gym', async () => {
    const userAdmin = await createAndAuthenticateAdmin()

    for (let i = 0; i < 40; i++) {
      await request(app.server)
        .post('/create')
        .send({
          title: `JS Academy_${i}`,
          description: '',
          phone: '',
          latitude: -8.0919179,
          longitude: -34.8869787,
        })
        .set('Authorization', `Bearer ${userAdmin.userToken}`)
    }

    const user = await createAndAuthenticateUser()
    const response = await request(app.server)
      .get('/gyms/search')
      .query({ q: 'JS Academy', page: 2 })
      .set('Authorization', `Bearer ${user.userToken}`)

    expect(response.body.gyms).toHaveLength(20)
  })
})
