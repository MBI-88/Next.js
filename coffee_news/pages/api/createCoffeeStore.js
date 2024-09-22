import { findRecordByFilter, getMinifiedRecords, table } from "@/lib/airtable"


const createCoffeeStore = async (req, res) => {
    if (req.method === "POST") {
        const { id, name, address, neighbourhood, vote, imgUrl } = req.body
        if (id && name) {
            try {
                const records = await findRecordByFilter(id)
                if (records.length !== 0) {
                    res.status(200).json(records)
                } else {
                    const createRecords = await table.create([
                        {
                            fields: {
                                id,
                                name,
                                address,
                                neighbourhood,
                                vote,
                                imgUrl,
                            },
                        },

                    ])
                    const records = getMinifiedRecords(createRecords)
                    res.status(200).json(records)
                }
            } catch (err) {
                res.status(500).json({ message: "Internal error", err })
            }
        } else {
            const mes = !id && !name ? "Id and Name" : !id ? "Id" : !name ?
                "Name" : null
            res.status(400).json({ message: `${mes} are missing` })
        }

    }
}
export default createCoffeeStore