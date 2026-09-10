import { prisma } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';
import { EvidenceType } from '@prisma/client';

export class EvidenceService {
  static async addEvidence(
    challengeId: string,
    userId: string,
    file: Express.Multer.File
  ) {
    const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge) throw new NotFoundError('Challenge not found');

    let type: EvidenceType = EvidenceType.DOCUMENT;
    if (file.mimetype.startsWith('image/')) type = EvidenceType.IMAGE;
    else if (file.mimetype.startsWith('video/')) type = EvidenceType.VIDEO;
    else if (file.mimetype.startsWith('audio/')) type = EvidenceType.AUDIO;
    else if (file.mimetype === 'application/pdf') type = EvidenceType.PDF;

    const fileUrl = `/uploads/${file.filename}`;

    const evidence = await prisma.challengeEvidence.create({
      data: {
        challengeId,
        type,
        fileName: file.originalname,
        fileUrl,
        mimeType: file.mimetype,
        fileSize: file.size,
        uploadedBy: userId,
      },
    });

    return evidence;
  }

  static async getEvidenceByChallengeId(challengeId: string) {
    return prisma.challengeEvidence.findMany({
      where: { challengeId },
      include: {
        uploader: { select: { id: true, name: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
