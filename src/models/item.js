import mongoose, { Schema } from 'mongoose';

const itemSchema = new Schema({
  owner: String,
  name: String,
  type: String,
  price: Number,
  image: String,
  loc: Schema.Types.Mixed,
}, {
  timestamps: true
});

export default mongoose.model('item', itemSchema);
