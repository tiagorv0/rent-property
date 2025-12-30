import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const createMulterOptions = (destination: string) => ({
  storage: diskStorage({
    destination,
    filename: (req, file, cb) => {
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      cb(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
  fileFilter: (req: any, file: any, cb: any) => {
    if (!file.originalname.match(/\.(pdf)$/)) {
      return cb(new BadRequestException('Only PDF files are allowed!'), false);
    }
    cb(null, true);
  },
});
