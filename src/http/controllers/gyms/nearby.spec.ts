import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import { describe, afterAll, beforeAll, expect, it } from 'vitest'
import request from 'supertest'
import { createAndAuthenticateAdmin } from '@/utils/tests/create-and-authenticate-admin'

describe('Nearby Gyms tests ', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get nearby gyms', async () => {
    const userAdmin = await createAndAuthenticateAdmin()

    await request(app.server)
      .post('/create')
      .send({
        title: `JS Academy Rio Mar`,
        description: '',
        phone: '',
        latitude: -8.086698529417044,
        longitude: -34.89637792576521,
      })
      .set('Authorization', `Bearer ${userAdmin.userToken}`)

    await request(app.server)
      .post('/create')
      .send({
        title: `JS Academy Piedade`,
        description: '',
        phone: '',
        latitude: -8.184176505984405,
        longitude: -34.92062158500565,
      })
      .set('Authorization', `Bearer ${userAdmin.userToken}`)

    await request(app.server)
      .post('/create')
      .send({
        title: `JS Academy Beira Rio`,
        description: '',
        phone: '',
        latitude: -8.088263810817795,
        longitude: -34.89450742424142,
      })
      .set('Authorization', `Bearer ${userAdmin.userToken}`)

    const user = await createAndAuthenticateUser()

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -8.085949030129386,
        longitude: -34.889026629447805,
      })
      .set('Authorization', `Bearer ${user.userToken}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms[0]).toEqual(
      expect.objectContaining({
        title: 'JS Academy Rio Mar',
      }),
    )
    expect(response.body.gyms[1]).toEqual(
      expect.objectContaining({
        title: 'JS Academy Beira Rio',
      }),
    )
  })
})
