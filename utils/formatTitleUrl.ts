const formatTitleUrl = (title: string, movieId: string | number) => {
  if (!title) return null;

  if (!movieId) return null;

  return `${movieId}-${title
    .toLowerCase()
    .replace(/\//g, '')
    .replace(/\s/g, '-')}`;
};

export default formatTitleUrl;
