import clsx from 'clsx';
import Image from 'next/image';
import React, { FunctionComponent, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

import { useAuth } from '../../context/AuthUserContext';
import Button from '../button';
import Search from '../search';
import Typography from '../typography';
import NavItem from './navItem';

const Navigation: FunctionComponent = () => {
  const { authUser } = useAuth();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <nav className="sticky top-0 mb-10 z-40">
      <div className="flex items-center bg-dark-components text-dark-text px-4 py-4 h-16 w-full">
        <NavItem className="flex-grow lg:flex-none" href="/">
          <Image alt="brand" height="42" src="/img/brand.svg" width="100" />
        </NavItem>
        <Search className="min-w-fit flex-grow hidden lg:flex" />
        <NavItem className="hidden lg:flex" href="/">
          <span className="material-icons-outlined mr-4">trending_up</span>
          <Typography>Trending</Typography>
        </NavItem>
        <NavItem className="hidden lg:flex" href="/watch-list">
          <span className="material-icons-outlined mr-4">list</span>
          <Typography>Watch List</Typography>
        </NavItem>
        <button
          className="flex lg:hidden p-1 rounded hover:bg-dark-light items-center justify-center"
          type="button"
          onClick={() => setOpen(true)}
        >
          <span className="material-icons-outlined">menu</span>
        </button>
        {authUser ? (
          <NavItem className="hidden lg:flex" href={`/user/${authUser.uid}`}>
            <div className="mr-4 flex items-center">
              <Image
                alt={authUser.displayName || 'user'}
                className="rounded-full"
                height="40"
                src={authUser.photoURL || ''}
                width="40"
              />
            </div>
            <Typography>{authUser.displayName}</Typography>
          </NavItem>
        ) : (
          <NavItem className="hidden lg:block" href="/login">
            <Button
              className=" text-dark-background w-full text-center"
              variant="primary"
            >
              Login
            </Button>
          </NavItem>
        )}
      </div>
      {open && (
        <div
          className={clsx(
            'absolute z-50 h-screen w-screen top-0 bg-opacity-50 bg-dark-background',
            'transition-all duration-75'
          )}
        >
          <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
            <aside className="bg-dark-background absolute right-0 top-0 h-screen w-3/5 text-dark-text">
              <ul className=" mt-5 space-y-5">
                <li>
                  {authUser ? (
                    <NavItem href={`/user/${authUser.uid}`}>
                      <div className="mr-4 flex items-center">
                        <Image
                          alt={authUser.displayName || 'user'}
                          className="rounded-full"
                          height="40"
                          src={authUser.photoURL || ''}
                          width="40"
                        />
                      </div>
                      <Typography>{authUser.displayName}</Typography>
                    </NavItem>
                  ) : (
                    <NavItem href="/login">
                      <Button
                        className=" text-dark-background w-full text-center"
                        variant="primary"
                      >
                        Login
                      </Button>
                    </NavItem>
                  )}
                </li>
                <li className="">
                  <NavItem href="/search">
                    <span className="material-icons-outlined mr-4">search</span>
                    <Typography>Search</Typography>
                  </NavItem>
                </li>
                <li className="">
                  <NavItem href="/">
                    <span className="material-icons-outlined mr-4">
                      trending_up
                    </span>
                    <Typography>Trending</Typography>
                  </NavItem>
                </li>
                <li>
                  <NavItem href="/watch-list">
                    <span className="material-icons-outlined mr-4">list</span>
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
