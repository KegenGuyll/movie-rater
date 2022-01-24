/** @type {import('next').NextConfig} */
module.exports = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      require('./scripts/generate-sitemap.js');
    }

    return config;
  },
  reactStrictMode: true,
  images: {
    domains: [
      'm.media-amazon.com',
      'img.omdbapi.com',
      'media.giphy.com',
      'resizing.flixster.com',
      'staticv2-4.rottentomatoes.com',
      'lh3.googleusercontent.com',
      'www.rottentomatoes.com',
      'avatars.dicebear.com',
      'image.tmdb.org',
    ],
  },
  swcMinify: true,
};
