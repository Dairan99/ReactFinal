import { validateResponse } from "../utils/validateResponse";

export function logout(): Promise<void> {
    return fetch("https://cinemaguide.skillbox.cc/auth/logout", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    })
    .then(validateResponse)
    .then(() => undefined);
  }