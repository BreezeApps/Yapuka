import React, { useEffect } from "react";
import Modal from "./DefaultModal";

type ModifyProps = {
  visible: boolean;
  onClose: () => void;
  initialData?: { id: string; name: string; color: string }; // DonnÃ©es initiales
};

export const ModifyListModal: React.FC<ModifyProps> = ({
  onClose,
  visible,
  initialData = { id: "", name: "", color: "" },
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
    <Modal visible={visible} onClose={onClose} titleI18nId={"Modify_List"}>
      <form
        className="p-4 md:p-5"
        onSubmit={handleSubmit}
        id="submit-modify-liste"
      >
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label
              htmlFor="name-modify-list"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              data-i18n="Name"
            ></label>
            <input
              type="text"
              name="name"
              id="name-modify-list"
              value={formData.name}
              onChange={handleChange}
              maxLength={255}
              className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
              required={true}
            />
            {/* <input
                    type="text"
                    name="name"
                    id="id-modify-list"
                    value={id}
                    className="hidden"
                    required={true}
                  /> */}
          </div>
          <div className="col-span-2">
            <label
              htmlFor="color-modify-list"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              data-i18n="Color"
            ></label>
            <input
              type="color"
              name="color"
              onChange={handleChange}
              id="color-modify-list"
              value={formData.color}
              className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block h-10 w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>
        </div>
        <button
          type="submit"
          id="button-submit-modify-list"
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
          <span data-i18n="Modify_the_List"></span>
        </button>
      </form>
    </Modal>
  );
};
