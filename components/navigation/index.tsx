import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';
import Image from 'next/image';
import Search from '../search';
import Typography from '../typography';
import { useAuth } from '../../context/AuthUserContext';
import NavItem from './navItem';

const Navigation: FunctionComponent = () => {
  const router = useRouter();
  const { authUser } = useAuth();

  const handleSearch = (search: string) => {
    router.push(`/movies/search?search=${search}`);
  };

  return (
    <nav className=' sticky top-0 mb-10 z-50'>
      <div className='flex items-center bg-dark-components text-dark-text px-4 py-4 h-16 w-full'>
        <NavItem href='/'>
          <Image src='/img/brand.svg' width='100' height='42' alt='brand' />
        </NavItem>
        <Search className='min-w-fit flex-grow' submitFunction={handleSearch} />
        <NavItem href='/'>
          <span className='material-icons-outlined mr-4'>trending_up</span>
          <Typography>Trending</Typography>
        </NavItem>
        <NavItem href='/watch-list'>
          <span className='material-icons-outlined mr-4'>list</span>
          <Typography>Watch List</Typography>
        </NavItem>
        {authUser && (
          <NavItem href='/my-movies'>
            <div className='mr-4 flex items-center'>
              <Image
                className='rounded-full'
                src={authUser.photoURL || ''}
                height='40'
                width='40'
                alt={authUser.displayName || 'user'}
              />
            </div>
            <Typography>{authUser.displayName}</Typography>
          </NavItem>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
