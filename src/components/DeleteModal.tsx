import { ExclamationCircleIcon } from "@heroicons/react/16/solid";
import Modal from "./Modal";
import { useTask } from "@/store/TaskContext";
import { Task } from "@/model/task";

type DeleteModalProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DeleteModal({open,setOpen}:DeleteModalProps)
{
    const {
        deleteTask,
        onDelete,
        clearDeleteTask,
        } = useTask();
    function handleDelete(){
        onDelete(deleteTask as Task);
        clearDeleteTask();
        setOpen(false);
    }
    return (
        <Modal open={open} setOpen={setOpen} className='sm:max-w-md'>
            <div className="sm:flex sm:items-start">
                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                  <ExclamationCircleIcon aria-hidden="true" className="size-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-base font-semibold text-gray-900">
                    Delete Card
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this card?
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:ml-10 sm:flex sm:pl-4">
                <button
                  type="button"
                  onClick={() => handleDelete()}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:w-auto"
                >
                  Delete
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto"
                >
                  Cancel
                </button>
            </div>
        </Modal>
    )
}