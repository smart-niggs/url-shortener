import * as mongoose from 'mongoose';

export const UrlSchema = new mongoose.Schema({
  long_url: { type: String, unique: true, required: true },
  short_url: { type: String, unique: true, required: true },
  active: { type: Boolean, default: true },
  meta: { type: JSON }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});
