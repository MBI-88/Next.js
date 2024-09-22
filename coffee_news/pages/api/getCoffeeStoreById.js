import { findRecordByFilter } from "@/lib/airtable"

const getCoffeeStoreById = async (req, resp) => {

    const { id } = req.query
    try {
        if (id) {
            const records = findRecordByFilter(id)
            if (records.length !== 0) {
                resp.status(200).json(records)
            } else {
                resp.staus(403).json({ message: `id could not be found` })

            }

        } else {
            resp.status(400).json({ message: "Id is missing" })
        }
    } catch (err) {
        resp.status(500).json({ message: "Internal error", err })
    }
}

export default getCoffeeStoreById