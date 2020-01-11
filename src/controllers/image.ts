import { Request, Response, NextFunction } from "express";
import { Image, ImageDocument } from "../models/Image";
import multiparty from "multiparty";

export const getImage = async (req: Request, res: Response, next: NextFunction) => {
  if (req.params.id != null) {
    Image.findById(req.params.id, function (err, doc) {
      if (err) return next(err);
      res.contentType(doc.img.contentType);
      res.send(doc.img.data);
    });
  }
  else {
    res.sendStatus(400);
  }
};


export const postImage = async (req: Request, res: Response, next: NextFunction) => {
  const form = new multiparty.Form();
  // Parts are emitted when parsing the form
  form.on("part", function (part) {
    // You *must* act on the part by reading it
    // NOTE: if you want to ignore it, just call "part.resume()"

    if (!part.filename) {
      // filename is not defined when this is a field and not a file
      console.log("got field named " + part.name);
      // ignore field's content
      part.resume();
    }

    if (part.filename) {
      // filename is defined when this is a file

      console.log("got file named " + part.name);
      const img: ImageDocument = new Image({
        img: {
          contentType: part.headers["content-type"],
          data: []
        }
      });
      const buffers: any[] = [];
      part.on("data", function (data) {
        buffers.push(data);
      });
      part.on("end", function () {
        img.img.data = Buffer.concat(buffers);
        img.save(function (err, a) {
          if (err) {
            res.status(500).send(err);
          }
          else {
            res.send({id:img.id});
          }
        });
        // ignore file's content here
        part.resume();
      });

    }


    part.on("error", function (err) {
      // decide what to do
    });
  });
  // Close emitted after form parsed
  form.on("close", function () {
    console.log("Upload completed!");
  });
  form.parse(req);


};

