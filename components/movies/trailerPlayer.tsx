/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useRouter } from 'next/router';
import React, { FunctionComponent, useEffect, useState } from 'react';

interface Props {}

const TrailerPlayer: FunctionComponent<Props> = () => {
  const [key, setKey] = useState<string>();
  const router = useRouter();

  const handleCloseVideo = () => {
    router.push(router.pathname, undefined, { shallow: true });
    setKey(undefined);
  };

  useEffect(() => {
    if (router.query.key) {
      if (typeof router.query.key === 'string') {
        setKey(router.query.key);
      }
    }
  }, [router.query]);

  if (!key) return null;

  return (
    <div className="fixed z-50 top-0 left-0 bottom-0 right-0 h-screen w-screen bg-dark-components bg-opacity-75">
      <span
        className="flex items-center justify-center w-full h-screen"
        onClick={handleCloseVideo}
      >
        <button
          className="flex items-center justify-center absolute top-10 right-10 p-4 rounded-full hover:bg-dark-light text-dark-text"
          type="button"
          onClick={handleCloseVideo}
        >
          <span className="material-icons-outlined">close</span>
        </button>
        <iframe
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="rounded"
          frameBorder="0"
          height="60%"
          src={`https://www.youtube.com/embed/${key}?autoplay=1`}
          title="Movie Trailer"
          width="80%"
        />
      </span>
    </div>
  );
};

export default TrailerPlayer;
