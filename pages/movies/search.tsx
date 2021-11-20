import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import MediaCard from '../../components/mediaCard';
import Navigation from '../../components/navigation';
import Spinner from '../../components/spinner';
import Typography from '../../components/typography';
import getRottenTomatoesSearch from '../../endpoints/getRottenTomatoesSearch';
import { RottenTomatoesSearch } from '../../models/rottenTomatoes';

const Search: NextPage = () => {
  const [results, setResults] = useState<RottenTomatoesSearch[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();

  const search = useMemo(() => router.query.search, [router.query]);

  useEffect(() => {
    if (search && typeof search === 'string') {
      setIsLoading(true);
      getRottenTomatoesSearch(search).then(({ res }) => {
        if (res) {
          setIsLoading(false);
          setResults(res.data);
        }
      });
    }
  }, [search]);

  const onSelect = (value: RottenTomatoesSearch) => {
    router.push(`/movies/${value.title}?year=${value.year}`);
  };

  if (!results || isLoading) {
    return (
      <div className='h-screen w-full justify-center text-dark-text text-xl relative'>
        <div className='absolute bottom-1/2 top-1/2 m-auto right-1/2'>
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {results.map((value, key) => (
          <MediaCard onClick={() => onSelect(value)} key={key}>
            <div className='flex items-center'>
              <div className='mr-5'>
                <Image
                  className='rounded'
                  src={value.img}
                  width={137}
                  height={221}
                  alt={value.title}
                />
              </div>
              <div className='flex flex-col'>
                <Typography variant='h3'>{value.title}</Typography>
                <Typography>{value.year}</Typography>
              </div>
            </div>
          </MediaCard>
        ))}
      </div>
    </div>
  );
};

export default Search;
