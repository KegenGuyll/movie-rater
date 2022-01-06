import clsx from 'clsx';
import { FunctionComponent, HTMLAttributes, useEffect, useState } from 'react';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  variant?: 'text' | 'default' | 'primary';
  type?: 'button' | 'submit' | 'reset' | undefined;
}

const Button: FunctionComponent<Props> = ({
  children,
  className,
  variant,
  ...props
}) => {
  const [bg, setBg] = useState('bg-dark-components');
  const [color, setColor] = useState('text-dark-text');
  const [hoverBg, setHoverBg] = useState('hover:bg-dark-light');

  useEffect(() => {
    switch (variant) {
      case 'default':
        setBg('bg-dark-components');
        setColor('text-dark-text');
        setHoverBg('hover:bg-dark-light');
        break;
      case 'primary':
        setBg('bg-cta');
        setColor('text-black');
        setHoverBg('hover:bg-ctaLight');
    }
  }, [variant]);

  return (
    <button
      {...props}
      className={clsx(
        className,
        'py-2 px-4 rounded',
        'focus:border focus:border-cta transition-colors duration-300 focus:outline-none',
        'flex justify-start',
        hoverBg,
        bg,
        color
      )}>
      {children}
    </button>
  );
};

Button.defaultProps = {
  variant: 'default',
  type: 'button',
};

export default Button;