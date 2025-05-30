const admin = require("firebase-admin");
const serviceAccount = require("./hospital-f5f91-firebase-adminsdk-fbsvc-19fbfb9881.json");

admin.initializeApp({
  credential: admin.credential.cert(
    {
      "type": "service_account",
      "project_id": "hospital-f5f91",
      "private_key_id": "62befd180c2b425178ec716386e799c0a19cdc56",
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC24Y4xDUJz1bkY\nmVd2jbtxZLF6ArKq7ErOAs5auegJnqIqY7pxxXSnlkvATWvbRNlMb22aEW+uZ1jb\nZWmJSUG/pF0Toz6l6hdW3hNvxM+oCxAuCycVwri7tJbOQqytYR+1mov2Z8YoUgQi\n3Tjh1QqKzwb0yh/E2/ucnKaefdP4IHWc6uSgQBTZJ+muiFBmAIh/CqE5/OqN4vnV\n6mP3HIkHgjEp1DOE9sqqPJfTkXNgedH3dgzP0mGTY+TTOW/+WOc2ntmeYCzULLzE\nWRL0HFYTpVSmZhleD5Onbe3/uuddgdbwNlsZAfiYBef4hojvEK7YIjJZhqSQw/XS\n72oncc3JAgMBAAECggEAKRLJe6zNsvRaSPMPmLnGUnZaAdwfQpIlTtWEgQ3l1ltB\ncqHJWwoM5CK2Sq9YvPtejnMsO4EVAyeE5mmFZWcFlEQW/3UXee30ZfckiGK8fLJX\nZO/uTE3abZXmlNaWr63zkDbwnlu6Po4FDct/ngDaCEjs+Ad5UR5TCV6JcWkzNTO7\nq79Pr+BuM3KnaRHdUHD7aJ9mEGZfNq3Q03AsgMIHkTW0EGjaprZ3Cg9kF5F1PojY\nFEzbpeWe2Ue1RT31gbw3QvwekUqCDGycTT4DvUO5OevTc7w4oR8YNNrueEQVmR+Z\n/X12HH0Tw35z+wto5/4zkgFaJzV8vgehSogVT7rgMQKBgQDnmI3ftgqC4go1uTBH\n4pyi0HZ5Gom4bBlGSjsWOrmhW6VbrKpSY660Si9SOMTI/IMNbpNh6Rc2gvqABwkt\nfGWMg1HJshPLIDPx4TCs1T+VZl0W0gvtR83eYl79JO9pYdUrR7u3N/FUTcVbisTk\nSywJtfHeZoYY48a6Z+8k0QNIBQKBgQDKJuNDpXRoarEN+COoZaTX5YZjKA06+98s\nGx7gok5FlitkGveP2FXiSv/cEVq/gU2zuyaagSMO1nwrBUi3ztAVF5jL/4zvyI2X\nCvspT8MOLxlK7wVF7Rxgy5qvDjKLgsaePzY+EH20pX1GXPdD2BGYRuNl8NEicTRp\nslI1pyEt9QKBgDrOaM/ySG79eHw1vsWyC/Xnmv2bOHcks7I+bQxy8um+/Jjvmfv7\npcPPxn5JPeaO/7PsbO4CostLrNHPd4weNybbvWvKlO4SCj6T4KkyKMgFywNdaHvi\nrKqYLeh3dXc7yUYJG+glA1lVuhRJgz84u0Dn+zdurwQo6jAw7e9aR0wFAoGASp8Q\nRWhOED1SHlX6066xqwCPGwst1xgiyaU5QLKpMga8/bb2q6KwEVieGh5N4WNZy37K\nQT5qMo/6RectcKxnI2IShTtQSzM9EQR8skM/PX0lWQPibm2YjCKcdwJGpjkgGEo9\nO6vau1Rbah3nKKQZ2pxQVNEQYiZnspygvC11kgECgYEAg/+DN5LXNaNTW32SA7JN\nm/p7eolrJzYgTMA8BfEwXecpQIjsJuCLaLpnVHAcutsowUKwh+2dQ6qCN67vcQRM\nV5cla9SYVzQ+ey7nyMQIFI4PFyjKJ5eg9lXW2/f5N3oodDdm1EYQv5U3Kq1m/sZ9\nh8ccyd8cdv8Vd1u0TTm/lFI=\n-----END PRIVATE KEY-----\n",
      "client_email": "firebase-adminsdk-fbsvc@hospital-f5f91.iam.gserviceaccount.com",
      "client_id": "107743907744316709442",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40hospital-f5f91.iam.gserviceaccount.com",
      "universe_domain": "googleapis.com"
    }
  )
});

console.log("Firebase Admin SDK initialized successfully:");
console.log("Client Email:", serviceAccount.client_email);
console.log("Private Key:", serviceAccount.private_key.substring(0, 20) + "..."); // truncate private key for security

const db = admin.firestore();

async function seedFirestore() {
  // 1. Patients
  await db.collection("patients").add({
    name: "XYZ",
    issues: ["A", "B", "C", "D"],
    type: "IPD",
    date: admin.firestore.Timestamp.fromDate(new Date("2025-04-02")),
    ipd_no: "001",
    doctor: "Dr. PQR",
    staff: ["Nurse 1", "Nurse 2"],
    medicines: ["Med1", "Med2"]
  });

  // 2. Doctors
  await db.collection("doctors").add({
    name: "XYZ",
    speciality: ["A", "B", "C", "D"],
    timings: "Morning",
    room_no: "001",
    available: true
  });

  // 3. Supply Inventory
  await db.collection("supply_inventory").add({
    name: "ABC",
    type: "Perishable",
    delivery_date: admin.firestore.Timestamp.fromDate(new Date("2025-04-02")),
    expiry_date: admin.firestore.Timestamp.fromDate(new Date("2026-05-02")),
    expired: false
  });

  // 4. Blood Inventory
  await db.collection("blood_inventory").add({
    blood_group: "A+",
    type: "Perishable",
    delivery_date: admin.firestore.Timestamp.fromDate(new Date("2025-04-02")),
    expiry_date: admin.firestore.Timestamp.fromDate(new Date("2026-05-02")),
    expired: false
  });

  // 5. Robot Status
  await db.collection("robot_status").add({
    name: "Robot A",
    status: "Running",
    battery: 30,
    location: "Room 001",
    lastUpdated: admin.firestore.Timestamp.fromDate(new Date()),
    supplies: ["Med1", "Med2"],
    type: "Delivery",
    taskCompletion: 90,
    time: admin.firestore.Timestamp.fromDate(new Date("2025-04-02T12:00:00"))
  });

  console.log("All documents added successfully!");
}

seedFirestore().catch(console.error);