import React from "react";
import { useEffect } from "react";
import Modal from "./DefaultModal";

type ModifyProps = {
  visible: boolean;
  onClose: () => void;
  initialData?: { name: string };
};

export const ModifyTabModal: React.FC<ModifyProps> = ({
  onClose,
  visible,
  initialData = { name: "" },
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
    <Modal visible={visible} onClose={onClose} titleI18nId={"Modify_a_Tab"}>
      <form
        className="p-4 md:p-5"
        onSubmit={handleSubmit}
        id="submit-modify-tab"
      >
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label
              htmlFor="name-modify-tab"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              data-i18n="Name"
            ></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              id="name-modify-tab"
              maxLength={255}
              className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
              required={true}
            />
          </div>
        </div>
        <button
          type="submit"
          id="button-submit-modify-tab"
          className="inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
          <span data-i18n="Modify_the_Tab"></span>
        </button>
      </form>
    </Modal>
  );
};