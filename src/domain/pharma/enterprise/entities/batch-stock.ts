import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface MovimentationBatchestock {
  batchestockId: UniqueEntityId
  quantity: number
}

export interface BatchestockProps {
  stockId: UniqueEntityId
  batchId: UniqueEntityId

  medicineId: UniqueEntityId

  currentQuantity: number
  lastMove?: Date
  createdAt: Date
  updatedAt?: Date
}

export class Batchestock extends Entity<BatchestockProps> {
  get stockId(): UniqueEntityId {
    return this.props.stockId
  }

  get batchId(): UniqueEntityId {
    return this.props.batchId
  }

  get medicineId(): UniqueEntityId {
    return this.props.medicineId
  }

  get quantity(): number {
    return this.props.currentQuantity
  }

  set quantity(value: number) {
    this.props.currentQuantity = value
    this.touch()
  }

  public replenish(value: number) {
    this.props.currentQuantity += value
  }

  public subtract(value: number) {
    if (value > this.quantity) {
      throw new Error(
        'value to be subtract is greater than the current quantity.',
      )
    }
    this.props.currentQuantity -= value
  }

  get lastMove(): Date | undefined {
    return this.props.lastMove
  }

  set lastMove(value: Date | undefined) {
    this.props.lastMove = value
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
    props: Optional< BatchestockProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const batchestock = new Batchestock({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id)

    return batchestock
  }
}
