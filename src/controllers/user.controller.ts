import { Request, Response } from "express";

export const allAccess = (req: Request, res: Response) => {
  res.status(200).send("Public Content.");
};

export const dentistBoard = (req: Request, res: Response) => {
  res.status(200).send("Dentist Content.");
};

export const adminBoard = (req: Request, res: Response) => {
  res.status(200).send("Admin Content.");
};

export const superUserBoard = (req: Request, res: Response) => {
  res.status(200).send("SuperUser Content.");
};
