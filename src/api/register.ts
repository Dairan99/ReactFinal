import { validateResponse } from "../utils/validateResponse"

interface ISuccessfulResult {
    result: boolean;
  }

interface IRegisterData {
    email: string,
    password: string,
    name: string,
    surname: string
}

export interface IRegistration {
    success: boolean;
    error?: string; 
  }

export const registerUser = async (
    registerData: IRegisterData
  ): Promise<ISuccessfulResult> => {
    try {
      const response = await fetch("https://cinemaguide.skillbox.cc/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(registerData),
      });
      await validateResponse(response);
      const result: IRegistration = await response.json();
      if (result.success) return { result: true };
      else return { result: false };
    } catch (error) {
      console.log(error);
      return { result: false };
    }
  };