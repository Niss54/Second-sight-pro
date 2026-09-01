declare module "multer";

declare namespace Express {
  interface MulterFile {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
  }

  interface Request {
    file?: MulterFile;
  }
}

