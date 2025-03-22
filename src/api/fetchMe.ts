import { z } from "zod";
import { validateResponse } from "../utils/validateResponse";

export const UserSchema = z.object({
    favorites:z.string().array(),
    name:z.string(),
    surname:z.string(),
    email:z.string()
})

export type User = z.infer<typeof UserSchema>

export function fetchMe(): Promise<User> {
    return fetch("https://cinemaguide.skillbox.cc/profile", {
        method: 'GET',
        credentials: "include",
    })
    .then(validateResponse)
    .then((response) => response.json())
    .then((data) => UserSchema.parse(data))
    .catch((error) => {
        console.error("Ошибка при получении данных пользователя:", error);
        throw new Error("Не удалось получить данные о текущем пользователе.");
    });
}