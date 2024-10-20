import { NotFoundException } from '@nestjs/common';
import { BaseQueryCoreService } from 'src/core/base-query-core/base-query-core.service';
import {
  BaseQueryCoreDto,
  CoreIncludesDto,
} from 'src/core/base-query-core/dto/base-query-core.dto';

type ErrorMessageType = 'NOT_FOUND' | 'DELETED';

export type ServiceErrorMessage = {
  [key in ErrorMessageType]: string;
};

export abstract class PrismaBaseRepository<
  ModelEntity,
  ModelPaginate,
  CreateArgs,
  UpdateArgs extends { where: Record<string, any> },
  UpdateManyArgs extends { where?: Record<string, any> },
  FindUniqueArgs extends { where: Record<string, any> },
  FindFirstArgs extends { where?: Record<string, any> },
  FindManyArgs extends {
    where?: Record<string, any>;
    skip?: number;
    take?: number;
  },
  DeleteArgs extends { where: Record<string, any> },
  DeleteManyArgs extends { where?: Record<string, any> },
  CountArgs extends { where?: Record<string, any> },
> {
  constructor(
    private readonly repo: any,
    public errorMessage: ServiceErrorMessage,
    public baseQueryCoreService: any = new BaseQueryCoreService(),
  ) {}

  async findPaginate(
    query: BaseQueryCoreDto,
    baseWhere = {},
  ): Promise<ModelPaginate | any> {
    const updatedQuery = this.baseQueryCoreService.generatePrismaQuery(query);

    const { skip = 0, take = 10, where = {}, ...rest } = updatedQuery;

    let list = await this.repo.findMany({
      skip,
      take: take + 1,
      where: {
        ...where,
        ...baseWhere,
      },
      ...rest,
    });

    const total = await this.repo.count({
      where: {
        ...where,
        ...baseWhere,
      },
    });

    let hasMany = false;
    if (list.length > take) {
      hasMany = true;
      list = list.slice(0, -1);
    }

    return {
      total,
      list,
      hasMany,
      count: list.length,
    };
  }

  async findPaginateV2(
    query: BaseQueryCoreDto,
    baseWhere = {},
  ): Promise<ModelPaginate | any> {
    const updatedQuery = this.baseQueryCoreService.generatePrismaQuery(query);

    const { where = {}, ...rest } = updatedQuery;

    const list = await this.repo.findMany({
      where: {
        ...where,
        ...baseWhere,
      },
      ...rest,
    });

    return {
      list,
      count: list.length,
    };
  }

  checkId(params: { where: any }): Promise<ModelEntity> {
    return this.repo.findUnique({ where: params.where }).catch(() => {
      throw new NotFoundException(this.errorMessage.NOT_FOUND);
    });
  }

  create(params: CreateArgs): Promise<ModelEntity> {
    return this.repo.create(params);
  }

  async getCount(params: CountArgs): Promise<any> {
    return this.repo.count(params);
  }

  async update(params: UpdateArgs): Promise<ModelEntity> {
    await this.checkId({ where: params.where });
    return this.repo.update(params);
  }

  updateMany(params: UpdateManyArgs): Promise<void> {
    return this.repo.updateMany(params);
  }

  async findUnique(params: FindUniqueArgs): Promise<ModelEntity> {
    const returnData = await this.repo.findUnique(params).catch(() => {
      throw new NotFoundException(this.errorMessage.NOT_FOUND);
    });

    if (returnData?.isDeleted) {
      throw new NotFoundException(this.errorMessage.DELETED);
    }

    return returnData;
  }

  findFirst(params: FindFirstArgs): Promise<ModelEntity> {
    return this.repo.findFirst(params).catch(() => {
      throw new NotFoundException(this.errorMessage.NOT_FOUND);
    });
  }

  findMany(params: FindManyArgs): Promise<ModelEntity[]> {
    return this.repo.findMany(params);
  }

  deleteMany(params: DeleteManyArgs): Promise<void> {
    return this.repo.deleteMany(params);
  }

  async delete(params: DeleteArgs): Promise<ModelEntity> {
    await this.checkId({ where: params.where });
    return this.repo.delete(params);
  }

  async findUniqueIncludes(
    params: FindUniqueArgs,
    query: CoreIncludesDto,
  ): Promise<ModelEntity> {
    const updatedQuery = this.baseQueryCoreService.generatePrismaQuery(query);
    const returnData = await this.repo
      .findUnique({ ...params, ...updatedQuery })
      .catch(() => {
        throw new NotFoundException(this.errorMessage.NOT_FOUND);
      });
    if (returnData?.isDeleted) {
      throw new NotFoundException(this.errorMessage.DELETED);
    }
    return returnData;
  }
}
