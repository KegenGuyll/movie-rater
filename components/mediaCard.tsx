import clsx from 'clsx';
import { FunctionComponent } from 'react';
import Typography from './typography';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

const MediaCard: FunctionComponent<Props> = ({
  children,
  title,
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={clsx(
        'rounded w-full min-h-fit max-h-72 overflow-auto  bg-dark-components text-dark-text relative',
        className
      )}>
      {title && (
        <div className='sticky z-30 top-0 w-full bg-dark-components shadow py-4 px-3 lg:px-6 2xl:px-2'>
          <Typography variant='h3'>{title}</Typography>
        </div>
      )}
      <div className='p-3 lg:p-6 2xl:p-2'>{children}</div>
    </div>
  );
};

export default MediaCard;
