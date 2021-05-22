import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PostDocument = Post & Document;

@Schema()
export class Post {
    @Prop({required: true})
    species: string;
    
    @Prop()
    breed: string;
    
    @Prop({required: true})
    location: string;
    
    @Prop({required: true})
    passphrase: string;
    
    @Prop()
    contactName: string;

    @Prop({required: true})
    contactNumber: number;
    
    @Prop({enum: ['adoption', 'lost', 'found'], required: true})
    status: string;

    @Prop()
    info: string;

    @Prop()
    image: string;

    @Prop({default: Date.now})
    date: Date;

    @Prop({default: false})
    approved: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);
