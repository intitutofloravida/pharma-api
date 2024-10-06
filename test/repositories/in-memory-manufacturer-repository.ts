import type { ManufacturerRepository } from '@/domain/pharma/application/repositories/manufacturer-repository'
import type { Manufacturer } from '@/domain/pharma/enterprise/entities/manufacturer'

export class InMemoryManufacturerRepository implements ManufacturerRepository {
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
}
