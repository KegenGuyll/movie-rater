import clsx from 'clsx';
import { FunctionComponent } from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const MediaCard: FunctionComponent<Props> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={clsx(
        'rounded w-full p-3 bg-dark-components text-dark-text',
        className
      )}>
      {children}
    </div>
  );
};

export default MediaCard;
