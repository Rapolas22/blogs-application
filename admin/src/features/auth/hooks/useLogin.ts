import { useMutation } from "@tanstack/react-query";
import { sendLoginRequest } from "../api";

export const useLogin = () => {
  return useMutation({
    mutationFn: sendLoginRequest,
  });
};
