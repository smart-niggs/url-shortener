import { Document, Schema } from 'mongoose';

export interface UrlDoc extends Document {
  long_url: string;
  short_url: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export const UrlSchema = new Schema(
  {
    long_url: { type: String, required: true, unique: true },
    short_url: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    // In production the indexes are built by the one-off `create-indexes` job:
    // with autoIndex on, every task races to build the same two indexes on
    // every deploy. In dev there is one process and no job, so let it build.
    autoIndex: process.env.NODE_ENV !== 'production',
  },
);
