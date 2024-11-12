import mongoose from 'mongoose';

const accountSchema = mongoose.Schema(
   {
      businessName: {
         type: String,
         required: [true, 'Please add a business Name'],
      },
      firstName: {
         type: String,
         required: [true, 'Please add a first Name'],
      },
      lastName: {
         type: String,
         required: [true, 'Please add a last Name'],
      },
      email: {
         type: String,
         required: [true, 'Please add an email Name'],
         unique: true,
      },
      password: {
         type: String,
         required: [true, 'Please add a password'],
      },
      userID: {
         type: String,
      },
      suppliersID: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'supplierRecord',
        }
      ],
      s3Catalogs: [
         {
            bucketUrl: { type: String },
            ExpiryDate: { type: String },
         },
      ],
   },
   {
      timestamps: true,
   },
);

const User = mongoose.model('User', accountSchema);

export default User;
