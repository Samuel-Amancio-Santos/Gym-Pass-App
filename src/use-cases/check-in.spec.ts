import { InMemoryCheckinsRepository } from '@/repositories/in-memory/in-memory-checkin-repository'
import { CheckInUseCase } from './checkin'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { MaxDistanceError } from './err/max-distance-error'
import { MaxNumberOfCheckInsError } from './err/max-number-of-check-ins-error'

let checkinsRepository: InMemoryCheckinsRepository
let gymsRepository: InMemoryGymRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkinsRepository = new InMemoryCheckinsRepository()
    gymsRepository = new InMemoryGymRepository()
    sut = new CheckInUseCase(checkinsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: -8.086229489336894,
      longitude: -34.887645487183235,
      created_at: new Date(),
    })
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-1',
      userLatitude: -8.086052231930685,
      userLongitude: -34.887863416654824,
    })



    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -8.086052231930685,
      userLongitude: -34.887863416654824,
    })

    await expect(
      async () =>
        await sut.execute({
          gymId: 'gym-01',
          userId: 'user-01',
          userLatitude: -8.086052231930685,
          userLongitude: -34.887863416654824,
        }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -8.086052231930685,
      userLongitude: -34.887863416654824,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -8.086052231930685,
      userLongitude: -34.887863416654824,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
  it('shouldnt be able to check in on distant gym', async () => {
    await gymsRepository.create({
      id: 'gym-02',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: -28.2092052,
      longitude: -50.6401091,
    })

    await expect(
      async () =>
        await sut.execute({
          gymId: 'gym-02',
          userId: 'user-1',
          userLatitude: -27.2092052,
          userLongitude: -49.6401091,
        }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
