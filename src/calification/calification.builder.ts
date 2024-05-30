import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import { Calification } from 'src/db/schema/calification.schema';
import { Exchange } from 'src/db/schema/exchange.schema';

export class CalificationBuilder {
  private calification: Calification;

  constructor() {
    this.calification = new Calification();
  }

  public uuid_user(uuid_user: string): CalificationBuilder {
    this.calification.uuid_user = uuid_user;
    return this;
  }

  public uuid_user_calification(
    uuid_user_calification: string,
  ): CalificationBuilder {
    this.calification.uuid_user_calification = uuid_user_calification;
    return this;
  }

  public uuid_exchange(exchange: Exchange): CalificationBuilder {
    this.calification.exchange = exchange;
    return this;
  }

  public comment(comment: string): CalificationBuilder {
    this.calification.comment = comment;
    return this;
  }

  public evaluation(evaluation: number): CalificationBuilder {
    this.calification.calification = evaluation;
    return this;
  }

  public build(): Calification {
    this.calification._id = new mongoose.Types.ObjectId();
    this.calification.uuid = uuidv4();

    return this.calification;
  }
}
