export const parseQueryObj = (query: any, queryFilters?: string[]) => {

  const params: any = {}
  params.page = query.page; // Page defaults to 1
  params.limit = query.limit// Limit defaults to 20, max is 200
  params.skip = (params.page - 1) * params.limit;
  params.sort = { [query.sort_by]: query.order }; // i.e { created_at: -1 or 'desc } OR '-created_at'

  // extract filters and add to where query for db processing
  params.where = {};

  if (queryFilters) {
    queryFilters.forEach((val) => {
      if (query[val])
        params.where[val] = query[val];
    });
  }
  return params;
};
