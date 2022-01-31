const imageUrl = (w: number, resized = true) => {
  if (resized) {
    return `https://image.tmdb.org/t/p/w${w}`;
  }

  return `https://image.tmdb.org/t/p/original`;
};

export default imageUrl;
