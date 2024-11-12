import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true },
    emailAddress: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, default: 'active' }
  });


  const Session = mongoose.model('userSession', sessionSchema);

  export default Session;