import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class User {
  constructor() {
  }

  static fromDoc(doc: any): User | null {
    if (!doc)
      return null;
    const { _id = null, __v = null, ...user } = { ...doc };

    return user;
  }

  static fromArray(docs: any[]): User[] {
    return docs.map((doc) => User.fromDoc(doc));
  }

  static clean(user: User) {
    const { password, ...clened } = { ...user };
    return clened;
  }
  @Prop()
  id : string;
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop()
  name: string;
  @Prop()
  lastName: string;
  @Prop()
  username : string 
  @Prop()
  bio:string;
}
