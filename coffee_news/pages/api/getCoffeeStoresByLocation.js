import { fetchCoffeeStores } from "@/lib/coffee-store"

const getCoffeeStoresByLocation = async (req,res) => {
    try {
        const {latlong,limit} = req.query
        const response = await fetchCoffeeStores(latlong,limit)
        res.status(200).json(response)
    }catch (err){
        res.status(500).json({message:`Internal error: ${err}`})
    }
}

export default getCoffeeStoresByLocation