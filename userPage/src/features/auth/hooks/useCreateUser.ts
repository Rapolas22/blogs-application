import { useMutation } from "@tanstack/react-query"
import { sendSignUpDataToApi } from "../api"
import type { signUpProps } from "../types"

export const useCreateUser = () => {
  return useMutation({
    mutationFn: (formData: signUpProps) => sendSignUpDataToApi({ formData }),
  })
}
