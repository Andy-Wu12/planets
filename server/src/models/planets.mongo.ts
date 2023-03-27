import mongoose from 'mongoose';

export interface IPlanet {
  keplerName: string
}

const planetSchema = new mongoose.Schema<IPlanet>({
  keplerName: {
    type: String,
    required: true
  },
});

const planets = mongoose.model<IPlanet>('Planet', planetSchema);

export default planets;