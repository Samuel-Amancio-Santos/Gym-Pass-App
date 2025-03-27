import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import {
  describe,
  afterAll,
  beforeAll,
  expect,
  it,
  beforeEach,
  vi,
  afterEach,
} from 'vitest'
import request from 'supertest'
import { createAndAuthenticateAdmin } from '@/utils/tests/create-and-authenticate-admin'

describe('Metrics Check-in Tests', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to get check-ins metrics of an user', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

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

    vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0))

    await request(app.server)
      .post(`/gyms/${gymId}/check-ins`)
      .send({
        latitude: -8.0919179,
        longitude: -34.8869787,
      })
      .set('Authorization', `Bearer ${user.userToken}`) // nao é possivel criar checkin pois o acess token antigo expirou

    const newAcessToken = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', user.cookies)
      .send() // usando o refresh token para permissionar o usuario

    user.userToken = newAcessToken.body.token

    await request(app.server)
      .post(`/gyms/${gymId}/check-ins`)
      .send({
        latitude: -8.0919178,
        longitude: -34.8869787,
      })
      .set('Authorization', `Bearer ${user.userToken}`) // permite o usuario criar um checkin

    const response = await request(app.server)
      .get('/check-ins/metrics')
      .query({ userId: `${user.user.id}` })
      .set('Authorization', `Bearer ${user.userToken}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.totalCheckInsOfUser).toEqual(2)
  })
})
