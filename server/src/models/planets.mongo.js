import mongoose from 'mongoose';

const planetSchema = new mongoose.Schema({
  keplerName: {
    type: String,
    required: true
  }
});

const planets = mongoose.model('Planet', planetSchema);

export default planets;