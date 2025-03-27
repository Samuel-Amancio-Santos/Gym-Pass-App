import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface FetchUserCheckInHistoryCaseRequest {
  userId: string
  page: number
}

interface FetchUserCheckInHistoryCaseResponse {
  checkIn: CheckIn[]
}

export class FetchUserCheckInHistoryCase {
  constructor(private checkinsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInHistoryCaseRequest): Promise<FetchUserCheckInHistoryCaseResponse> {
    const checkIn = await this.checkinsRepository.findManyByUserId(userId, page)

    return {
      checkIn,
    }
  }
}
