import clsx from 'clsx';
import React from 'react';

interface Props extends React.HTMLAttributes<HTMLElement> {
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'subtitle'
    | 'body'
    | 'light'
    | 'h4'
    | 'h5'
    | 'legal';
  children: React.ReactNode;
}

const variantsMapping = {
  body: 'p',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  legal: 'p',
  light: 'p',
  subtitle: 'p',
};

const Typography: React.FunctionComponent<Props> = ({
  variant,
  className,
  ...props
}: Props) => {
  const Component = React.createElement(variantsMapping[variant || 'body'], {
    className: clsx(`typography--variant-${variant}`, className),
    ...props,
  });

  return Component;
};

Typography.defaultProps = {
  variant: 'body',
};

export default Typography;
