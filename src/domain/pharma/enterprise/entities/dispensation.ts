import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { MedicineExit } from './exit'

export interface DispensationProps {
  operatorId: UniqueEntityId
  patientId: UniqueEntityId
  dispensationDate: Date
  exitsRecords: MedicineExit[]
  createdAt: Date
  updatedAt?: Date | null
}

export class Dispensation extends Entity<DispensationProps> {
  get operatorId() {
    return this.props.operatorId
  }

  get patientId() {
    return this.props.patientId
  }

  get dispensationDate() {
    return this.props.dispensationDate
  }

  get exitsRecords() {
    return this.props.exitsRecords
  }

  get totalQuantity() {
    return this.exitsRecords.reduce(
      (acc, dispenseBatchestock) => acc + dispenseBatchestock.quantity,
      0,
    )
  }

  set dispensationDate(value: Date) {
    this.props.dispensationDate = value
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<DispensationProps, 'createdAt' | 'dispensationDate'>,
    id?: UniqueEntityId,
  ) {
    const dispensation = new Dispensation({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      dispensationDate: props.dispensationDate ?? new Date(),
    }, id)

    return dispensation
  }
}
