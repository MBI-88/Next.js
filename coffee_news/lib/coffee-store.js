import { createApi } from "unsplash-js";

const unsplash = createApi({ accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY })

const getUrlForCoffeeStores = (latlong, query, limit) => {
    return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latlong}&limit=${limit}`
}

const getListOfCoffeeStorePhotos = async () => {
    const photos = await unsplash.search.getPhotos({
        query: "coffee shop",
        perPage: 30,
    })
    const unsplashResult = photos.response.results;
    return unsplashResult.map(res => res.urls["small"]);
}

export const fetchCoffeeStores = async (latlong = "-34.893819,-56.190116" ,limit=30) => {
    const photos = await getListOfCoffeeStorePhotos()
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
        }
    };
    const response = await fetch(getUrlForCoffeeStores(latlong, "coffee", limit), options)
    const data = await response.json()
    return data.results.map((result,index) => {
        const neighbourhood = result.location.formatted_address
        const locality = result.location.locality
        const region = result.location.region
        const address = result.location.address
        return {
            id:result.fsq_id,
            name: result.name,
            address:address ? address:null,
            neighbourhood: neighbourhood.length > 0 ? neighbourhood: "Not expecific address",
            imgUrl:photos.length > 0 ? photos[index]: null,
            region: region,
            locality: locality,
        }
    })
}