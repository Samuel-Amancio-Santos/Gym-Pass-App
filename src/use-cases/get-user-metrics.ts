import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface GetUserMetricsCaseRequest {
  userId: string
}

interface GetUserMetricsCaseResponse {
  totalCheckInsOfUser: number
}

export class GetUserMetricsCase {
  constructor(private checkinsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsCaseRequest): Promise<GetUserMetricsCaseResponse> {
    const totalCheckInsOfUser =
      await this.checkinsRepository.totalCheckins(userId)

    return {
      totalCheckInsOfUser,
    }
  }
}
