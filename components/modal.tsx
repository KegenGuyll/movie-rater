import clsx from 'clsx';
import React, { FunctionComponent } from 'react';

interface Props {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpen: (value: boolean) => void;
  children: React.ReactNode;
}

const Modal: FunctionComponent<Props> = ({
  open,
  setOpen,
  children,
}: Props) => {
  if (!open) {
    if (process.browser) {
      document.body.style.overflow = 'unset';
    }
    return null;
  }

  if (process.browser) {
    // eslint-disable-next-line no-multi-assign
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }

  return (
    <div className=" bg-dark-light bg-opacity-50 absolute z-50 top-0 bottom-0 right-0 left-0">
      <div
        className={clsx(
          'absolute px-4 pt-8 pb-8 max-w-2xl overflow-auto h-3/4 m-auto top-0 bottom-0 right-0 left-0 z-50 rounded',
          'bg-dark-background shadow transition-height duration-150'
        )}
      >
        <button
          className="text-dark-text mb-10 float-right"
          type="button"
          onClick={() => setOpen(false)}
        >
          <span className="material-icons ">close</span>
        </button>
        <div className="mt-10">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
