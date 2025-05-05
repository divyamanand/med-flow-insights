import { 
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';

// Get all documents from a collection
export const getCollection = async (collectionName: string) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Get a single document by ID
export const getDocument = async (collectionName: string, docId: string) => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data()
    };
  }
  return null;
};

// Add a new document
export const addDocument = async (collectionName: string, data: DocumentData) => {
  const docRef = await addDoc(collection(db, collectionName), data);
  return docRef.id;
};

// Update a document
export const updateDocument = async (collectionName: string, docId: string, data: DocumentData) => {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, data);
};

// Delete a document
export const deleteDocument = async (collectionName: string, docId: string) => {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
};

// Query documents with a condition
export const queryDocuments = async (collectionName: string, field: string, operator: any, value: any) => {
  const q = query(collection(db, collectionName), where(field, operator, value));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}; 