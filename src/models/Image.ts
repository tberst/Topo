/* eslint-disable @typescript-eslint/interface-name-prefix */
import mongoose from "mongoose";

export type ImageDocument = mongoose.Document & {
    img: {
        contentType: string;
        data: Buffer;
    };
}

const imageSchema = new mongoose.Schema({
    img:{
        contentType: String,
        data : Buffer
    }
  
}, { timestamps: true });


export const Image = mongoose.model<ImageDocument>("Image",imageSchema);