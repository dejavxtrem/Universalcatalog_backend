import mongoose, { version } from 'mongoose';

const supplierRecordSchema = mongoose.Schema (
    {
        supplier_name: {
            type: String,
            required: [true, 'Please add a supplier name']
        },
        supplier_contactInformation: {
            email: { type: String},
            phoneNumber: { type: String}
        },
        supplierConnectionDetailId: {
            
        },
        supplier_catalog: [
          {
            catalog_name: { type: String},
            current_version: { type: String},

            version_history: [
              {
                version_id: { type: String},
                version: { type: String},
                upload_date: { type: Date},
                file_type: { type: String},
                hosted_url: { type: String},
                version_changes: { type: String},
                is_active: { type: Boolean, default: false},
                products: [
                    {
                       product_supplierPartNum: { type: String},
                       product_description: { type: String},
                       product_Name: { type: String},
                       product_price: { type: String},
                       product_currency: { type: String},
                       product_availability: { type: String},
                       product_Item_classification_name: { type: String},
                       product_UNSPSC_CODE: { type: String},
                       product_Manufacturer: { type: String},
                       product_ManufacturerPartNumber: { type: String},
                       product_ContractNumber: { type: String},
                       product_ContractTerm: { type: String},
                       product_savings_percent: { type: String},
                       product_MinimumOrderQuantity: { type: String},
                       product_LeadTime: { type: String},
                       product_availability_date: { type: Date},
                       product_image_URL: [
                          {
                            imageURL: { type: String},
                            imageType: { type: String}
                          }
                       ],
                       product_UOMcode: { type: String},
                       product_PackQuantity: { type: String},
                       product_PackWeight: { type: String},
                       product_PackweightUOM: { type: String},

                    }
                ]
              }
            ]
          }
        ]
    },
    {
        timestamps: true,
    }
)
 

const supplierRecord = mongoose.model('supplierRecord', supplierRecordSchema);

export default supplierRecord;