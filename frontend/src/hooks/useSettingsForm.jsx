import { useForm } from "react-hook-form";

const useSettingsForm = (defaultValues = {}) => {
  return useForm({
    mode: "onBlur",
    defaultValues,
  });
};

export default useSettingsForm;
