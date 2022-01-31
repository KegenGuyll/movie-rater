import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import clsx from 'clsx';
import React, { FunctionComponent, useState } from 'react';
import SwiperType, { Autoplay, Navigation as SwiperNavigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Movie } from '../../models/TMDB';
import TrailerPreviewCard from './trailerPreviewCard';

interface Props {
  movies: Movie[] | undefined;
}

const TrailerCarousel: FunctionComponent<Props> = ({ movies }: Props) => {
  const [swiperRef, setSwiperRef] = useState<SwiperType>();
  if (!movies) return null;

  return (
    <div className="hidden lg:block">
      <Swiper
        centeredSlides
        grabCursor
        loop
        autoplay={{
          delay: 4500,
          disableOnInteraction: true,
        }}
        className="mySwiper"
        modules={[SwiperNavigation, Autoplay]}
        slidesPerView={1}
        spaceBetween={10}
        onInit={(ev) => setSwiperRef(ev)}
      >
        {swiperRef && (
          <button
            className={clsx(
              'flex items-center justify-center border-2 border-dark-components hover:bg-dark-light p-2 rounded text-dark-text',
              'absolute z-50 top-0 right-12 bottom-0 my-auto h-max'
            )}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              swiperRef.slideNext();
            }}
          >
            <span className="material-icons-outlined">arrow_forward_ios</span>
          </button>
        )}
        {swiperRef && (
          <button
            className={clsx(
              'flex items-center justify-center border-2 border-dark-components hover:bg-dark-light p-2 rounded text-dark-text',
              'absolute z-50 top-0 left-12 bottom-0 my-auto h-max'
            )}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              swiperRef.slidePrev();
            }}
          >
            <span className="material-icons-outlined">arrow_back_ios</span>
          </button>
        )}

        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <TrailerPreviewCard movie={movie} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TrailerCarousel;
