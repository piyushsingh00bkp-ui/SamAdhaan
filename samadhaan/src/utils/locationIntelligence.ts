export interface CityHub {
  id: string;
  name: string;
  state: string;
  district: string;
  lat: number;
  lng: number;
  municipalBody: string;
  nodalOfficer: string;
  helpline: string;
  universities: Array<{
    id: string;
    name: string;
    department: string;
    specialization: string;
    ranking: string;
  }>;
  industryPartners: Array<{
    name: string;
    csrFocus: string[];
    potentialFunding: string;
  }>;
}

export const INDIAN_CITIES: CityHub[] = [
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    district: 'Pune',
    lat: 18.5204,
    lng: 73.8567,
    municipalBody: 'Pune Municipal Corporation (PMC)',
    nodalOfficer: 'Shri Vikram Kumar, IAS (Municipal Commissioner)',
    helpline: '1800-1030-222',
    universities: [
      { id: 'COEP', name: 'COEP Technological University', department: 'Civil & Environmental Engg', specialization: 'Urban Drainage & Flood Modeling', ranking: 'Tier-1' },
      { id: 'SPPU', name: 'Savitribai Phule Pune University', department: 'Environmental Sciences', specialization: 'Air Quality & Waste Management', ranking: 'State Apex' },
      { id: 'MIT-WPU', name: 'MIT World Peace University', department: 'Smart Infrastructure School', specialization: 'Sensor IoT & Pothole Telemetry', ranking: 'Private Top' }
    ],
    industryPartners: [
      { name: 'Tata Motors CSR Urban Mobility Fund', csrFocus: ['EV Transit', 'Road Safety', 'Skill Centers'], potentialFunding: 'INR 45 Lakhs' },
      { name: 'Infosys Foundation Pune Chapter', csrFocus: ['Smart Sanitation', 'Lakes Rejuvenation'], potentialFunding: 'INR 60 Lakhs' },
      { name: 'Bajaj Auto Community Trust', csrFocus: ['Healthcare Facilities', 'Rural Infrastructure'], potentialFunding: 'INR 35 Lakhs' }
    ]
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    district: 'Mumbai Suburban',
    lat: 19.0760,
    lng: 72.8777,
    municipalBody: 'Brihanmumbai Municipal Corporation (BMC)',
    nodalOfficer: 'Shri Bhushan Gagrani, IAS (Municipal Commissioner)',
    helpline: '1916',
    universities: [
      { id: 'IITB', name: 'IIT Bombay', department: 'Centre for Urban Science & Engg (C-USE)', specialization: 'Coastal Stormwater & GIS Resiliency', ranking: 'Institute of Eminence' },
      { id: 'VJTI', name: 'Veermata Jijabai Technological Institute (VJTI)', department: 'Structural Engineering', specialization: 'Flyover & Asphalt Durability', ranking: 'Autonomous Premier' },
      { id: 'ICT', name: 'Institute of Chemical Technology (ICT)', department: 'Bioprocess & Waste', specialization: 'Effluent & Industrial Water Treatment', ranking: 'Deemed Univ' }
    ],
    industryPartners: [
      { name: 'Reliance Foundation Civic Resilience', csrFocus: ['Disaster Relief', 'Urban Green Corridors'], potentialFunding: 'INR 1.20 Crore' },
      { name: 'L&T Public Charitable Trust', csrFocus: ['Smart Bridge Monitoring', 'Drinking Water Networks'], potentialFunding: 'INR 85 Lakhs' },
      { name: 'Godrej Community Development', csrFocus: ['Mangrove Conservation', 'Slum Sanitation'], potentialFunding: 'INR 50 Lakhs' }
    ]
  },
  {
    id: 'delhi',
    name: 'Delhi NCR',
    state: 'Delhi',
    district: 'New Delhi',
    lat: 28.6139,
    lng: 77.2090,
    municipalBody: 'Municipal Corporation of Delhi (MCD) / NDMC',
    nodalOfficer: 'Shri Ashwani Kumar, IAS (Special Officer, MCD)',
    helpline: '155305',
    universities: [
      { id: 'IITD', name: 'IIT Delhi', department: 'Civil Engineering & Atmospheric Sciences', specialization: 'Smog Mitigation & Concrete Pavements', ranking: 'Institute of Eminence' },
      { id: 'DTU', name: 'Delhi Technological University (DTU)', department: 'Environmental Engineering', specialization: 'Wastewater Recycling & Landfills', ranking: 'State Premier' },
      { id: 'IIITD', name: 'IIIT Delhi', department: 'Center for AI & Governance', specialization: 'Traffic AI & Civic Grievance Routing', ranking: 'State Premier' }
    ],
    industryPartners: [
      { name: 'Maruti Suzuki India CSR', csrFocus: ['Road Safety Tech', 'Community Solar'], potentialFunding: 'INR 75 Lakhs' },
      { name: 'DLF Care Foundation', csrFocus: ['Urban Parks', 'Rainwater Harvesting'], potentialFunding: 'INR 55 Lakhs' },
      { name: 'Bharti Airtel Foundation', csrFocus: ['Digital Schools', 'Civic Telemetry'], potentialFunding: 'INR 40 Lakhs' }
    ]
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    lat: 12.9716,
    lng: 77.5946,
    municipalBody: 'Bruhat Bengaluru Mahanagara Palike (BBMP)',
    nodalOfficer: 'Shri Tushar Giri Nath, IAS (Chief Commissioner, BBMP)',
    helpline: '1533',
    universities: [
      { id: 'IISC', name: 'Indian Institute of Science (IISc)', department: 'Center for Sustainable Technologies', specialization: 'Lake Rejuvenation & Groundwater AI', ranking: 'Top National' },
      { id: 'RVCE', name: 'RV College of Engineering', department: 'Civil & Geo-Informatics', specialization: 'Smart Pothole Mapping & Telematics', ranking: 'Tier-1' },
      { id: 'BMSCE', name: 'BMS College of Engineering', department: 'Transportation Engineering', specialization: 'Corridor Optimization & Traffic Sensors', ranking: 'Tier-1' }
    ],
    industryPartners: [
      { name: 'Wipro Cares Sustainable Cities Initiative', csrFocus: ['Water Conservation', 'Eco-Sanitation'], potentialFunding: 'INR 90 Lakhs' },
      { name: 'Infosys Green Urban Infrastructure Fund', csrFocus: ['Zero Carbon Transport', 'Urban Forestry'], potentialFunding: 'INR 1.10 Crore' },
      { name: 'Biocon Foundation Health & Sanitation', csrFocus: ['Primary Health Centers', 'Clean Water ATMs'], potentialFunding: 'INR 45 Lakhs' }
    ]
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    district: 'Hyderabad',
    lat: 17.3850,
    lng: 78.4867,
    municipalBody: 'Greater Hyderabad Municipal Corporation (GHMC)',
    nodalOfficer: 'Shri Ronald Rose, IAS (Commissioner, GHMC)',
    helpline: '040-21111111',
    universities: [
      { id: 'IITH', name: 'IIT Hyderabad', department: 'Climate Change & Civil Infrastructure', specialization: 'Precast Roads & Disaster Modeling', ranking: 'IIT' },
      { id: 'IIITH', name: 'IIIT Hyderabad', department: 'Smart City Living Lab', specialization: 'IoT Air Quality & Water Grid Sensors', ranking: 'Premier AI Hub' },
      { id: 'OU', name: 'Osmania University College of Engineering', department: 'Mining & Geotechnical', specialization: 'Foundation Soil Stabilization', ranking: 'State University' }
    ],
    industryPartners: [
      { name: 'Dr. Reddys Foundation Civic Health', csrFocus: ['Water Purification', 'Hospital Waste Logistics'], potentialFunding: 'INR 65 Lakhs' },
      { name: 'Cyient Urban Innovation Fund', csrFocus: ['GIS Street Mapping', 'Drone Inspections'], potentialFunding: 'INR 40 Lakhs' },
      { name: 'GMR Varalakshmi Foundation', csrFocus: ['Highway Infrastructure', 'Youth Skill Labs'], potentialFunding: 'INR 50 Lakhs' }
    ]
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    district: 'Chennai',
    lat: 13.0827,
    lng: 80.2707,
    municipalBody: 'Greater Chennai Corporation (GCC)',
    nodalOfficer: 'Dr. J. Radhakrishnan, IAS (Commissioner, GCC)',
    helpline: '1913',
    universities: [
      { id: 'IITM', name: 'IIT Madras', department: 'Building Technology & Construction Mgmt', specialization: 'Storm Water Infiltration & Geopolymer Concrete', ranking: 'NIRF #1' },
      { id: 'ANNA', name: 'Anna University (CEG Campus)', department: 'Civil & Water Resources', specialization: 'Desalination Runoff & Urban Canals', ranking: 'State Apex' },
      { id: 'SRM', name: 'SRM Institute of Science and Technology', department: 'Environmental Studies', specialization: 'Solid Waste Pyrolysis', ranking: 'Top Deemed' }
    ],
    industryPartners: [
      { name: 'TVS Motor Community Development Trust', csrFocus: ['Rural Roads', 'Desalination Plants'], potentialFunding: 'INR 55 Lakhs' },
      { name: 'Hyundai Motor India Foundation', csrFocus: ['Disaster Relief Vehicles', 'Green Schools'], potentialFunding: 'INR 70 Lakhs' },
      { name: 'Ashok Leyland CSR Green Fleet', csrFocus: ['Waste Collection Vehicles', 'Road Safety'], potentialFunding: 'INR 40 Lakhs' }
    ]
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    district: 'Kolkata',
    lat: 22.5726,
    lng: 88.3639,
    municipalBody: 'Kolkata Municipal Corporation (KMC)',
    nodalOfficer: 'Shri Dhaval Jain, IAS (Municipal Commissioner)',
    helpline: '033-2286-1212',
    universities: [
      { id: 'JU', name: 'Jadavpur University', department: 'Civil & Water Resources Engineering', specialization: 'Heritage Drainage & Arsenic Removal', ranking: 'State Premier' },
      { id: 'IIEST', name: 'IIEST Shibpur', department: 'Town & Regional Planning', specialization: 'Flood Plain Zoning & Riverbank Stability', ranking: 'NIT+' },
      { id: 'CU', name: 'Calcutta University Rajabazar Campus', department: 'Applied Chemistry', specialization: 'Sewage Chemical Treatment', ranking: 'Historic Apex' }
    ],
    industryPartners: [
      { name: 'ITC Mission Sunehra Kal', csrFocus: ['Integrated Watersheds', 'Afforestation'], potentialFunding: 'INR 80 Lakhs' },
      { name: 'Coal India Environmental CSR', csrFocus: ['Mining Area Clean Water', 'Solar Streetlights'], potentialFunding: 'INR 65 Lakhs' },
      { name: 'CESC Civic Welfare Trust', csrFocus: ['Underground Cable Safety', 'Street Lighting'], potentialFunding: 'INR 35 Lakhs' }
    ]
  },
  {
    id: 'patna',
    name: 'Patna',
    state: 'Bihar',
    district: 'Patna',
    lat: 25.5941,
    lng: 85.1376,
    municipalBody: 'Patna Municipal Corporation (PMC)',
    nodalOfficer: 'Shri Animesh Parashar, IAS (Municipal Commissioner)',
    helpline: '155304',
    universities: [
      { id: 'IITP', name: 'IIT Patna', department: 'Civil & Infrastructure Engineering', specialization: 'Ganga Riverfront Resiliency & Silt Removal', ranking: 'IIT' },
      { id: 'NITP', name: 'NIT Patna', department: 'Urban Transport & Smart City Lab', specialization: 'Road Pavement Condition AI & Pothole Scanners', ranking: 'NIT' },
      { id: 'BITP', name: 'BIT Mesra Patna Extension', department: 'Computer Science & IoT', specialization: 'Smart Pump Station Automation', ranking: 'Tier-1' }
    ],
    industryPartners: [
      { name: 'Vedanta CSR Bihar Development Fund', csrFocus: ['Clean Water Purification', 'Primary Healthcare'], potentialFunding: 'INR 45 Lakhs' },
      { name: 'Indian Oil Barauni CSR Community Cell', csrFocus: ['Sanitation Corridors', 'Civic Waste Processing'], potentialFunding: 'INR 50 Lakhs' },
      { name: 'NTPC Eastern Region Civic Trust', csrFocus: ['Solar Microgrids', 'Rural Connectivity'], potentialFunding: 'INR 60 Lakhs' }
    ]
  },
  {
    id: 'lucknow',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    lat: 26.8467,
    lng: 80.9462,
    municipalBody: 'Lucknow Municipal Corporation (LMC)',
    nodalOfficer: 'Shri Inderjit Singh, IAS (Municipal Commissioner)',
    helpline: '1533',
    universities: [
      { id: 'IITK', name: 'IIT Kanpur (Regional Outreach)', department: 'Civil & Geo-Informatics', specialization: 'River Gomti Water Quality & Smart Sensors', ranking: 'Top IIT' },
      { id: 'IET', name: 'Institute of Engineering and Technology (IET)', department: 'Civil Engineering', specialization: 'Urban Solid Waste Bio-methanation', ranking: 'State Gov Apex' },
      { id: 'AKTU', name: 'Dr. A.P.J. Abdul Kalam Technical University', department: 'Innovation & Incubation Hub', specialization: 'Civic Drones & AI Infrastructure Apps', ranking: 'State Tech Univ' }
    ],
    industryPartners: [
      { name: 'HCL Foundation Samuday Initiative', csrFocus: ['Smart Villages', 'Clean Water Ecosystems'], potentialFunding: 'INR 75 Lakhs' },
      { name: 'Tata Motors Lucknow Plant CSR', csrFocus: ['Pothole Free Corridors', 'Vocational Labs'], potentialFunding: 'INR 40 Lakhs' },
      { name: 'HAL Community Development Fund', csrFocus: ['Civic Hospital Equipment', 'Solar Lighting'], potentialFunding: 'INR 30 Lakhs' }
    ]
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    district: 'Ahmedabad',
    lat: 23.0225,
    lng: 72.5714,
    municipalBody: 'Ahmedabad Municipal Corporation (AMC)',
    nodalOfficer: 'Shri M. Thennarasan, IAS (Municipal Commissioner)',
    helpline: '155303',
    universities: [
      { id: 'IITGN', name: 'IIT Gandhinagar', department: 'Earth Sciences & Structural Systems', specialization: 'Sabarmati Basin Hydrology & Seismic Resistance', ranking: 'IIT' },
      { id: 'CEPT', name: 'CEPT University', department: 'Faculty of Urban Planning & Design', specialization: 'BRTS Corridor Transit & Public Spaces', ranking: 'Architecture Top' },
      { id: 'NIRMA', name: 'Nirma University', department: 'Civil & Environmental Technology', specialization: 'Recycled Aggregate Bitumen Roads', ranking: 'Tier-1' }
    ],
    industryPartners: [
      { name: 'Adani Foundation Sustainable Infra', csrFocus: ['Coastal Protection', 'Green Energy Wards'], potentialFunding: 'INR 95 Lakhs' },
      { name: 'Torrent Power Civic Care Initiative', csrFocus: ['Underground Cabling', 'Community Health'], potentialFunding: 'INR 45 Lakhs' },
      { name: 'Zydus Cadila Clean City Trust', csrFocus: ['Sanitation & Disease Vector Control'], potentialFunding: 'INR 40 Lakhs' }
    ]
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    district: 'Jaipur',
    lat: 26.9124,
    lng: 75.7873,
    municipalBody: 'Jaipur Greater / Heritage Municipal Corporation (JMC)',
    nodalOfficer: 'Smt. Rukmani Riar, IAS (Commissioner)',
    helpline: '1800-180-6666',
    universities: [
      { id: 'MNIT', name: 'MNIT Jaipur', department: 'Centre for Energy & Civil Engineering', specialization: 'Desert Road Pavements & Solar Storm Drains', ranking: 'NIT' },
      { id: 'BITS', name: 'BITS Pilani (Rajasthan)', department: 'Water & Environment Technology Lab', specialization: 'Arid Zone Water Recirculation & AI IoT', ranking: 'Institute of Eminence' },
      { id: 'RTU', name: 'Rajasthan Technical University', department: 'Geotechnical Engineering', specialization: 'Sand Soil Retaining Walls', ranking: 'State Tech Univ' }
    ],
    industryPartners: [
      { name: 'Hero MotoCorp CSR Jaipur Hub', csrFocus: ['Road Safety Parks', 'Zero Emission Fleets'], potentialFunding: 'INR 50 Lakhs' },
      { name: 'Cairn Oil & Gas Water Sustainability Fund', csrFocus: ['Groundwater Recharge Wells', 'RO Plants'], potentialFunding: 'INR 60 Lakhs' },
      { name: 'Ambuja Cement Foundation Rajasthan', csrFocus: ['Concrete Roads', 'Watershed Harvesting'], potentialFunding: 'INR 35 Lakhs' }
    ]
  },
  {
    id: 'bhopal_indore',
    name: 'Indore / Bhopal',
    state: 'Madhya Pradesh',
    district: 'Indore',
    lat: 22.7196,
    lng: 75.8577,
    municipalBody: 'Indore Municipal Corporation (IMC - Cleanest City)',
    nodalOfficer: 'Shri Harshika Singh, IAS (Commissioner, IMC)',
    helpline: '0731-2535555',
    universities: [
      { id: 'IITI', name: 'IIT Indore', department: 'Civil Infrastructure & Smart Systems', specialization: 'Bio-CNG Waste Plant Telemetry & Road Sensors', ranking: 'IIT' },
      { id: 'MANIT', name: 'MANIT Bhopal', department: 'Urban Planning & Water Resources', specialization: 'Upper Lake Catchment Preservation & Slum Sanitation', ranking: 'NIT' },
      { id: 'SGSITS', name: 'SGSITS Indore', department: 'Transportation Engineering', specialization: '3R (Reduce, Reuse, Recycle) Road Mixes', ranking: 'Tier-1' }
    ],
    industryPartners: [
      { name: 'BHEL Bhopal CSR Initiative', csrFocus: ['Substation Civic Safety', 'Community Drinking Water'], potentialFunding: 'INR 45 Lakhs' },
      { name: 'Eicher Motors Indore Trust', csrFocus: ['Automated Sanitation Trucks', 'Skill Labs'], potentialFunding: 'INR 55 Lakhs' },
      { name: 'Dainik Bhaskar Civic Impact Fund', csrFocus: ['Citizen Reporting', 'Park Cleanups'], potentialFunding: 'INR 30 Lakhs' }
    ]
  },
  {
    id: 'kochi',
    name: 'Kochi',
    state: 'Kerala',
    district: 'Ernakulam',
    lat: 9.9312,
    lng: 76.2673,
    municipalBody: 'Kochi Municipal Corporation (KMC)',
    nodalOfficer: 'Shri Chetan Kumar Meena, IAS (Secretary)',
    helpline: '0484-2369007',
    universities: [
      { id: 'CUSAT', name: 'Cochin University of Science and Technology (CUSAT)', department: 'Marine Sciences & Civil Engg', specialization: 'Backwater Eco-Restoration & Water Metro Canals', ranking: 'State Apex' },
      { id: 'NITC', name: 'NIT Calicut (Kerala Hub)', department: 'Transportation Engineering', specialization: 'Monsoon Resilient Asphalt', ranking: 'NIT' },
      { id: 'MEC', name: 'Govt. Model Engineering College Kochi', department: 'IoT & Embedded Systems', specialization: 'Canal Sluice Gate Automation', ranking: 'State Govt' }
    ],
    industryPartners: [
      { name: 'Cochin Shipyard CSR Green Port', csrFocus: ['Solar Ferries', 'Canal Cleaning Robots'], potentialFunding: 'INR 65 Lakhs' },
      { name: 'Muthoot Finance Community Trust', csrFocus: ['Disaster Relief', 'Public Dispensaries'], potentialFunding: 'INR 40 Lakhs' },
      { name: 'BPCL Kochi Refinery CSR Cell', csrFocus: ['Coastal Drinking Water', 'Mangrove Belts'], potentialFunding: 'INR 50 Lakhs' }
    ]
  }
];

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function resolveLocationHub(input: {
  lat?: number;
  lng?: number;
  text?: string;
  city?: string;
  state?: string;
}): CityHub {
  const { lat, lng, text, city, state } = input;
  const searchStr = [text, city, state].filter(Boolean).join(' ').toLowerCase();

  for (const c of INDIAN_CITIES) {
    if (
      searchStr.includes(c.name.toLowerCase()) ||
      searchStr.includes(c.district.toLowerCase()) ||
      (c.id === 'delhi' && (searchStr.includes('noida') || searchStr.includes('gurgaon') || searchStr.includes('faridabad'))) ||
      (c.id === 'mumbai' && (searchStr.includes('thane') || searchStr.includes('navi mumbai')))
    ) {
      return c;
    }
  }

  for (const c of INDIAN_CITIES) {
    if (searchStr.includes(c.state.toLowerCase())) {
      return c;
    }
  }

  if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
    let closest = INDIAN_CITIES[0];
    let minDistance = calculateDistance(lat, lng, closest.lat, closest.lng);

    for (let i = 1; i < INDIAN_CITIES.length; i++) {
      const dist = calculateDistance(lat, lng, INDIAN_CITIES[i].lat, INDIAN_CITIES[i].lng);
      if (dist < minDistance) {
        minDistance = dist;
        closest = INDIAN_CITIES[i];
      }
    }
    return closest;
  }

  return INDIAN_CITIES[0];
}
