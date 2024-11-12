import mongoose from 'mongoose'

const supplierConnectionDetails = mongoose.Schema(
    {
        supplierName: {
            type: String,
            required: [true, 'Please add a supplier name']
        },
        
    }
)