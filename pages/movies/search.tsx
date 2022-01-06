import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import MediaCard from '../../components/mediaCard';
import Navigation from '../../components/navigation';
import Spinner from '../../components/spinner';
import Typography from '../../components/typography';
import searchIMDBMovie from '../../endpoints/imdb/searchIMDBMovie';
import { IMDBMovie } from '../../models/imdb/popular';

const Search: NextPage = () => {
  const [results, setResults] = useState<IMDBMovie[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();

  const search = useMemo(() => router.query.search, [router.query]);

  useEffect(() => {
    if (search && typeof search === 'string') {
      setIsLoading(true);
      searchIMDBMovie(search).then(({ res }) => {
        if (res) {
          setIsLoading(false);
          setResults(res.data);
        }
      });
    }
  }, [search]);

  const onSelect = (value: IMDBMovie) => {
    router.push(
      `/movies/${value.title}?year=${value.year}&imdbuuid=${value.uuid}`
    );
  };

  return (
    <div>
      <Navigation />
      <div className='lg:px-4'>
        {!results || isLoading ? (
          <div className='flex h-full w-full justify-center items-center text-dark-text text-xl'>
            <Spinner />
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {results.map((value, key) => (
              <MediaCard onClick={() => onSelect(value)} key={key}>
                <div className='flex items-center'>
                  <div className='mr-5'>
                    {value.poster && (
                      <Image
                        className='rounded'
                        src={value.poster}
                        width={137}
                        height={221}
                        alt={value.title}
                      />
                    )}
                  </div>
                  <div className='flex flex-col'>
                    <Typography variant='h3'>{value.title}</Typography>
                    <Typography>{value.year}</Typography>
                  </div>
                </div>
              </MediaCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
