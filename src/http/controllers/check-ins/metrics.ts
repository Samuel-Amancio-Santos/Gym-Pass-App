import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const getUserMetricsCase = makeGetUserMetricsUseCase()

  const { totalCheckInsOfUser } = await getUserMetricsCase.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({
    totalCheckInsOfUser,
  })
}
