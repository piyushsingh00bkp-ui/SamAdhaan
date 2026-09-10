import { prisma } from '../config/database.js';

export class NotificationService {
  static async create(params: {
    userId: string;
    type: string;
    title: string;
    message: string;
    relatedChallengeId?: string;
    relatedProjectId?: string;
  }) {
    return prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        relatedChallengeId: params.relatedChallengeId,
        relatedProjectId: params.relatedProjectId,
      },
    });
  }

  static async getUserNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  static async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { read: true },
    });
  }

  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }
}
