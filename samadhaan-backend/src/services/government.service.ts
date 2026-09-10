import { prisma } from '../config/database.js';
import { ChallengeStatus } from '@prisma/client';

export class GovernmentService {
  static async getDashboard(state?: string, district?: string) {
    const where: any = { isDeleted: false };
    if (state) where.state = state;
    if (district) where.district = district;

    const [totalChallenges, resolvedCount, activeProjects, departments, criticalCount] =
      await Promise.all([
        prisma.challenge.count({ where }),
        prisma.challenge.count({ where: { ...where, status: ChallengeStatus.RESOLVED } }),
        prisma.project.count(),
        prisma.governmentDepartment.count(state ? { where: { state } } : undefined),
        prisma.challenge.count({ where: { ...where, severity: { gte: 80 } } }),
      ]);

    const recentCriticalChallenges = await prisma.challenge.findMany({
      where: { ...where, severity: { gte: 75 } },
      take: 6,
      orderBy: { severity: 'desc' },
      include: {
        aiAnalysis: { select: { problemSummary: true, governmentDepartment: true } },
      },
    });

    return {
      overview: {
        totalChallenges,
        resolvedCount,
        resolutionRate: totalChallenges > 0 ? Math.round((resolvedCount / totalChallenges) * 100) : 0,
        activeProjects,
        departmentsCount: departments,
        criticalCount,
      },
      recentCriticalChallenges,
    };
  }

  static async getGovernmentChallenges(query: {
    state?: string;
    district?: string;
    department?: string;
  }) {
    const where: any = { isDeleted: false };
    if (query.state) where.state = query.state;
    if (query.district) where.district = query.district;

    return prisma.challenge.findMany({
      where,
      orderBy: [{ severity: 'desc' }, { createdAt: 'desc' }],
      take: 100,
      include: {
        aiAnalysis: true,
        projects: { select: { id: true, name: true, status: true } },
      },
    });
  }

  static async getStatistics(state?: string) {
    const where: any = { isDeleted: false };
    if (state) where.state = state;

    const [categoryGrouping, statusGrouping, stateGrouping] = await Promise.all([
      prisma.challenge.groupBy({
        by: ['category'],
        where,
        _count: true,
      }),
      prisma.challenge.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
      prisma.challenge.groupBy({
        by: ['state'],
        where: { isDeleted: false },
        _count: true,
      }),
    ]);

    return {
      byCategory: categoryGrouping.map((g) => ({ category: g.category, count: g._count })),
      byStatus: statusGrouping.map((g) => ({ status: g.status, count: g._count })),
      byState: stateGrouping.map((g) => ({ state: g.state, count: g._count })),
    };
  }

  static async getDepartments() {
    return prisma.governmentDepartment.findMany({
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Aggregate challenge clusters for geospatial heatmap visualization
   */
  static async getHotspots() {
    const challenges = await prisma.challenge.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        title: true,
        category: true,
        severity: true,
        status: true,
        latitude: true,
        longitude: true,
        city: true,
        state: true,
      },
    });

    // Group challenges by city / coordinates for cluster centers
    const clustersMap = new Map<string, any>();

    for (const c of challenges) {
      const key = `${c.city}_${c.state}`;
      if (!clustersMap.has(key)) {
        clustersMap.set(key, {
          city: c.city,
          state: c.state,
          latitude: c.latitude,
          longitude: c.longitude,
          totalIssues: 0,
          avgSeverity: 0,
          criticalCount: 0,
          categories: {} as Record<string, number>,
        });
      }

      const cluster = clustersMap.get(key);
      cluster.totalIssues += 1;
      cluster.avgSeverity += c.severity;
      if (c.severity >= 80) cluster.criticalCount += 1;
      cluster.categories[c.category] = (cluster.categories[c.category] || 0) + 1;
    }

    const hotspots = Array.from(clustersMap.values()).map((cluster) => ({
      ...cluster,
      avgSeverity: Math.round(cluster.avgSeverity / cluster.totalIssues),
      intensity: Math.min(1.0, cluster.totalIssues / 20),
    }));

    return {
      points: challenges,
      hotspots,
    };
  }
}
