import { FunctionComponent } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  children: React.ReactNode;
}

const Modal: FunctionComponent<Props> = ({
  open,
  setOpen,
  children,
}: Props) => {
  if (!open) {
    document.body.style.overflow = 'unset';
    return null;
  }

  document.body.scrollTop = document.documentElement.scrollTop = 0;
  document.body.style.overflow = 'hidden';

  return (
    <div className='absolute top-0 z-50 min-h-full w-full bg-black bg-opacity-25'>
      <OutsideClickHandler onOutsideClick={(e) => setOpen(false)}>
        <div className='absolute h-full mx-auto w-3/4 bg-dark-background p-5 overflow-scroll'>
          <button
            onClick={(e) => setOpen(false)}
            className='text-dark-text mb-10 float-right'>
            <span className='material-icons '>close</span>
          </button>
          <div className='mt-10'>{children}</div>
        </div>
      </OutsideClickHandler>
    </div>
  );
};

export default Modal;
