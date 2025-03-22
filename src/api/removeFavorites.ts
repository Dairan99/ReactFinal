import { validateResponse } from "../utils/validateResponse";


export const removeFavorites = async (movieId:number):Promise<void> => {
    try {
        const response = await fetch(`https://cinemaguide.skillbox.cc/favorites/${movieId}`, {
            method:"DELETE",
            headers: {
                "Content-type":"application/json",
                accept:"application/json",
            },
            credentials:"include",
        });
        await validateResponse(response)
        const result = await response.json()
        return result

    } catch (error) {
        console.log(error);
        throw error
    }
}