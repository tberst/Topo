import { Request, Response, NextFunction } from "express";
import { Places, PlaceDocument, Track } from "../models/Place";
import { ObjectID, WriteError } from "mongodb";
import { TrackRuns, TrackRunDocument } from "../models/TrackRun";
/**
 * GET /
 * Home page.
 */
export const index = (req: Request, res: Response) => {
    Places.find().then((places) => {
        res.render("topo/topoIndex", {
            title: "Topo-Home",
            data: places
        });
    });

};

export const routeList = (req: Request, res: Response) => {
    const placeId = req.params.site;
    const user = res.locals.user;
    if (placeId) {
        Promise.all([
            Places.findById(placeId).exec(),
            TrackRuns.find({ userId: user.id }).exec()
        ]).then(function (result) {
            const place = result[0];
            const runs = result[1];
            const maxes: { [label: string]: number } = {};
            place.tracks.sort((a: Track, b: Track) => {
                if (a.number < b.number) { return -1; }
                if (a.number > b.number) { return 1; }
                return 0;
            });
            place.tracks.map((elem) => {
                const max = Math.max(...runs.map(function(run) { 
                    if (elem.id == run.trackId){return run.score;}
                    else{ return 0;}
                }));
                if (max > 0 ){
                    maxes[elem.id] = max;
                }
                else
                {
                    maxes[elem.id] = 0;
                }
               
            });
            res.render("topo/topoRouteList", {
                "title": "Topo - " + place.title,
                "data": place,
                "maxes": maxes
            });
        });

     
    }
    else {
        res.sendStatus(400);
    }

};

export const routeDetail = (req: Request, res: Response) => {
    const placeId = req.params.site;
    const trackId = req.params.route;
    const user = res.locals.user;
    if (placeId && trackId) {
        Promise.all([
            Places.findById(placeId).exec(),
            TrackRuns.find({ trackId: trackId,userId: user.id }).exec()
        ]).then(function (result) {
            const place = result[0];
            const runs = result[1];
            const track = place.tracks.find((elem) => { return elem.id == trackId; });
            res.render("topo/topoRouteDetail", {
                title: "Topo - Voie",
                place: place,
                track: track,
                runs: runs
            });
        });
    }
    else {
        res.sendStatus(400);
    }

};
export const routeInstance = (req: Request, res: Response) => {
    const placeId = req.params.site;
    const trackId = req.params.route;
    if (placeId && trackId) {
        Places.findById(placeId).then((place) => {
            const track = place.tracks.find((elem) => { return elem.id == trackId; });
            res.render("topo/topoRouteInstance", {
                title: "Topo - Voie",
                place: place,
                track: track
            });
        });
    }
    else {
        res.sendStatus(400);
    }
};

export const postRouteInstance = (req: Request, res: Response, next: NextFunction) => {
    const model = req.body as TrackRunDocument;
    const trackId = req.params.route;
    const placeId = req.params.site;
    const user = res.locals.user;
    const run = new TrackRuns(model);

    if (placeId && trackId) {
        Places.findById(placeId).then((place) => {
            const track = place.tracks.find((elem) => { return elem.id == trackId; });
            run.placeId = placeId;
            run.track = track;
            run.trackId = track.id;
            run.place = place.title;
            run.userId = user.id;
            run.save((err: WriteError) => {
                if (err) { return next(err); }
                const redirectUrl = "/topo/" + req.params.site + "/" + req.params.route;
                res.send(redirectUrl);
            });
        });
    }
    else {
        res.sendStatus(400);
    }
};

export const deleteRouteInstance = (req: Request, res: Response, next: NextFunction) => {
    const runId = req.params.run;

    if (runId) {
        TrackRuns.findById(runId).remove( (err: WriteError) => {
            if (err) { return next(err); }
            const redirectUrl = "/topo/" + req.params.site + "/" + req.params.route;
            res.send(redirectUrl);
        });
      }
    else {
        res.sendStatus(400);
    }
};

export const postSampleData = (req: Request, res: Response) => {
    const wascalade: PlaceDocument = new Places(
        {
            "title": "wascalade",
            "tracks": [
                {
                    "title": "vache"
                    , "difficulty": "6b",
                    "number": 14,
                    "height": 8
                }, {
                    "title": "1 rouge"
                    , "difficulty": "6b",
                    "number": 1,
                    "height": 8
                }
            ],
            "type": "salle",
            "height": 8
        }
    );
    wascalade.save(() => { res.sendStatus(200); });


};