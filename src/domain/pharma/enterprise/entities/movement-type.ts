import { Optional } from '@/core/types/optional'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AuxiliaryRecord, type AuxiliaryRecordProps } from './auxiliary-records'

export type MovementDirection = 'ENTRY' | 'EXIT'

export interface MovementTypeProps extends AuxiliaryRecordProps {
  direction: MovementDirection;
}

export class MovementType extends AuxiliaryRecord<MovementTypeProps> {
  get direction() {
    return this.props.direction
  }

  static create(
    props: Optional<MovementTypeProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const movementType = new MovementType(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return movementType
  }
}
