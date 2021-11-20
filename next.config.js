/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      'm.media-amazon.com',
      'img.omdbapi.com',
      'media.giphy.com',
      'resizing.flixster.com',
      'staticv2-4.rottentomatoes.com',
    ],
  },
  swcMinify: true,
};
