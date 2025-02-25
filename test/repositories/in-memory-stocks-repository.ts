import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Meta } from '@/core/repositories/meta'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { InstitutionsRepository } from '@/domain/pharma/application/repositories/institutions-repository'
import {
  StocksRepository,
  type StockWithInstitution,
} from '@/domain/pharma/application/repositories/stocks-repository'
import { Stock } from '@/domain/pharma/enterprise/entities/stock'

export class InMemoryStocksRepository implements StocksRepository {
  constructor(private institutionsRepository: InstitutionsRepository) {}

  public items: Stock[] = []

  async create(stock: Stock) {
    this.items.push(stock)
  }

  async findByContent(content: string, institutionId: string) {
    const stock = this.items.find(
      (item) =>
        item.content.toLowerCase().trim() === content.toLowerCase().trim() &&
        item.institutionId.toString() === institutionId,
    )
    if (!stock) {
      return null
    }
    return stock
  }

  async findById(id: string) {
    const stock = this.items.find((item) => item.id.equal(new UniqueEntityId(id)))
    if (!stock) {
      return null
    }
    return stock
  }

  async findManyByInstitutionsId(
    { page }: PaginationParams,
    institutionsIds: string[],
  ): Promise<Stock[]> {
    const stocks = this.items
      .filter((item) => institutionsIds.includes(item.institutionId.toString()))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 10, page * 10)

    return stocks
  }

  async findManyWithInstitution(
    { page }: PaginationParams,
    institutionsIds: string[],
    content?: string,
    isSuper = false,
  ): Promise<{ stocks: StockWithInstitution[]; meta: Meta }> {
    let stocks = this.items.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    )

    if (!isSuper) {
      stocks = stocks.filter((item) =>
        institutionsIds
          ? institutionsIds.includes(item.institutionId.toString())
          : false,
      )
    }
    const stocksFiltered = stocks.filter(item => {
      return item.content.includes(content ?? '')
    })
    const stocksPaginated = stocksFiltered.slice((page - 1) * 10, page * 10)

    const stocksWithInstitution = await Promise.all(
      stocksPaginated.map(async (stock) => {
        const institution = await this.institutionsRepository.findById(
          stock.institutionId.toString(),
        )

        return {
          stock,
          institutionName: institution
            ? institution.content
            : '',
        }
      }),
    )

    return {
      stocks: stocksWithInstitution,
      meta: {
        page,
        totalCount: stocksFiltered.length,
      },
    }
  }
}
