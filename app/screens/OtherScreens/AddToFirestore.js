import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../../../firebaseConfig'; // Adjust the path to your firebaseConfig file

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleTutors = [
  {
    name: 'Akong John',
    image: 'https://img.freepik.com/free-photo/young-successful-african-businessman-posing-dark_176420-4970.jpg?t=st=1723280947~exp=1723284547~hmac=ed4ec68d81c32d80afc528d01a61e16691a948dd812780977aef3e78077ffae8&w=740',
    subjects: ['Mathematics', 'Physics'],
    level: 'Alevel',
    verified: true,
  },
  {
    name: 'Jane Smith',
    image: 'https://img.freepik.com/free-photo/black-woman-standing-autumn-city_1157-18895.jpg?t=st=1723281567~exp=1723285167~hmac=2316d77c4dfe9e00c59934f72045cc168ced513130e7496a4f7dbf721a66a39e&w=740',
    subjects: ['Biology', 'Chemistry'],
    level: 'Olevel',
    verified: false,
  },
  {
    name: 'Alex Johnson',
    image: 'https://img.freepik.com/free-photo/portrait-black-young-man-wearing-african-traditional-red-colorful-clothes_627829-4909.jpg?t=st=1723281517~exp=1723285117~hmac=6d6d8984cb55c6022c3e202901eaeed444ec8265712f9c8d3fa2af70c49c79a1&w=740',
    subjects: ['English', 'History'],
    level: 'Alevel | Olevel',
    verified: true,
  },
  // Add more sample tutors as needed
];

const addSampleTutors = async () => {
  try {
    for (const tutor of sampleTutors) {
      await addDoc(collection(db, 'tutors'), tutor);
    }
    console.log('Sample tutors added successfully!');
  } catch (error) {
    console.error('Error adding sample tutors:', error);
  }
};

addSampleTutors();