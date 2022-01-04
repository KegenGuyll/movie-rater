import clsx from 'clsx';
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
    <div className=' bg-dark-light bg-opacity-50 absolute z-50 top-0 bottom-0 right-0 left-0'>
      <OutsideClickHandler onOutsideClick={(e) => setOpen(false)}>
        <div
          className={clsx(
            'absolute px-4 pt-8 pb-8 max-w-2xl max-h-fit overflow-auto m-auto top-0 bottom-0 right-0 left-0 z-50 rounded',
            'bg-dark-background shadow transition-height duration-150'
          )}>
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
