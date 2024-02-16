import { toast } from "react-toastify";

export const successToast = (msg) => {
  return toast.success(msg, {
    position: "top-right",
  });
};

export const errorToast = (msg) => {
  return toast.error(msg, {
    position: "top-right",
  });
};
