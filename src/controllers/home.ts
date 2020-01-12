import { Request, Response } from "express";

/**
 * GET /
 * Home page.
 */
export const index = (req: Request, res: Response) => {
    res.redirect("/topo");

    // res.render("home", {
    //     title: "Home"
    // });
};
