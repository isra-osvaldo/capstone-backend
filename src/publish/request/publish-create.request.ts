import mongoose from 'mongoose';

export class PublishCreateRequest {
  uuid_product: string;
  uuid_user: string;
  category: string;
  name: string;
  price: number;
  publish_description: string;
  email: string;
  reputationId: mongoose.Types.ObjectId;
}
