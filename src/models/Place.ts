/* eslint-disable @typescript-eslint/interface-name-prefix */
import mongoose from "mongoose";
  
export type PlaceDocument = mongoose.Document & {
    title: string;
    type: string;
    height: number;
    tracks: [Track];
}

export type Track = mongoose.Document & {
    title: string;
    difficulty: string;
    height: number;
    number: number;
}

export const trackSchema = new mongoose.Schema({
    title: String,
    difficulty: String,
    height: Number,
    number: Number,
}, { timestamps: true });


const placeSchema = new mongoose.Schema({
    title: String,
    type: String,
    height: Number,
    tracks: [trackSchema]
}, { timestamps: true });



export const Places = mongoose.model<PlaceDocument>("Place",placeSchema);