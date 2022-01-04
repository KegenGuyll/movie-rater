import clsx from 'clsx';
import React, {
  FormEvent,
  FunctionComponent,
  HtmlHTMLAttributes,
  useState,
} from 'react';

interface Props extends HtmlHTMLAttributes<HTMLDivElement> {
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
    <div className={clsx(className, 'flex text-dark-text ')} {...props}>
      <form onSubmit={onSubmit} className='w-full'>
        <input
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          className={clsx(
            'py-[7px] px-3 w-full bg-dark-background rounded',
            'focus:border focus:border-cta transition-colors duration-300 focus:outline-none'
          )}
        />
      </form>
      <button
        className={clsx(
          'py-[7px] px-3 rounded-r bg-dark-light flex items-center justify-center',
          'focus:border focus:border-cta transition-colors duration-300 focus:outline-none'
        )}
        type='button'
        onClick={(e: any) => onSubmit(e)}>
        <span className='material-icons-outlined px-4 '>search</span>
      </button>
    </div>
  );
};

export default Search;
