import { Dispensation } from '@/domain/pharma/enterprise/entities/dispensation'

export class DispensationPresenter {
  static toHTTP(dispensation: Dispensation) {
    return {
      id: dispensation.id.toString(),
      dispensationDate: dispensation.dispensationDate,
      medicinesMovemented: dispensation.exitsRecords.length,
      patientId: dispensation.patientId,
      operatorId: dispensation.operatorId,
      createdAt: dispensation.createdAt,
      quantity: dispensation.totalQuantity,
    }
  }
}
