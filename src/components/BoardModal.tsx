import { useEffect, useState } from 'react';
import Modal from './Modal';
import { useBoard } from './BoardContext';

type BoardModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

interface BoardForm{
  id: string;
  title: string;
}

export default function BoardModal({open,setOpen}:BoardModalProps) {
    const {
      createBoard,
      editBoard,
      currentBoard,
      setCurrentBoard,
    } = useBoard();
    

  const defaultFormData: BoardForm = {
      id: '',
      title: '',
  };
  
  const [formData, setFormData] = useState<BoardForm>(defaultFormData);

  useEffect(() => {
    if (currentBoard) {
      setFormData({
        id: currentBoard.id || '',
        title: currentBoard.title || '',
      });
    }
  }, [currentBoard]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.title) {
      alert("Please fill out all required fields.");
      return;
    }
  
    if(currentBoard)
    {
      editBoard(currentBoard.id, formData.title);
    }else{    
      createBoard(formData.title);
    }
    
    handleClear();
    setFormData(defaultFormData);
  };
  
  const handleClear = () => {
    setOpen(false);
    setCurrentBoard(null);
  }

  return (
    <Modal open={open} setOpen={setOpen} className='sm:max-w-md'>
      <form onSubmit={handleSubmit}>
        <h1 className="text-xl font-bold text-center"> Board Modal Form</h1>
        <div className="col-span-full mt-2">
          <label htmlFor="description" className="block text-sm/6 font-medium">
            Title
          </label>
          <div className="mt-2">
            <input
              type='text'
              id="title"
              name="title"
              onChange={handleChange}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              defaultValue={formData?.title}
            />
          </div>
        </div>
        <div className="mt-5 sm:mt-6 flex justify-center gap-4 w-2/3 mx-auto">
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
      </div>
      </form>
    </Modal>
  )
}
