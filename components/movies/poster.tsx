import { FunctionComponent, useState } from 'react';
import Image from 'next/image';
import PosterDescription from './posterDescription';
import { useRouter } from 'next/dist/client/router';

interface Props {
  title: string;
  uuid: string;
  type: string;
  year: string;
  img?: string;
  clickable?: boolean;
}

const Poster: FunctionComponent<Props> = ({
  title,
  uuid,
  type,
  img,
  year,
  clickable,
}) => {
  const [hover, setHover] = useState<boolean>(false);
  const [display, setDisplay] = useState<boolean>(true);
  const router = useRouter();

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
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className='bg-black cursor-pointer w-32 h-52 md:w-48 md:h-80 rounded relative'>
      <Image
        className='rounded object-fill transition-opacity select-none duration-150 opacity-60 hover:opacity-100'
        layout='fill'
        objectFit='fill'
        src={
          img ? img : `http://img.omdbapi.com/?i=${uuid}&h=600&apikey=8a6ad534`
        }
        alt={title}
        onError={imgNotFound}
      />
      <PosterDescription uuid={uuid} type={type} hover={hover} title={title} />
    </button>
  );
};

Poster.defaultProps = {
  clickable: true,
};

export default Poster;
