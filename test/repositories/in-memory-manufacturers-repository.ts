import { PaginationParams } from '@/core/repositories/pagination-params'
import { ManufacturersRepository } from '@/domain/pharma/application/repositories/manufacturers-repository'
import { Manufacturer } from '@/domain/pharma/enterprise/entities/manufacturer'

export class InMemoryManufacturersRepository implements ManufacturersRepository {
  public items: Manufacturer[] = []

  async create(manufacturer: Manufacturer) {
    this.items.push(manufacturer)
  }

  async findByContent(content: string) {
    const manufacturer = this.items.find(item => item.content.toLowerCase() === content.toLowerCase().trim())
    if (!manufacturer) {
      return null
    }

    return manufacturer
  }

  async findByCnpj(cnpj: string) {
    const manufacturer = this.items.find(item => item.cnpj.toLowerCase() === cnpj.toLowerCase().trim())

    if (!manufacturer) {
      return null
    }

    return manufacturer
  }

  async findMany({ page }: PaginationParams): Promise<Manufacturer[]> {
    const manufacturers = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return manufacturers
  }
}
