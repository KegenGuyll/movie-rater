import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import Image from 'next/image';
import Search from '../search';
import Typography from '../typography';
import { useAuth } from '../../context/AuthUserContext';
import NavItem from './navItem';
import OutsideClickHandler from 'react-outside-click-handler';
import clsx from 'clsx';

const Navigation: FunctionComponent = () => {
  const router = useRouter();
  const { authUser } = useAuth();
  const [open, setOpen] = useState<boolean>(false);

  const handleSearch = (search: string) => {
    router.push(`/movies/search?search=${search}`);
  };

  return (
    <nav className='sticky top-0 mb-10 z-40'>
      <div className='flex items-center bg-dark-components text-dark-text px-4 py-4 h-16 w-full'>
        <NavItem className='flex-grow lg:flex-none' href='/'>
          <Image src='/img/brand.svg' width='100' height='42' alt='brand' />
        </NavItem>
        <Search
          className='min-w-fit flex-grow hidden lg:flex'
          submitFunction={handleSearch}
        />
        <NavItem className='hidden lg:flex' href='/'>
          <span className='material-icons-outlined mr-4'>trending_up</span>
          <Typography>Trending</Typography>
        </NavItem>
        <NavItem className='hidden lg:flex' href='/watch-list'>
          <span className='material-icons-outlined mr-4'>list</span>
          <Typography>Watch List</Typography>
        </NavItem>
        <button
          onClick={() => setOpen(true)}
          className='flex lg:hidden p-1 rounded hover:bg-dark-light items-center justify-center'>
          <span className='material-icons-outlined'>menu</span>
        </button>
        {authUser && (
          <NavItem className='hidden lg:flex' href='/my-movies'>
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
      {open && (
        <div
          className={clsx(
            'absolute z-50 h-screen w-screen top-0 bg-opacity-50 bg-dark-background',
            'transition-all duration-75'
          )}>
          <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
            <aside className='bg-dark-background absolute right-0 top-0 h-screen w-3/5 text-dark-text'>
              <ul className=' mt-5 space-y-5'>
                <li>
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
                </li>
                <li className=''>
                  <NavItem href='/search'>
                    <span className='material-icons-outlined mr-4'>search</span>
                    <Typography>Search</Typography>
                  </NavItem>
                </li>
                <li className=''>
                  <NavItem href='/'>
                    <span className='material-icons-outlined mr-4'>
                      trending_up
                    </span>
                    <Typography>Trending</Typography>
                  </NavItem>
                </li>
                <li>
                  <NavItem href='/watch-list'>
                    <span className='material-icons-outlined mr-4'>list</span>
                    <Typography>Watch List</Typography>
                  </NavItem>
                </li>
              </ul>
            </aside>
          </OutsideClickHandler>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
