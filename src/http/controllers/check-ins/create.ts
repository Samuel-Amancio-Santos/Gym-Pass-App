import { MaxDistanceError } from '@/use-cases/err/max-distance-error'
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use.case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const createCheckInBodySchema = z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  })

  const { gymId } = createCheckInParamsSchema.parse(request.params)
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body)

  try {
    const checkInUseCase = makeCheckInUseCase()

    await checkInUseCase.execute({
      gymId,
      userId: request.user.sub,
      userLatitude: latitude,
      userLongitude: longitude,
    })
  } catch (err) {
    if (err instanceof MaxDistanceError) {
      return reply.status(422).send({ message: err.message })
    }
  }

  return reply.status(201).send()
}
