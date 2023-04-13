export const allAccess = (req: any, res: any) => {
  res.status(200).send("Public Content.");
};

export const dentistBoard = (req: any, res: any) => {
  res.status(200).send("Dentist Content.");
};

export const adminBoard = (req: any, res: any) => {
  res.status(200).send("Admin Content.");
};

export const superUserBoard = (req: any, res: any) => {
  res.status(200).send("SuperUser Content.");
};
