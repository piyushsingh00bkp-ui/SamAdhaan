import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestError } from '../utils/errors.js';
import { env } from '../config/env.js';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'video/mp4',
  'video/quicktime',
  'audio/mpeg',
  'audio/wav',
  'audio/mp4',
  'application/pdf',
];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.resolve(process.cwd(), 'uploads'));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${uuidv4()}${ext}`;
    cb(null, safeName);
  },
});

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestError(
        `Unsupported file type: ${file.mimetype}. Allowed types: JPEG, PNG, WEBP, MP4, MP3, WAV, PDF`
      )
    );
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: env.MAX_FILE_SIZE, // 25 MB max
  },
  fileFilter,
});
