// import React from "react"

import React from "react";
import { useEffect } from "react";
import Modal from "./DefaultModal";

type ModifyProps = {
  visible: boolean;
  onClose: () => void;
  initialData?: {
    taskId: string;
    listId: string;
    name: string;
    date: string;
    description: string;
  };
};

export const ModifyTaskModal: React.FC<ModifyProps> = ({
  visible,
  onClose,
  initialData = { taskId: "", listId: "", name: "", date: "", description: "" },
}) => {
  const [formData, setFormData] = React.useState(initialData);
  
    useEffect(() => {
      setFormData(initialData);
    }, [initialData]);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Form submitted:", formData);
      onClose();
    };
  return (
    <Modal visible={visible} onClose={onClose} titleI18nId={"Modify_Task"}>
      <form className="p-4 md:p-5" onSubmit={handleSubmit} id="submit-modify-task">
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label
            htmlFor="name-modify-task"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            data-i18n="Name"
          ></label>
          <input
            type="text"
            name="name"
            id="name-modify-task"
            value={formData.name}
            maxLength={255}
            onChange={handleChange}
            className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
            required={true}
          />
          {/* <input
            type="hidden"
            name="list-id-modify-task"
            id="list-id-modify-task"
            value={listId}
          /> */}
          {/* <input
            type="hidden"
            name="task-id-modify-task"
            id="task-id-modify-task"
            value={taskId}
          /> */}
        </div>
        <div className="col-span-2">
          <label
            htmlFor="date-modify-task"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            data-i18n="Date"
          ></label>
          <input
            type="datetime-local"
            name="date"
            onChange={handleChange}
            value={formData.date}
            id="date-modify-task"
            className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
          />
        </div>
        <div className="col-span-2">
          <label
            htmlFor="description-modify-task"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            data-i18n="Task_Description"
          ></label>
          <textarea
            id="description-modify-task"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          ></textarea>
        </div>
      </div>
      <button
        type="submit"
        id="button-submit-modify-task"
        disabled
        className="inline-flex items-center rounded-lg bg-indigo-100 px-5 py-2.5 text-center text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        <svg
          className="-ms-1 me-1 h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clipRule="evenodd"
          ></path>
        </svg>
        <span data-i18n="Modify_Task"></span>
      </button>
    </form>
    </Modal>
  );
};
