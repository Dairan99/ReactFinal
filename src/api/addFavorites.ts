import { validateResponse } from "../utils/validateResponse";


export const addFavorites = async (data:number):Promise<void> => {
    try {
        const response = await fetch("https://cinemaguide.skillbox.cc/favorites", {
            method:"POST",
            headers: {
                "Content-type":"application/json",
                accept:"application/json",
            },
            credentials:"include",
            body: JSON.stringify({id: data.toString()})
        });
        await validateResponse(response)
        const result = await response.json()
        return result

    } catch (error) {
        console.log(error);
        throw error
    }
}