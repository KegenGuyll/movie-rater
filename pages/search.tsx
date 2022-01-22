import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Navigation from '../components/navigation';
import Search from '../components/search';

const SearchPage: NextPage = () => {
  const router = useRouter();

  const handleSearch = (search: string) => {
    router.push(`/movies/search?search=${search}`);
  };

  return (
    <div>
      <Navigation />
      <div className=' bg-dark-components p-2 rounded mx-2'>
        <Search submitFunction={handleSearch} />
      </div>
    </div>
  );
};

export default SearchPage;
