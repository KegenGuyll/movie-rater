import React, { FunctionComponent, useEffect, useState } from 'react';

import { copyToClipboard } from '../utils/common';

interface Props {
  link: string;
}

const CopyLink: FunctionComponent<Props> = ({ link }: Props) => {
  const [copiedSuccessful, setCopiedSuccessful] = useState<boolean>(false);

  const resetCopiedValue = () => {
    setTimeout(() => setCopiedSuccessful(false), 1200);
  };

  useEffect(() => {
    if (copiedSuccessful) {
      resetCopiedValue();
    }
  }, [copiedSuccessful]);

  return (
    <button
      className="flex items-center justify-center p-2 rounded-full hover:bg-dark-light hover:bg-opacity-60"
      type="button"
      onClick={() =>
        copyToClipboard(`https://movielot.vercel.app${link}`, () =>
          setCopiedSuccessful(true)
        )
      }
    >
      <span className="material-icons-outlined">
        {!copiedSuccessful ? 'link' : 'done'}
      </span>
    </button>
  );
};

export default CopyLink;
