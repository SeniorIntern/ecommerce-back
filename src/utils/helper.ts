const getMongoosePaginationOptions = ({
  page = 1,
  limit = 10,
  // @ts-ignore
  customLabels
}) => {
  return {
    page: Math.max(page, 1),
    limit: Math.max(limit, 1),
    pagination: true,
    customLabels: {
      pagingCounter: 'serialNumberStartFrom',
      ...customLabels
    }
  };
};

export { getMongoosePaginationOptions };
