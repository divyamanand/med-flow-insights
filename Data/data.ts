const doctors = [
  {
    id: "D001",
    name: "Dr. Sarah Johnson",
    speciality: ["Cardiology"],
    timings: "9:00 AM - 5:00 PM",
    room_no: "203",
    available: true,
  },
  {
    id: "D002",
    name: "Dr. Michael Brown",
    speciality: ["General Medicine", "Family Practice"],
    timings: "8:00 AM - 4:00 PM",
    room_no: "101",
    available: true,
  },
  {
    id: "D003",
    name: "Dr. Jessica Martinez",
    speciality: ["Surgery", "Orthopedics"],
    timings: "10:00 AM - 6:00 PM",
    room_no: "305",
    available: false,
  },
  {
    id: "D004",
    name: "Dr. David Lee",
    speciality: ["Pulmonology", "Critical Care"],
    timings: "7:00 AM - 7:00 PM",
    room_no: "ICU-2",
    available: true,
  },
  {
    id: "D005",
    name: "Dr. Patricia Wilson",
    speciality: ["Emergency Medicine", "Trauma"],
    timings: "Night Shift: 8:00 PM - 8:00 AM",
    room_no: "ER-1",
    available: true,
  },
  {
    id: "D006",
    name: "Dr. Elizabeth Chen",
    speciality: ["Obstetrics", "Gynecology"],
    timings: "9:00 AM - 3:00 PM",
    room_no: "204",
    available: false,
  },
  {
    id: "D007",
    name: "Dr. Robert Taylor",
    speciality: ["Cardiothoracic Surgery"],
    timings: "8:00 AM - 4:00 PM",
    room_no: "OR-3",
    available: true,
  },
  {
    id: "D008",
    name: "Dr. James Wilson",
    speciality: ["Neurology", "Stroke Care"],
    timings: "10:00 AM - 6:00 PM",
    room_no: "302",
    available: true,
  },
];

// patients //////////////////////////////////////////////
const patients = [
  {
    id: "P001",
    name: "John Smith",
    issues: ["Chest Pain", "High Blood Pressure"],
    type: "Emergency",
    date: new Date(2023, 3, 21),
    ipd_no: "IPD2023042101",
    doctor: "Dr. Sarah Johnson",
    staff: ["Nurse Amy", "Tech Rob"],
    medicines: ["Aspirin", "Lisinopril"],
  },
  {
    id: "P002",
    name: "Emily Davis",
    issues: ["Annual Checkup"],
    type: "Regular",
    date: new Date(2023, 3, 20),
    ipd_no: "IPD2023042001",
    doctor: "Dr. Michael Brown",
    staff: ["Nurse Tom"],
    medicines: [],
  },
  {
    id: "P003",
    name: "Robert Wilson",
    issues: ["Appendicitis"],
    type: "Surgery",
    date: new Date(2023, 3, 19),
    ipd_no: "IPD2023041901",
    doctor: "Dr. Jessica Martinez",
    staff: ["Nurse Emma", "Nurse Dave", "Tech Samantha"],
    medicines: ["Antibiotics", "Painkillers", "IV Fluids"],
  },
  {
    id: "P004",
    name: "Lisa Thompson",
    issues: ["Respiratory Failure", "Pneumonia"],
    type: "ICU",
    date: new Date(2023, 3, 18),
    ipd_no: "IPD2023041801",
    doctor: "Dr. David Lee",
    staff: ["Nurse Alex", "Nurse Maria", "Tech James"],
    medicines: ["Ventolin", "Antibiotics", "Steroids", "Oxygen Therapy"],
  },
  {
    id: "P005",
    name: "Michael Johnson",
    issues: ["Broken Arm", "Concussion"],
    type: "Emergency",
    date: new Date(2023, 3, 17),
    ipd_no: "IPD2023041701",
    doctor: "Dr. Patricia Wilson",
    staff: ["Nurse Bob", "Tech Lucy"],
    medicines: ["Painkillers", "Anti-inflammatory"],
  },
  {
    id: "P006",
    name: "Jennifer Brown",
    issues: ["Pregnancy Checkup"],
    type: "Regular",
    date: new Date(2023, 3, 16),
    ipd_no: "IPD2023041601",
    doctor: "Dr. Elizabeth Chen",
    staff: ["Nurse Kelly"],
    medicines: ["Prenatal Vitamins"],
  },
  {
    id: "P007",
    name: "David Miller",
    issues: ["Heart Surgery", "Coronary Artery Disease"],
    type: "Surgery",
    date: new Date(2023, 3, 15),
    ipd_no: "IPD2023041501",
    doctor: "Dr. Robert Taylor",
    staff: ["Nurse Sarah", "Nurse John", "Tech Diana", "Tech George"],
    medicines: ["Blood Thinners", "Beta Blockers", "Pain Medication", "Antibiotics"],
  },
  {
    id: "P008",
    name: "Susan Anderson",
    issues: ["Stroke", "Hypertension"],
    type: "ICU",
    date: new Date(2023, 3, 14),
    ipd_no: "IPD2023041401",
    doctor: "Dr. James Wilson",
    staff: ["Nurse Emily", "Nurse Michael", "Tech Robert"],
    medicines: ["Blood Thinners", "Anti-hypertensives", "Statins"],
  },
];


