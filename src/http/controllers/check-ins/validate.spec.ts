import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import {
  describe,
  afterAll,
  beforeAll,
  expect,
  it,
  beforeEach,
  afterEach,
} from 'vitest'
import request from 'supertest'
import { createAndAuthenticateAdmin } from '@/utils/tests/create-and-authenticate-admin'
describe('Validate Check-in Tests', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    // vi.useFakeTimers()
  })

  afterEach(() => {
    // vi.useRealTimers()
  })

  it('should be able to validate a check-in', async () => {
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
      .set('Authorization', `Bearer ${user.userToken}`)

    const gymId = gym.body.gyms[0].id

    await request(app.server)
      .post(`/gyms/${gymId}/check-ins`)
      .send({
        latitude: -8.0919179,
        longitude: -34.8869787,
      })
      .set('Authorization', `Bearer ${user.userToken}`)

    const checkInId = await request(app.server)
      .get('/check-ins/history')
      .query({ userId: `${user.user.id}`, page: 1 })
      .set('Authorization', `Bearer ${user.userToken}`)

    const response = await request(app.server)
      .patch(`/check-ins/${checkInId.body.checkIn[0].id}/validate`)
      .set('Authorization', `Bearer ${userAdmin.userToken}`)

    expect(response.statusCode).toEqual(204)
  })
})
