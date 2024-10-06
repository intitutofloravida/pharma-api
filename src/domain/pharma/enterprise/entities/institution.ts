import type { Optional } from '@/core/types/optional'
import { Company, type CompanyProps } from './company'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface InstitutionProps extends CompanyProps {}

export class Institution extends Company<InstitutionProps> {
  static create(
    props: Optional<InstitutionProps, 'createdAt' | 'description'>,
    id?: UniqueEntityId,
  ) {
    const institution = new Institution(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        description: props.description ?? null,
      },
      id,
    )

    return institution
  }
}