// Sample data
const supplies = [
  {
    item_id: 1001,
    name: "Disposable Gloves",
    type: "PPE",
    delivery_date: new Date(2023, 2, 15),
    expiry_date: new Date(2025, 2, 15),
    expired: false,
  },
  {
    item_id: 1002,
    name: "Surgical Masks",
    type: "PPE",
    delivery_date: new Date(2023, 1, 20),
    expiry_date: new Date(2025, 1, 20),
    expired: false,
  },
  {
    item_id: 1003,
    name: "Antibiotics - Amoxicillin",
    type: "Medication",
    delivery_date: new Date(2023, 0, 10),
    expiry_date: new Date(2023, 6, 10),
    expired: true,
  },
  {
    item_id: 1004,
    name: "IV Solution - Normal Saline",
    type: "Medical Supply",
    delivery_date: new Date(2023, 3, 5),
    expiry_date: new Date(2025, 3, 5),
    expired: false,
  },
  {
    item_id: 1005,
    name: "Syringes 10ml",
    type: "Medical Supply",
    delivery_date: new Date(2023, 2, 25),
    expiry_date: new Date(2026, 2, 25),
    expired: false,
  },
  {
    item_id: 1006,
    name: "Bandages",
    type: "Medical Supply",
    delivery_date: new Date(2023, 4, 1),
    expiry_date: new Date(2026, 4, 1),
    expired: false,
  },
  {
    item_id: 1007,
    name: "Antiseptic Solution",
    type: "Medical Supply",
    delivery_date: new Date(2023, 1, 15),
    expiry_date: new Date(2024, 1, 15),
    expired: false,
  },
  {
    item_id: 1008,
    name: "Painkillers - Ibuprofen",
    type: "Medication",
    delivery_date: new Date(2023, 0, 20),
    expiry_date: new Date(2023, 7, 20),
    expired: true,
  },
];

