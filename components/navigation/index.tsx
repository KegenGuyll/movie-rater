import clsx from 'clsx';
import { useRouter } from 'next/dist/client/router';
import { FormEvent, FunctionComponent, useState } from 'react';

const Search: FunctionComponent = () => {
  const [hover, setHover] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const router = useRouter();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!search) return;

    router.push(`/movies/search?search=${search}`);
  };

  return (
    <div
      onClick={() => setHover(true)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className='flex items-center cursor-pointer transition-colors duration-150 text-dark-text hover:bg-dark-background rounded-full p-3'>
      <span className='material-icons-outlined mr-3'>search</span>
      <form className='flex items-center' onSubmit={onSubmit}>
        <input
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          className={clsx(
            hover ? 'block' : 'hidden',
            'py-1 pl-3 mr-3 bg-dark-components focus:outline-none rounded-full'
          )}
        />
        {!!search && (
          <button type='submit' className={clsx(hover ? 'block' : 'hidden')}>
            <span className='material-icons-outlined'>check</span>
          </button>
        )}
      </form>
    </div>
  );
};

const Navigation: FunctionComponent = () => {
  return (
    <nav className='mb-10'>
      <div className='flex items-center bg-dark-components h-16 w-full'>
        <Search />
      </div>
    </nav>
  );
};

export default Navigation;
