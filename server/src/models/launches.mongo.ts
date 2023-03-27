import mongoose from 'mongoose';

export interface ILaunch {
  flightNumber: number,
  launchDate: Date,
  mission: string,
  rocket: string,
  target: string,
  customers: string[],
  upcoming: boolean,
  success: boolean
}

const launchesSchema = new mongoose.Schema<ILaunch>({
  flightNumber: {
    type: Number,
    required: true,
  },
  launchDate: {
    type: Date,
    required: true
  },
  mission: {
    type: String,
    required: true
  },
  rocket: {
    type: String,
    required: true
  },
  target: {
    type: String,
    required: true
  },
  customers: [ String ],
  upcoming: {
    type: Boolean,
    required: true
  },
  success: {
    type: Boolean,
    required: true,
    default: true
  }
});

// Connects launchesSchema with launches collection in mongodb
const Launches = mongoose.model<ILaunch>('Launch', launchesSchema);

export default Launches;
