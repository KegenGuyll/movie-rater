import clsx from 'clsx';
import Link from 'next/link';
import React, { FunctionComponent, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  href: string;
}

const NavItem: FunctionComponent<Props> = ({
  href,
  children,
  className,
  ...props
}) => (
  <Link passHref href={href}>
    <button
      type="button"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      className={clsx(
        className,
        'hover:bg-dark-light',
        'flex items-center mx-4 p-1 rounded',
        'focus:border focus:border-cta transition-colors duration-300 focus:outline-none',
      )}
    >
      {children}
    </button>
  </Link>
);

export default NavItem;
