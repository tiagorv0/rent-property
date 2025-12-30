import { FilterQuery, Model, Document } from 'mongoose';
import { PaginateDto, PaginationDto } from '../dto/paginate.dto';

export async function paginate<T, TDocument>(
  model: Model<TDocument>,
  query: FilterQuery<TDocument>,
  {
    page = 1,
    limit = 15,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  }: PaginationDto,
): Promise<PaginateDto<T>> {
  const skip = (page - 1) * limit;

  const sort: any = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const [data, total] = await Promise.all([
    model.find(query).skip(skip).limit(limit).sort(sort).lean().exec(),
    model.countDocuments(query).exec(),
  ]);

  const result: PaginateDto<T> = {
    data: data as T[],
    pagination: {
      currentPage: page,
      limitPerPage: limit,
      totalItems: total,
    },
  };

  return result;
}
