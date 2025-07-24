import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import clsx from 'clsx';

type ModalProps = {
    children:React.ReactNode;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    className?:string;
};

export default function Modal({
  children,
  open,
  setOpen,
  className,
}:ModalProps){

  const finalClassName = clsx(
    'relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 w-full sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95',
    !/\bsm:max-w-\w+\b/.test(className ?? '') && 'sm:max-w-sm',
    className
  );
  return (
    <div>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed z-50 inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-51 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className={finalClassName}
            >
              {children}
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
