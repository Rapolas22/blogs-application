import { useMutation } from "@tanstack/react-query";
import { sendSignupRequest } from "../api";

export const useRegister = () => {
  return useMutation({
    mutationFn: sendSignupRequest,
  });
};
