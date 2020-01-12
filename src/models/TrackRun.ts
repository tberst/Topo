/* eslint-disable @typescript-eslint/interface-name-prefix */
import mongoose from "mongoose";
import {Track, trackSchema} from "./Place";
  
export type TrackRunDocument = mongoose.Document & {
    placeId: string;
    userId: string;
    trackId: string;
    score: number;
    head: boolean;
    date: Date;
    place: string;
    comment: string;
    track: Track;
};




const trackRunSchema = new mongoose.Schema({
    placeId: String,
    userId: String,
    trackId: String,
    score: Number,
    head: Boolean,
    date: Date,
    place: String,
    comment: String,
    track: trackSchema
}, { timestamps: true });



export const TrackRuns = mongoose.model<TrackRunDocument>("Track",trackRunSchema);