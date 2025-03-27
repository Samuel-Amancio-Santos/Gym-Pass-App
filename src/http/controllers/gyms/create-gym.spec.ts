import { app } from '@/app'
import { describe, afterAll, beforeAll, expect, it } from 'vitest'
import request from 'supertest'
import { createAndAuthenticateAdmin } from '@/utils/tests/create-and-authenticate-admin'

describe('Create Gym tests ', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create gym', async () => {
    const userAdmin = await createAndAuthenticateAdmin()

    const response = await request(app.server)
      .post('/create')
      .send({
        title: 'JS Academy',
        description: '',
        phone: '',
        latitude: -8.0919179,
        longitude: -34.8869787,
      })
      .set('Authorization', `Bearer ${userAdmin.userToken}`)

    expect(response.statusCode).toEqual(201)
  })
})
