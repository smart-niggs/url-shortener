import { Document } from "mongoose";

export class UrlDto extends Document {
  readonly long_url: string;
  short_url: string;
  readonly active: string;
}
