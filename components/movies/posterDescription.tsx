import clsx from 'clsx';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import getIMDBMovie from '../../endpoints/getImdbMovie';
import { IMDBMovie } from '../../models/imdb/popular';
import Spinner from '../spinner';
import Typography from '../typography';
import MovieRating from './rating';

interface Props {
  hover: boolean;
  title: string;
  type: string;
  uuid: string;
}

const PosterDescription: FunctionComponent<Props> = ({
  hover,
  title,
  type,
  uuid,
}: Props) => {
  const [details, setDetails] = useState<IMDBMovie | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  useEffect(() => {
    let timeout: any = null;
    if (hover) {
      timeout = setTimeout(() => {
        setShowDetails(true);
        if (!details) {
          getIMDBMovie(type, uuid).then(({ res }) => {
            if (res) {
              setDetails(res.data);
            }
          });
        }
      }, 700);
    } else {
      setShowDetails(false);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [hover, details, uuid, type]);

  if (!hover) return null;

  const renderedDetails = () => {
    if (showDetails) {
      return (
        <div>
          {details ? (
            <Typography>{details.movieSynopsis}</Typography>
          ) : (
            <Spinner />
          )}
        </div>
      );
    } else null;
  };

  return (
    <div
      className={clsx([
        'absolute bottom-0 w-full bg-dark-components text-dark-text rounded-b  transition-height duration-150',
        showDetails ? 'h-72 p-3' : 'h-14 p-2 overflow-hidden whitespace-nowrap',
      ])}>
      <Typography
        className='mb-4 flex items-center overflow-ellipsis'
        variant='h4'>
        {title}
        {details && showDetails && (
          <div className='ml-2'>
            <MovieRating rating={details.rating} />
          </div>
        )}
      </Typography>
      {renderedDetails()}
    </div>
  );
};

export default PosterDescription;
