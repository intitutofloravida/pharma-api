import {
  BadRequestException,
  Body, ConflictException, Controller,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RegisterMedicineEntryUseCase } from '@/domain/pharma/application/use-cases/movimentation/entry/register-medicine-entry'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { RegisterMedicineEntryDto } from './dtos/register-medicine-entry.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('entry')
@Controller('medicine-entry/stock/:stockId/medicine-variant/:medicineVariantId')
@UseGuards(JwtAuthGuard)
export class RegisterMedicineEntryController {
  constructor(private registerMedicineEntry: RegisterMedicineEntryUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('medicineVariantId') medicineVariantId: string,
    @Param('stockId') stockId: string,
    @Body() body: RegisterMedicineEntryDto,
  ) {
    const { batches, entryDate, movementTypeId, newBatches } = body

    const result = await this.registerMedicineEntry.execute({
      batches,
      movementTypeId,
      medicineVariantId,
      operatorId: user.sub,
      stockId,
      entryDate,
      newBatches,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ConflictException:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {}
  }
}
