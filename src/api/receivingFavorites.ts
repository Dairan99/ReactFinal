import { validateResponse } from "../utils/validateResponse";

export interface IFavoritesData {
    id:number,
    language:string,
    budget:number,
    revenue:number,
    director:string,
    production:string,
    awardsSummary:string | number,
    title:string,
    releaseYear:number,
    genres:string[],
    plot:string,
    posterUrl:string,
    tmdbRating:number,
    runtime:number
    trailerUrl:string
}


export const receivingFavorites = async ():Promise<IFavoritesData[]> => {
    try {
        const response = await fetch("https://cinemaguide.skillbox.cc/favorites", {
            method:"GET",
            headers: {
                "Content-type":"application/json",
                accept:"application/json",
            },
            credentials:"include",
        });
        await validateResponse(response)
        const result: IFavoritesData[] = await response.json()
        return result

    } catch (error) {
        console.log(error);
        throw error
    }
}