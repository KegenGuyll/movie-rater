import React, { FunctionComponent } from 'react';

import Typography from '../typography';

interface Props {
  visible?: boolean;
}

const WatchListVisibility: FunctionComponent<Props> = ({ visible }) => {
  if (typeof visible === 'undefined') return null;

  return (
    <div className="py-1 px-2 rounded-full border border-dark-text  text-dark-text">
      <Typography>{visible ? 'Public' : 'Private'}</Typography>
    </div>
  );
};

WatchListVisibility.defaultProps = {
  visible: false,
};

export default WatchListVisibility;
