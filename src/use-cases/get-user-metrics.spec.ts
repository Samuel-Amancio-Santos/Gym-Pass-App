import { InMemoryCheckinsRepository } from '@/repositories/in-memory/in-memory-checkin-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserMetricsCase } from './get-user-metrics'

let checkinsRepository: InMemoryCheckinsRepository
let sut: GetUserMetricsCase

describe('Get metrics of user use case', () => {
  beforeEach(async () => {
    checkinsRepository = new InMemoryCheckinsRepository()
    sut = new GetUserMetricsCase(checkinsRepository)
  })

  it('Get checkins count', async () => {
    await checkinsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })
    await checkinsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })
    await checkinsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { totalCheckInsOfUser } = await sut.execute({
      userId: 'user-01',
    })

    expect(totalCheckInsOfUser).toEqual(3)
  })
})
