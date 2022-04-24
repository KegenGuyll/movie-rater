import clsx from 'clsx';
import debounce from 'lodash.debounce';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';

import searchWatchList, {
  WatchListSearch,
} from '../../endpoints/watchlist/searchWatchList';
import Logger from '../../utils/logger';

interface Props {
  setSearchResults: React.Dispatch<
    React.SetStateAction<WatchListSearch[] | undefined>
  >;
}

const SearchWatchList: FunctionComponent<Props> = ({
  setSearchResults,
}: Props) => {
  const [query, setQuery] = useState('');

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const debouncedChangeHandler = useCallback(debounce(changeHandler, 300), []);

  const handleFetch = async () => {
    const { res, err } = await searchWatchList(query);

    if (res) {
      setSearchResults(res.data);
    }

    if (err) {
      Logger.error(err);
    }
  };

  useEffect(() => {
    if (query) {
      handleFetch();
    }
  }, [query]);

  return (
    <div className="flex relative text-dark-text">
      <form className="w-full">
        <input
          aria-label="search box"
          className={clsx(
            'py-[12px] px-3 w-full bg-dark-components rounded',
            'focus:border focus:border-cta transition-colors duration-300 focus:outline-none',
          )}
          onChange={debouncedChangeHandler}
        />
      </form>
      <button
        className={clsx(
          'py-[7px] px-3 rounded-r bg-dark-light flex items-center justify-center',
          'focus:border focus:border-cta transition-colors duration-300 focus:outline-none',
        )}
        type="button"
      >
        <span className="material-icons-outlined px-4 ">search</span>
      </button>
    </div>
  );
};

export default SearchWatchList;
