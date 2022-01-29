import clsx from 'clsx';
import React, {
  FormEvent,
  FunctionComponent,
  HtmlHTMLAttributes,
  useState,
} from 'react';

interface Props extends HtmlHTMLAttributes<HTMLDivElement> {
  // eslint-disable-next-line no-unused-vars
  submitFunction: (text: string) => void;
}

const Search: FunctionComponent<Props> = ({
  submitFunction,
  className,
  ...props
}) => {
  const [search, setSearch] = useState<string>('');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!search) return;

    submitFunction(search);
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div className={clsx(className, 'flex text-dark-text ')} {...props}>
      <form className="w-full" onSubmit={onSubmit}>
        <input
          className={clsx(
            'py-[7px] px-3 w-full bg-dark-background rounded',
            'focus:border focus:border-cta transition-colors duration-300 focus:outline-none'
          )}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
      </form>
      <button
        className={clsx(
          'py-[7px] px-3 rounded-r bg-dark-light flex items-center justify-center',
          'focus:border focus:border-cta transition-colors duration-300 focus:outline-none'
        )}
        type="button"
        onClick={(e: any) => onSubmit(e)}
      >
        <span className="material-icons-outlined px-4 ">search</span>
      </button>
    </div>
  );
};

export default Search;
