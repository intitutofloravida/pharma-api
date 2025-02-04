import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { ManufacturersRepository } from '@/domain/pharma/application/repositories/manufacturers-repository'
import { Manufacturer } from '@/domain/pharma/enterprise/entities/manufacturer'

export class InMemoryManufacturersRepository
implements ManufacturersRepository {
  async save(manufacturer: Manufacturer): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id.equal(manufacturer.id))

    this.items[itemIndex] = manufacturer
  }

  async findById(manufacturerId: string): Promise<Manufacturer | null> {
    const manufacturer = this.items.find(item => item.id.equal(new UniqueEntityId(manufacturerId)))

    if (!manufacturer) {
      return null
    }

    return manufacturer
  }

  public items: Manufacturer[] = []

  async create(manufacturer: Manufacturer) {
    this.items.push(manufacturer)
  }

  async findByContent(content: string) {
    const manufacturer = this.items.find(
      (item) => item.content.toLowerCase() === content.toLowerCase().trim(),
    )
    if (!manufacturer) {
      return null
    }

    return manufacturer
  }

  async findByCnpj(cnpj: string) {
    const manufacturer = this.items.find(
      (item) => item.cnpj.toLowerCase() === cnpj.toLowerCase().trim(),
    )

    if (!manufacturer) {
      return null
    }

    return manufacturer
  }

  async findMany(
    { page }: PaginationParams,
    content?: string,
    cnpj?: string,
  ): Promise<{ manufacturers: Manufacturer[]; meta: Meta }> {
    const manufacturers = this.items

    const manufacturersFiltered = manufacturers
      .filter(item => {
        if (content && !item.content.includes(content)) {
          return null
        }
        if (cnpj && !item.cnpj.includes(cnpj)) {
          return null
        }
        return true
      })
      .sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      )

    const manufacturersPaginated = manufacturersFiltered.slice(
      (page - 1) * 20,
      page * 20,
    )

    return {
      manufacturers: manufacturersPaginated,
      meta: {
        page,
        totalCount: manufacturersFiltered.length,
      },
    }
  }

  async delete(id: string): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id.equal(new UniqueEntityId(id)))

    this.items.splice(itemIndex)
  }
}
