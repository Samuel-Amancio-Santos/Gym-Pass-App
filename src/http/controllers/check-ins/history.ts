import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const createHistorySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = createHistorySchema.parse(request.query)

  const fetchUserCheckInHistoryCase = makeFetchUserCheckInsHistoryUseCase()

  const { checkIn } = await fetchUserCheckInHistoryCase.execute({
    userId: request.user.sub,
    page,
  })

  return reply.status(200).send({ checkIn })
}
