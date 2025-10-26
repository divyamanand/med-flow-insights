
import { 
  collection, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  where,
  Timestamp
} from "firebase/firestore";
import { db } from "./firebase";

// Collection names
const COLLECTIONS = {
  PATIENTS: "patient",
  DOCTORS: "doctor",
  SUPPLIES: "supply",
  BLOOD: "blood_inventory",
  ROBOTS: "robot",
  MEDICINE: "medicine",
  DONATION_STATES: "donation_states",
  DONOR_AGE_DATA: "donarAgeData",
  MONTHLY_DONATIONS: "monthlyDonations",
  BLOOD_REQUESTS: "bloodRequests"
};

// Generic Firestore operations
export const getCollection = async (collectionName) => {
  const collectionRef = collection(db, collectionName);
  const snapshot = await getDocs(collectionRef);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
};

export const getDocument = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return {
      id: snapshot.id,
      ...snapshot.data()
    };
  }
  return null;
};



export const addDocument = async (collectionName, data) => {
  const collectionRef = collection(db, collectionName);
  return await addDoc(collectionRef, data);
};

export const updateDocument = async (collectionName, docId, data) => {
  const docRef = doc(db, collectionName, docId);
  return await updateDoc(docRef, data);
};

export const deleteDocument = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  return await deleteDoc(docRef);
};

export const deleteDoctor = (docId:string) => {
  deleteDocument(COLLECTIONS.DOCTORS,docId);
}


// Domain-specific operations
export const getPatients = () => getCollection(COLLECTIONS.PATIENTS);
export const getDoctors = () => getCollection(COLLECTIONS.DOCTORS);
export const getSupplies = () => getCollection(COLLECTIONS.SUPPLIES);
export const getBloodInventory = () => getCollection(COLLECTIONS.BLOOD);
export const getRobotStatus = () => getCollection(COLLECTIONS.ROBOTS);

// Add a patient
export const addPatient = (patientData) => {
  return addDocument(COLLECTIONS.PATIENTS, {
    ...patientData,
    date: Timestamp.fromDate(new Date(patientData.date))
  });
};

// Add a doctor
export const addDoctor = (doctorData) => {
  return addDocument(COLLECTIONS.DOCTORS, doctorData);
};

// Add a supply item
export const addSupplyItem = (itemData) => {
  return addDocument(COLLECTIONS.SUPPLIES, {
    ...itemData,
    delivery_date: Timestamp.fromDate(new Date(itemData.delivery_date)),
    expiry_date: Timestamp.fromDate(new Date(itemData.expiry_date))
  });
};

// Add a blood inventory item
export const addBloodItem = (itemData) => {
  return addDocument(COLLECTIONS.BLOOD, {
    ...itemData,
    delivery_date: Timestamp.fromDate(new Date(itemData.delivery_date)),
    expiry_date: Timestamp.fromDate(new Date(itemData.expiry_date))
  });
};

// Update robot status
export const updateRobotStatus = (robotData) => {
  return addDocument(COLLECTIONS.ROBOTS, {
    ...robotData,
    time: Timestamp.fromDate(new Date())
  });
};

// Get available doctors
export const getAvailableDoctors = async () => {
  const doctorsRef = collection(db, COLLECTIONS.DOCTORS);
  const q = query(doctorsRef, where("available", "==", true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};




// Get expired supplies
export const getExpiredSupplies = async () => {
  const suppliesRef = collection(db, COLLECTIONS.SUPPLIES);
  const q = query(suppliesRef, where("expired", "==", true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
