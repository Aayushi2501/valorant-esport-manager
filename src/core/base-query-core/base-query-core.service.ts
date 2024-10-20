import { Injectable } from '@nestjs/common';
import { BaseQueryCoreDto } from './dto/base-query-core.dto';
import * as _ from 'lodash';

@Injectable()
export class BaseQueryCoreService {
  generatePrismaQuery(query: BaseQueryCoreDto = {}) {
    const tempQuery: any = { ...query };
    if (typeof tempQuery?.orderBy === 'string') {
      tempQuery.orderBy = [tempQuery?.orderBy];
    }
    if (typeof tempQuery?.include === 'string') {
      tempQuery.include = [tempQuery?.include];
    }
    if (typeof tempQuery?.search_column === 'string') {
      tempQuery.search_column = [tempQuery?.search_column];
    }

    if (tempQuery?.orderBy?.length > 0) {
      const orderBy = {};
      tempQuery.orderBy.forEach((ob) => {
        let sortField = ob.split('|')[0];

        sortField = sortField.split('.');

        if (sortField.length > 1) {
          orderBy[sortField[0]] = this.getOrderByArray(
            sortField,
            ob.split('|')[1],
          );
        } else {
          orderBy[sortField[0]] = ob.split('|')[1];
        }
      });

      tempQuery.orderBy = orderBy;
    }

    if (tempQuery?.include?.length > 0) {
      const formattedQry = this.formatIncludeQueryArray(
        tempQuery.include.sort(),
      );

      const { include } = this.getIncludeArray(formattedQry);

      tempQuery.include = include;
    }

    if (tempQuery?.search_column?.length > 0 && tempQuery?.search?.length > 0) {
      const formattedSearchQry = this.formatSearchQueryArray(
        tempQuery.search_column.sort(),
        {
          contains: tempQuery?.search,
          // mode: 'insensitive'
        },
      );

      tempQuery['where'] = formattedSearchQry;
    }

    delete tempQuery?.search_column;
    delete tempQuery?.search;

    return tempQuery;
  }

  formatIncludeQueryArray(queryArr: any, baseVal: any = true) {
    let returnObj = {};

    queryArr.map((qry, i) => {
      const rslt = this.formatArray(qry, baseVal);
      if (i > 0) {
        returnObj = _.merge(returnObj, rslt);
      } else {
        returnObj = rslt;
      }
    });

    return returnObj;
  }

  formatSearchQueryArray(queryArr: any, baseVal: any) {
    const returnObj = [];

    queryArr.map((qry, i) => {
      returnObj[i] = this.formatArray(qry, baseVal);
    });

    return { OR: returnObj };
  }

  formatArray(qry: any, baseVal: any) {
    const returnObj = {};

    const qArr = qry.split('.');

    if (qArr.length > 1) {
      const ky = qArr[0];
      qArr.shift();

      if (typeof returnObj[ky] === 'undefined') {
        returnObj[ky] = this.formatArray(qArr.join('.'), baseVal);
      } else {
        returnObj[ky] = {
          ...returnObj[ky],
          ...this.formatArray(qArr.join('.'), baseVal),
        };
      }
    } else {
      returnObj[qArr[0]] = baseVal;
    }

    return returnObj;
  }

  getOrderByArray(fieldArr: any, sort) {
    fieldArr.shift();

    const incO: any = {};
    incO[fieldArr[0]] =
      fieldArr.length > 1 ? this.getOrderByArray(fieldArr, sort) : sort;

    return incO;
  }

  getIncludeArray(incArr: any) {
    const include = {};

    for (const key in incArr) {
      if (incArr.hasOwnProperty(key)) {
        if (incArr[key] === true) {
          include[key] = true;
        } else {
          include[key] = this.getIncludeArray(incArr[key]);
        }
      }
    }

    return { include };
  }
}
