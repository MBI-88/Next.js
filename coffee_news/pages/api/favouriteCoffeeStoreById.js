import { findRecordByFilter, getMinifiedRecords, table } from "@/lib/airtable"

const favouriteCoffeeStoreById = async (req, res) => {
    if (req.method === "PUT") {
        try {
            const { id } = req.body
            if (id) {
                const records = await findRecordByFilter(id)
                if (records.length !== 0) {
                    const record = records[0]
                    const calculateVote = parseInt(record.vote) + 1
                    const updateRecord = await table.update([
                        {
                            id: record.record,
                            fields: {
                                id:record.id,
                                vote: calculateVote,
                            }
                        },
                    ])
                    if (updateRecord) {
                        const minifiedRecords = getMinifiedRecords(updateRecord)
                        res.status(200).json(minifiedRecords)
                    }

                } else {
                    res.status(400).json({ message: "Id dosen't exist", id })
                }

            }else {
                res.status(400).json({message:"Id is missing"})
            }

        } catch (err) {
            res.status(500).json({ message: 'Internal error', err })
        }
    }

}

export default favouriteCoffeeStoreById