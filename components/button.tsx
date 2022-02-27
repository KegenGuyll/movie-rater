import clsx from 'clsx';
import React, {
  FunctionComponent,
  HTMLAttributes,
  useEffect,
  useState,
} from 'react';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  variant?: 'text' | 'default' | 'primary';
  type?: 'button' | 'submit' | 'reset' | undefined;
  disabled?: boolean;
}

const Button: FunctionComponent<Props> = ({
  children,
  className,
  variant,
  disabled,
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
        break;
      default:
        setBg('bg-dark-components');
        setColor('text-dark-text');
        setHoverBg('hover:bg-dark-light');
        break;
    }
  }, [variant]);

  return (
    <button
      type="button"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      className={clsx(
        className,
        'py-2 px-4 rounded',
        'focus:border focus:border-cta transition-colors duration-300 focus:outline-none',
        'flex justify-start',
        'disabled:bg-opacity-25',
        !disabled && hoverBg,
        disabled && 'cursor-not-allowed',
        bg,
        color
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

Button.defaultProps = {
  disabled: false,
  type: 'button',
  variant: 'default',
};

export default Button;
