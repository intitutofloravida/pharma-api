import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UseGuards, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CreateInstitutionUseCase } from '@/domain/pharma/application/use-cases/auxiliary-records/institution/create-institution'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/role-decorator'
import { InstitutionWithSameCnpjAlreadyExistsError } from '@/domain/pharma/application/use-cases/auxiliary-records/institution/_errors/institution-with-same-cnpj-already-exists-error'
import { InstitutionWithSameContentAlreadyExistsError } from '@/domain/pharma/application/use-cases/auxiliary-records/institution/_errors/institution-with-same-content-already-exists-error'

const createInstitutionBodySchema = z.object({
  name: z.string(),
  cnpj: z.string(),
  description: z.string().optional(),
})

type CreateInstitutionBodySchema = z.infer<typeof createInstitutionBodySchema>

@Controller('/institutions')

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class CreateInstitutionController {
  constructor(
    private createInstitution: CreateInstitutionUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createInstitutionBodySchema))
  async handle(@Body() body: CreateInstitutionBodySchema) {
    const { name, cnpj, description } = body

    const result = await this.createInstitution.execute({
      cnpj,
      content: name,
      description,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InstitutionWithSameCnpjAlreadyExistsError:
        case InstitutionWithSameContentAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { institution: result.value.institution }
  }
}
