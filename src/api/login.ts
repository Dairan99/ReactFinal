import { validateResponse } from "../utils/validateResponse";

interface ISuccessfulResult {
    result: boolean;
  }

interface ILoginData {
    email: string,
    password: string,
}

export interface ILogin {
    success: boolean;
    error?: string; 
  }

export const loginUser = async (loginData: ILoginData): Promise<ISuccessfulResult> => {
    try {
      const response = await fetch("https://cinemaguide.skillbox.cc/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(loginData),
      });
      await validateResponse(response);
      const result: ILogin = await response.json();
      console.log('Ответ от сервера:', result)
      if (result.success) {
        console.log('Вход успешен');
        return { result: true };
    } 
      else return { result: false };
    } catch (error) {
      console.log(error);
      return { result: false };
    }
  };

  