const bloodInventory = [
  {
    item_id: 5001,
    blood_group: "A+",
    type: "Whole Blood",
    delivery_date: new Date(2023, 3, 20),
    expiry_date: new Date(2023, 4, 18),
    expired: false,
  },
  {
    item_id: 5002,
    blood_group: "B+",
    type: "Platelets",
    delivery_date: new Date(2023, 3, 22),
    expiry_date: new Date(2023, 3, 29),
    expired: true,
  },
  {
    item_id: 5003,
    blood_group: "O-",
    type: "Whole Blood",
    delivery_date: new Date(2023, 3, 25),
    expiry_date: new Date(2023, 4, 23),
    expired: false,
  },
  {
    item_id: 5004,
    blood_group: "AB+",
    type: "Plasma",
    delivery_date: new Date(2023, 3, 26),
    expiry_date: new Date(2023, 6, 26),
    expired: false,
  },
  {
    item_id: 5005,
    blood_group: "A-",
    type: "Red Blood Cells",
    delivery_date: new Date(2023, 3, 27),
    expiry_date: new Date(2023, 5, 27),
    expired: false,
  },
  {
    item_id: 5006,
    blood_group: "O+",
    type: "Whole Blood",
    delivery_date: new Date(2023, 3, 15),
    expiry_date: new Date(2023, 4, 13),
    expired: false,
  },
];


// Sample data
const medicinesData = [
  {
    id: "1",
    name: "MED A",
    batches: [
      {
        id: "1-1",
        quantity: 3,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now (valid)
        batchNumber: "BA-12345",
        manufacturer: "Pharma Inc.",
      },
      {
        id: "1-2",
        quantity: 5,
        expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now (expiring soon)
        batchNumber: "BA-12346",
        manufacturer: "Pharma Inc.",
      },
      {
        id: "1-3",
        quantity: 4,
        expirationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (expired)
        batchNumber: "BA-12347",
        manufacturer: "Pharma Inc.",
      },
    ],
  },
  {
    id: "2",
    name: "MED B",
    batches: [
      {
        id: "2-1",
        quantity: 4,
        expirationDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now (valid)
        batchNumber: "BB-67890",
        manufacturer: "MediCorp",
      },
      {
        id: "2-2",
        quantity: 5,
        expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now (expiring soon)
        batchNumber: "BB-67891",
        manufacturer: "MediCorp",
      },
      {
        id: "2-3",
        quantity: 4,
        expirationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago (expired)
        batchNumber: "BB-67892",
        manufacturer: "MediCorp",
      },
    ],
  },
  {
    id: "3",
    name: "MED C",
    batches: [
      {
        id: "3-1",
        quantity: 6,
        expirationDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now (valid)
        batchNumber: "BC-54321",
        manufacturer: "HealthPharm",
      },
      {
        id: "3-2",
        quantity: 3,
        expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now (expiring soon)
        batchNumber: "BC-54322",
        manufacturer: "HealthPharm",
      },
      {
        id: "3-3",
        quantity: 2,
        expirationDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago (expired)
        batchNumber: "BC-54323",
        manufacturer: "HealthPharm",
      },
    ],
  },
  {
    id: "4",
    name: "MED D",
    batches: [
      {
        id: "4-1",
        quantity: 8,
        expirationDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now (valid)
        batchNumber: "BD-13579",
        manufacturer: "MedSupply",
      },
      {
        id: "4-2",
        quantity: 4,
        expirationDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now (expiring soon)
        batchNumber: "BD-13580",
        manufacturer: "MedSupply",
      },
      {
        id: "4-3",
        quantity: 3,
        expirationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago (expired)
        batchNumber: "BD-13581",
        manufacturer: "MedSupply",
      },
    ],
  },
  {
    id: "5",
    name: "MED E",
    batches: [
      {
        id: "5-1",
        quantity: 7,
        expirationDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        batchNumber: "BE-24680",
        manufacturer: "Wellness Labs",
      },
      {
        id: "5-2",
        quantity: 2,
        expirationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        batchNumber: "BE-24681",
        manufacturer: "Wellness Labs",
      },
      {
        id: "5-3",
        quantity: 1,
        expirationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        batchNumber: "BE-24682",
        manufacturer: "Wellness Labs",
      },
    ],
  },
  {
    id: "6",
    name: "MED F",
    batches: [
      {
        id: "6-1",
        quantity: 5,
        expirationDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        batchNumber: "BF-36912",
        manufacturer: "LifeCare",
      },
      {
        id: "6-2",
        quantity: 6,
        expirationDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        batchNumber: "BF-36913",
        manufacturer: "LifeCare",
      },
      {
        id: "6-3",
        quantity: 2,
        expirationDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        batchNumber: "BF-36914",
        manufacturer: "LifeCare",
      },
    ],
  },
  {
    id: "7",
    name: "MED G",
    batches: [
      {
        id: "7-1",
        quantity: 10,
        expirationDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
        batchNumber: "BG-14725",
        manufacturer: "Biogenix",
      },
      {
        id: "7-2",
        quantity: 3,
        expirationDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        batchNumber: "BG-14726",
        manufacturer: "Biogenix",
      },
      {
        id: "7-3",
        quantity: 2,
        expirationDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        batchNumber: "BG-14727",
        manufacturer: "Biogenix",
      },
    ],
  },
  {
    id: "8",
    name: "MED H",
    batches: [
      {
        id: "8-1",
        quantity: 11,
        expirationDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        batchNumber: "BH-85263",
        manufacturer: "ZenBio",
      },
      {
        id: "8-2",
        quantity: 2,
        expirationDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        batchNumber: "BH-85264",
        manufacturer: "ZenBio",
      },
      {
        id: "8-3",
        quantity: 3,
        expirationDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        batchNumber: "BH-85265",
        manufacturer: "ZenBio",
      },
    ],
  },
]


