
interface IQuery {
  limit?: number,
  page?: number
}

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0; // A page limit of 0 returns entire collection in mongodb

function getPagination(query: IQuery) {
  const page = Math.abs(query.page ?? DEFAULT_PAGE_NUMBER);
  const limit = Math.abs(query.limit ?? DEFAULT_PAGE_LIMIT);
  const skip = Math.max(...[(page - 1) * limit, 0]);

  return {
    skip,
    limit
  }
}

export {
  IQuery,

  getPagination
}