import { FunctionComponent, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/dist/client/router';
import PopularityRating from './popularityRating';
import { IMDBPopular } from '../../models/imdb/popular';

interface Props {
  movie: IMDBPopular;
  clickable?: boolean;
}

const Poster: FunctionComponent<Props> = ({ movie, clickable }) => {
  const [display, setDisplay] = useState<boolean>(true);
  const router = useRouter();
  const { title, uuid, img, year } = movie;

  const imgNotFound = () => {
    setDisplay(false);
  };

  if (!display) return null;

  const onClick = (title: string, year: string) => {
    router.push(`/movies/${title}?year=${year}&imdbuuid=${uuid}`);
  };

  return (
    <button
      disabled={!clickable}
      type='button'
      onClick={() => onClick(title, year)}
      className='bg-black cursor-pointer w-32 h-52 md:w-48 md:h-80 rounded relative'>
      <Image
        className='rounded object-fill select-none'
        layout='fill'
        objectFit='fill'
        src={
          img ? img : `http://img.omdbapi.com/?i=${uuid}&h=600&apikey=8a6ad534`
        }
        alt={title}
        onError={imgNotFound}
      />
      <div className='absolute top-1 right-1'>
        <PopularityRating movie={movie} />
      </div>
    </button>
  );
};

Poster.defaultProps = {
  clickable: true,
};

export default Poster;