// Sample data for blood inventory
const bloodInventoryStatus = {
  "A+": { available: 35, critical: 20 },
  "A-": { available: 12, critical: 10 },
  "B+": { available: 28, critical: 20 },
  "B-": { available: 8, critical: 10 },
  "AB+": { available: 15, critical: 10 },
  "AB-": { available: 5, critical: 5 },
  "O+": { available: 42, critical: 25 },
  "O-": { available: 18, critical: 15 }
};



// Sample data for donation statistics
const donationStats = [
  { name: "Whole Blood", value: 120, color: "#ef4444" },
  { name: "Platelets", value: 45, color: "#f59e0b" },
  { name: "Plasma", value: 60, color: "#3b82f6" },
  { name: "Red Blood Cells", value: 40, color: "#8b5cf6" },
];

// Donor demographics data
const donorAgeData = [
  { name: "18-24", value: 25, color: "#c7d2fe" },
  { name: "25-34", value: 35, color: "#a5b4fc" },
  { name: "35-44", value: 20, color: "#818cf8" },
  { name: "45-54", value: 15, color: "#6366f1" },
  { name: "55+", value: 5, color: "#4f46e5" },
];

// Donation history by month
const monthlyDonations = [
  { month: "Jan", donations: 42 },
  { month: "Feb", donations: 38 },
  { month: "Mar", donations: 45 },
  { month: "Apr", donations: 50 },
  { month: "May", donations: 55 },
  { month: "Jun", donations: 48 },
  { month: "Jul", donations: 52 },
];

// Blood requests data
const bloodRequests = [
  {
    id: "REQ-001",
    bloodGroup: "O-",
    quantity: 2,
    priority: "High",
    department: "Emergency",
    requester: "Dr. Sarah Johnson",
    status: "Pending"
  },
  {
    id: "REQ-002",
    bloodGroup: "A+",
    quantity: 1,
    priority: "Medium",
    department: "Surgery",
    requester: "Dr. Michael Brown",
    status: "Fulfilled"
  },
  {
    id: "REQ-003",
    bloodGroup: "B+",
    quantity: 3,
    priority: "High",
    department: "ICU",
    requester: "Dr. Jessica Martinez",
    status: "Pending"
  },
  {
    id: "REQ-004",
    bloodGroup: "AB+",
    quantity: 1,
    priority: "Low",
    department: "General Ward",
    requester: "Dr. David Lee",
    status: "Fulfilled"
  }
];

