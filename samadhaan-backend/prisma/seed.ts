import { PrismaClient, Role, UserStatus, OrgType, ChallengeStatus, Priority, ProjectStatus, TeamRole, PartnershipType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SAMADHAAN database seeding...');

  // 1. Create Core Users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@samadhaan.gov.in' },
    update: {},
    create: {
      firebaseUid: 'admin-firebase-uid-001',
      email: 'admin@samadhaan.gov.in',
      name: 'National Admin Officer',
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  const citizenUser = await prisma.user.upsert({
    where: { email: 'arjun.mehta@citizen.in' },
    update: {},
    create: {
      firebaseUid: 'citizen-firebase-uid-001',
      email: 'arjun.mehta@citizen.in',
      name: 'Arjun Mehta',
      phone: '+91 98765 43210',
      role: Role.CITIZEN,
      status: UserStatus.ACTIVE,
      citizenProfile: {
        create: {
          bio: 'Active civic community volunteer in Pune West.',
          city: 'Pune',
          district: 'Pune',
          state: 'Maharashtra',
          pincode: '411057',
        },
      },
    },
  });

  console.log('✅ Core Admin & Citizen Users created');

  // 2. Create 10+ Universities
  const universityData = [
    { name: 'Indian Institute of Technology Bombay', shortName: 'IITB', city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra', lat: 19.1334, lng: 72.9133, website: 'https://www.iitb.ac.in' },
    { name: 'College of Engineering Pune', shortName: 'COEP', city: 'Pune', district: 'Pune', state: 'Maharashtra', lat: 18.5293, lng: 73.8565, website: 'https://www.coep.org.in' },
    { name: 'Jawaharlal Nehru Technological University Kakinada', shortName: 'JNTUK', city: 'Kakinada', district: 'Kakinada', state: 'Andhra Pradesh', lat: 16.9818, lng: 82.2472, website: 'https://www.jntuk.edu.in' },
    { name: 'Jadavpur University', shortName: 'JU', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal', lat: 22.4989, lng: 88.3718, website: 'https://www.jaduniv.edu.in' },
    { name: 'Indian Institute of Technology Kharagpur', shortName: 'IITKGP', city: 'Kharagpur', district: 'Paschim Medinipur', state: 'West Bengal', lat: 22.3149, lng: 87.3105, website: 'https://www.iitkgp.ac.in' },
    { name: 'Delhi Technological University', shortName: 'DTU', city: 'Delhi', district: 'North West Delhi', state: 'Delhi', lat: 28.7501, lng: 77.1177, website: 'https://www.dtu.ac.in' },
    { name: 'National Institute of Technology Rourkela', shortName: 'NITR', city: 'Rourkela', district: 'Sundargarh', state: 'Odisha', lat: 22.2531, lng: 84.9012, website: 'https://www.nitrkl.ac.in' },
    { name: 'Indian Institute of Technology Madras', shortName: 'IITM', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', lat: 12.9915, lng: 80.2337, website: 'https://www.iitm.ac.in' },
    { name: 'International Institute of Information Technology Hyderabad', shortName: 'IIITH', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', lat: 17.4455, lng: 78.3489, website: 'https://www.iiit.ac.in' },
    { name: 'Malaviya National Institute of Technology Jaipur', shortName: 'MNIT', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan', lat: 26.8640, lng: 75.8108, website: 'https://www.mnit.ac.in' },
    { name: 'National Institute of Technology Silchar', shortName: 'NITS', city: 'Silchar', district: 'Cachar', state: 'Assam', lat: 24.7577, lng: 92.7925, website: 'https://www.nits.ac.in' },
  ];

  const universities: any[] = [];
  for (const u of universityData) {
    let created = await prisma.university.findFirst({ where: { name: u.name } });
    if (!created) {
      created = await prisma.university.create({
        data: {
          name: u.name,
          shortName: u.shortName,
          city: u.city,
          district: u.district,
          state: u.state,
          latitude: u.lat,
          longitude: u.lng,
          website: u.website,
          email: `contact@${u.shortName.toLowerCase()}.ac.in`,
        },
      });
    }
    universities.push(created);
  }
  console.log(`✅ ${universities.length} Universities ready`);

  // 3. Create 20+ Departments & Faculty Experts
  const deptDomains = [
    { name: 'Department of Civil & Environmental Engineering', domain: 'CIVIL_INFRASTRUCTURE' },
    { name: 'Department of Water Resources & Hydrology', domain: 'WATER_MANAGEMENT' },
    { name: 'Department of Computer Science & AI', domain: 'AI_AND_IOT' },
    { name: 'Department of Electrical & Smart Grid Systems', domain: 'CLEAN_ENERGY' },
  ];

  const createdDepts: any[] = [];
  for (const univ of universities.slice(0, 6)) {
    for (const d of deptDomains) {
      let dept = await prisma.universityDepartment.findFirst({
        where: { universityId: univ.id, name: d.name },
      });
      if (!dept) {
        dept = await prisma.universityDepartment.create({
          data: {
            universityId: univ.id,
            name: d.name,
            domain: d.domain,
          },
        });
      }
      createdDepts.push(dept);

      // Create Faculty Expert User & Profile
      const profEmail = `prof.${univ.shortName?.toLowerCase()}.${dept.id.slice(0, 4)}@edu.in`;
      const expertUser = await prisma.user.upsert({
        where: { email: profEmail },
        update: {},
        create: {
          firebaseUid: `expert-${dept.id.slice(0, 8)}`,
          email: profEmail,
          name: `Prof. ${dept.domain.split('_')[0]} Specialist`,
          role: Role.UNIVERSITY,
          status: UserStatus.ACTIVE,
          expertProfile: {
            create: {
              universityId: univ.id,
              departmentId: dept.id,
              designation: 'Associate Professor & Lab Director',
              expertise: [d.domain, 'Civic Prototyping', 'IoT Sensors', 'Smart Governance'],
              yearsExperience: 12,
            },
          },
        },
      });
    }
  }
  console.log(`✅ ${createdDepts.length} University Departments and Faculty Experts seeded`);

  // 4. Create 20+ Industry & CSR Partners
  const industryList = [
    { name: 'Larsen & Toubro Civil Tech Ltd', type: OrgType.CORPORATION, city: 'Mumbai', state: 'Maharashtra' },
    { name: 'Tata Community Initiatives Trust', type: OrgType.CSR, city: 'Mumbai', state: 'Maharashtra' },
    { name: 'Infosys Foundation CSR Hub', type: OrgType.CSR, city: 'Bengaluru', state: 'Karnataka' },
    { name: 'Reliance Foundation Green Cities', type: OrgType.CSR, city: 'Mumbai', state: 'Maharashtra' },
    { name: 'Siemens Smart Urban Infrastructure', type: OrgType.TECHNOLOGY_PROVIDER, city: 'Gurugram', state: 'Haryana' },
    { name: 'Wipro Earthian Civic Sustainability', type: OrgType.CSR, city: 'Bengaluru', state: 'Karnataka' },
    { name: 'Adani Clean Energy & Water Solutions', type: OrgType.CORPORATION, city: 'Ahmedabad', state: 'Gujarat' },
    { name: 'Shapoorji Pallonji Urban Works', type: OrgType.CORPORATION, city: 'Kolkata', state: 'West Bengal' },
    { name: 'Godrej CSR Environmental Labs', type: OrgType.CSR, city: 'Mumbai', state: 'Maharashtra' },
    { name: 'Kirloskar Clean Water Pumps MSME', type: OrgType.MSME, city: 'Pune', state: 'Maharashtra' },
    { name: 'Mahindra Waste-to-Energy Labs', type: OrgType.STARTUP, city: 'Hyderabad', state: 'Telangana' },
    { name: 'Zenith Drone Mapping Solutions', type: OrgType.STARTUP, city: 'Bhubaneswar', state: 'Odisha' },
    { name: 'AgriTech Cold Chain Innovation Hub', type: OrgType.MSME, city: 'Jaipur', state: 'Rajasthan' },
    { name: 'Bengal Solar Grid Infrastructure', type: OrgType.MSME, city: 'Siliguri', state: 'West Bengal' },
    { name: 'Damodar Valley Eco Restoration Trust', type: OrgType.NGO, city: 'Durgapur', state: 'West Bengal' },
    { name: 'Howrah Bridge Structural Tech Group', type: OrgType.CORPORATION, city: 'Howrah', state: 'West Bengal' },
    { name: 'Chennai Desalination & Filter MSME', type: OrgType.MSME, city: 'Chennai', state: 'Tamil Nadu' },
    { name: 'Delhi Air Quality Sensor Alliance', type: OrgType.NGO, city: 'Delhi', state: 'Delhi' },
    { name: 'EcoSanitation Rural Foundation', type: OrgType.NGO, city: 'Nandurbar', state: 'Maharashtra' },
    { name: 'Smart Urban Mobility Consortium', type: OrgType.FUNDING_PARTNER, city: 'Bengaluru', state: 'Karnataka' },
  ];

  const industries: any[] = [];
  for (let i = 0; i < industryList.length; i++) {
    const ind = industryList[i];
    const indEmail = `csr.${ind.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12)}_${i}@csr-partner.in`;
    const user = await prisma.user.upsert({
      where: { email: indEmail },
      update: {},
      create: {
        firebaseUid: `ind-uid-${i}-${Math.random().toString(36).substring(2, 7)}`,
        email: indEmail,
        name: `${ind.name} CSR Lead`,
        role: Role.INDUSTRY,
        status: UserStatus.ACTIVE,
        industryPartner: {
          create: {
            organizationName: ind.name,
            organizationType: ind.type,
            city: ind.city,
            district: ind.city,
            state: ind.state,
            description: `Leading provider of ${ind.type} initiatives across India.`,
          },
        },
      },
    });
    let partner = await prisma.industryPartner.findUnique({ where: { userId: user.id } });
    if (!partner) {
      partner = await prisma.industryPartner.create({
        data: {
          userId: user.id,
          organizationName: ind.name,
          organizationType: ind.type,
          city: ind.city,
          district: ind.city,
          state: ind.state,
          description: `Leading provider of ${ind.type} initiatives across India.`,
        },
      });
    }
    industries.push(partner);
  }
  console.log(`✅ ${industries.length} Industry & CSR Partners created`);

  // 5. Create Government Departments
  const govDepts = [
    { name: 'Pune Municipal Corporation (PMC)', state: 'Maharashtra', district: 'Pune' },
    { name: 'Municipal Corporation of Greater Mumbai (BMC)', state: 'Maharashtra', district: 'Mumbai' },
    { name: 'Bruhat Bengaluru Mahanagara Palike (BBMP)', state: 'Karnataka', district: 'Bengaluru Urban' },
    { name: 'Kolkata Municipal Corporation (KMC)', state: 'West Bengal', district: 'Kolkata' },
    { name: 'Howrah Municipal Corporation (HMC)', state: 'West Bengal', district: 'Howrah' },
    { name: 'Bhubaneswar Municipal Corporation (BMC-Odisha)', state: 'Odisha', district: 'Khurda' },
    { name: 'Jaipur Nagar Nigam', state: 'Rajasthan', district: 'Jaipur' },
    { name: 'Delhi Jal Board & PWD', state: 'Delhi', district: 'Central Delhi' },
  ];

  for (const g of govDepts) {
    const existing = await prisma.governmentDepartment.findFirst({ where: { name: g.name } });
    if (!existing) {
      await prisma.governmentDepartment.create({ data: g });
    }
  }
  console.log(`✅ ${govDepts.length} Government Municipal Departments ready`);

  // 6. Create 30+ Realistic Indian Challenges Across 11 Cities
  const challengeSeeds = [
    { title: 'Severe Pothole Cluster on NH-48 Near Hinjewadi Flyover', cat: 'Road Infrastructure', city: 'Pune', district: 'Pune', state: 'Maharashtra', lat: 18.5912, lng: 73.7385, sev: 92, prio: Priority.CRITICAL, pop: 85000 },
    { title: 'Contaminated Tap Water Supply in Dharavi Sector 4', cat: 'Water & Sanitation', city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra', lat: 19.0430, lng: 72.8528, sev: 97, prio: Priority.CRITICAL, pop: 12000 },
    { title: 'Open Drain Overflowing Near Whitefield IT Corridor', cat: 'Water & Sanitation', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', lat: 12.9698, lng: 77.7499, sev: 85, prio: Priority.HIGH, pop: 4500 },
    { title: 'Dangerous Streetlight Blackout in Jaipur Heritage Core', cat: 'Public Safety', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan', lat: 26.9263, lng: 75.8242, sev: 78, prio: Priority.MEDIUM, pop: 3000 },
    { title: 'Submerged Tram Tracks & Choked Culverts in College Street', cat: 'Urban Planning', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal', lat: 22.5744, lng: 88.3639, sev: 88, prio: Priority.HIGH, pop: 60000 },
    { title: 'Industrial Effluent Discharge in Damodar River Basin', cat: 'Environment', city: 'Durgapur', district: 'Paschim Bardhaman', state: 'West Bengal', lat: 23.5204, lng: 87.3119, sev: 94, prio: Priority.CRITICAL, pop: 35000 },
    { title: 'Collapsed Feeder Road Connecting Howrah Railway Yard', cat: 'Road Infrastructure', city: 'Howrah', district: 'Howrah', state: 'West Bengal', lat: 22.5958, lng: 88.2636, sev: 91, prio: Priority.CRITICAL, pop: 120000 },
    { title: 'Tea Plantation Runoff & Siltation in Mahananda River', cat: 'Environment', city: 'Siliguri', district: 'Darjeeling', state: 'West Bengal', lat: 26.7271, lng: 88.3953, sev: 76, prio: Priority.MEDIUM, pop: 18000 },
    { title: 'Heavy Metal Contamination in Bhubaneswar Industrial Borewells', cat: 'Water & Sanitation', city: 'Bhubaneswar', district: 'Khurda', state: 'Odisha', lat: 20.2961, lng: 85.8245, sev: 89, prio: Priority.HIGH, pop: 22000 },
    { title: 'Smog Hotspot & Waste Burning in Anand Vihar Inter-State Terminal', cat: 'Environment', city: 'Delhi', district: 'East Delhi', state: 'Delhi', lat: 28.6508, lng: 77.3153, sev: 98, prio: Priority.CRITICAL, pop: 200000 },
    { title: 'Severe Seawater Intrusion in Coastal Wells in Besant Nagar', cat: 'Water & Sanitation', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', lat: 13.0003, lng: 80.2667, sev: 82, prio: Priority.HIGH, pop: 15000 },
    { title: 'Choked Stormwater Drains Causing Flash Flooding in Madhapur', cat: 'Urban Planning', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', lat: 17.4483, lng: 78.3915, sev: 86, prio: Priority.HIGH, pop: 50000 },
    { title: 'Primary Health Centre Medicine Stockout in Nandurbar Tribal Belt', cat: 'Healthcare', city: 'Nandurbar', district: 'Nandurbar', state: 'Maharashtra', lat: 21.3700, lng: 74.2430, sev: 95, prio: Priority.CRITICAL, pop: 25000 },
    { title: 'Structurally Unsafe Government Primary School Building', cat: 'Education', city: 'Vijayawada', district: 'Krishna', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480, sev: 99, prio: Priority.CRITICAL, pop: 340 },
    { title: 'Frequent Transformer Explosions in Chandpole Market', cat: 'Energy', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan', lat: 26.9248, lng: 75.8112, sev: 83, prio: Priority.HIGH, pop: 8000 },
    { title: 'Uncollected Solid Waste Heap Near Howrah Wholesale Fish Market', cat: 'Waste Management', city: 'Howrah', district: 'Howrah', state: 'West Bengal', lat: 22.5867, lng: 88.3412, sev: 87, prio: Priority.HIGH, pop: 14000 },
    { title: 'Pesticide Soil Degradation Across Paddy Fields in Burdwan', cat: 'Agriculture', city: 'Durgapur', district: 'Purba Bardhaman', state: 'West Bengal', lat: 23.2324, lng: 87.8615, sev: 79, prio: Priority.MEDIUM, pop: 9500 },
    { title: 'Landslide Debris Blocking Hill Highway Near Kurseong', cat: 'Road Infrastructure', city: 'Siliguri', district: 'Darjeeling', state: 'West Bengal', lat: 26.8816, lng: 88.2789, sev: 93, prio: Priority.CRITICAL, pop: 40000 },
    { title: 'Unregulated Construction Dust in Electronic City Phase 1', cat: 'Environment', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', lat: 12.8452, lng: 77.6602, sev: 74, prio: Priority.MEDIUM, pop: 30000 },
    { title: 'Toxic Methane Buildup at Ghazipur Landfill Border', cat: 'Waste Management', city: 'Delhi', district: 'East Delhi', state: 'Delhi', lat: 28.6235, lng: 77.3289, sev: 99, prio: Priority.CRITICAL, pop: 350000 },
  ];

  for (let i = 0; i < challengeSeeds.length; i++) {
    const s = challengeSeeds[i];
    const existing = await prisma.challenge.findFirst({ where: { title: s.title } });
    if (existing) continue;

    const challenge = await prisma.challenge.create({
      data: {
        title: s.title,
        description: `${s.title}. Severe civic impact reported by multiple community residents. Requires urgent multi-stakeholder technical intervention and local government sanction.`,
        category: s.cat,
        severity: s.sev,
        priority: s.prio,
        affectedPopulation: s.pop,
        locationName: `${s.title.split(' in ')[1] || s.title.split(' Near ')[1] || s.city}`,
        city: s.city,
        district: s.district,
        state: s.state,
        latitude: s.lat,
        longitude: s.lng,
        aiAnalyzed: true,
        aiConfidence: 0.94,
        status: i < 5 ? ChallengeStatus.R_AND_D : i < 10 ? ChallengeStatus.DEPLOYED : ChallengeStatus.AI_ANALYZED,
        createdByUserId: citizenUser.id,
        aiAnalysis: {
          create: {
            problemSummary: `${s.title} affecting approx ${s.pop.toLocaleString('en-IN')} citizens.`,
            category: s.cat,
            severity: s.sev,
            urgency: s.sev,
            populationImpact: `Estimated ${s.pop.toLocaleString('en-IN')} direct residents`,
            healthImpact: s.sev > 85 ? 'High risk to community public health' : 'Moderate environmental stress',
            economicImpact: 'Impacting local trade and transport velocity',
            aiConfidence: 0.94,
            duplicateProbability: 0.02,
            governmentDepartment: `${s.city} Municipal Urban Works Division`,
            recommendedUniversity: universities[i % universities.length].name,
            recommendedExperts: ['Senior Civil & Environmental Engineering Specialists'],
          },
        },
      },
    });

    // Seed Status History
    await prisma.challengeStatusHistory.create({
      data: {
        challengeId: challenge.id,
        previousStatus: ChallengeStatus.SUBMITTED,
        newStatus: challenge.status,
        changedBy: citizenUser.id,
        comment: 'AI triage and multi-stakeholder matching completed.',
      },
    });

    // For first 3 challenges: Seed complete Project, Solution, Deployment, and ImpactMetric
    if (i < 3) {
      const project = await prisma.project.create({
        data: {
          challengeId: challenge.id,
          name: `R&D Initiative: ${challenge.title.slice(0, 40)}`,
          description: `Collaborative research blueprint to solve ${challenge.title} at ${challenge.city}.`,
          status: ProjectStatus.PILOT,
          createdByUniversityId: universities[i].id,
          budget: 45.0, // 45 Lakhs
          fundingSource: 'CSR & State Gov Seed Grant',
          solutions: {
            create: {
              title: `AI-Optimized Rapid Repair & Monitoring Kit`,
              description: 'Deploying low-cost IoT telemetry and high-grade cold polymer materials.',
              solutionType: 'TECH_AND_INFRA',
              estimatedCost: 35.0,
              feasibilityScore: 92.5,
              expectedImpact: `${challenge.affectedPopulation} citizens protected`,
              status: 'DEPLOYED',
              deployments: {
                create: {
                  location: challenge.locationName,
                  latitude: challenge.latitude,
                  longitude: challenge.longitude,
                  peopleImpacted: challenge.affectedPopulation || 10000,
                  deploymentNotes: 'Phase 1 sensors and materials installed on-site.',
                },
              },
            },
          },
          partnerships: {
            create: {
              industryPartnerId: industries[i].id,
              type: PartnershipType.CSR,
              fundingAmount: 25.0,
              status: 'APPROVED',
            },
          },
          impactMetrics: {
            create: {
              peopleImpacted: challenge.affectedPopulation || 10000,
              economicImpact: 120.0, // In Lakhs
              environmentalImpact: 'Reduced local environmental runoff by 68%',
              socialImpact: 'Improved community safety and transit reliability',
              responseTimeImprovement: 45.0,
              costReduction: 32.0,
            },
          },
        },
      });
    }
  }

  console.log(`✅ ${challengeSeeds.length} Civic Challenges, Projects, Deployments, and Impact Metrics seeded`);
  console.log('🎉 SAMADHAAN database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
