import { InMemoryCheckinsRepository } from '@/repositories/in-memory/in-memory-checkin-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchUserCheckInHistoryCase } from './fetch-user-check-in-history'

let checkinsRepository: InMemoryCheckinsRepository
let sut: FetchUserCheckInHistoryCase

describe('Fetch Check-in Use Case', () => {
  beforeEach(async () => {
    checkinsRepository = new InMemoryCheckinsRepository()
    sut = new FetchUserCheckInHistoryCase(checkinsRepository)
  })

  it('should be able to fetch history of users', async () => {
    await checkinsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })
    await checkinsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })
    await checkinsRepository.create({
      gym_id: 'gym-03',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      page: 1,
    })

    expect(checkIn).toHaveLength(3)
    expect(checkIn).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ gym_id: 'gym-03' }),
        expect.objectContaining({ gym_id: 'gym-02' }),
      ]),
    )
  })
  it('should be able 20 items paginated', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkinsRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      })
    }
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      page: 2,
    })

    expect(checkIn).toHaveLength(2)
    expect(checkIn).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ gym_id: 'gym-21' }),
        expect.objectContaining({ gym_id: 'gym-22' }),
      ]),
    )
  })
})
