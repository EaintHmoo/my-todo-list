'use client';

import { useState } from 'react'
import Modal from './Modal';

export default function TaskModal() {
  const [open, setOpen] = useState(true)

  return (
    <Modal open={open} setOpen={setOpen}>
      <form>
        <h1 className="text-xl font-bold text-center"> Task Modal Form</h1>
        <div className="col-span-full">
          <label htmlFor="description" className="block text-sm/6 font-medium">
            Description
          </label>
          <div className="mt-2">
            <textarea
              id="description"
              name="description"
              rows={3}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              defaultValue={''}
            />
          </div>
        </div>
        <div className="mt-5 sm:mt-6 flex justify-around w-2/3 mx-auto">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
      </div>
      </form>
    </Modal>
  )
}
