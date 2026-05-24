// Import necessary Firestore functions from the Firebase SDK
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, writeBatch, query, orderBy } from 'firebase/firestore';
// Import the database and authentication instances from the local firebase service
import { db, auth } from './firebase';

// Helper function to get the reference to the current user's ideas collection
const getIdeasCollection = () => {
// Get the current authenticated user's ID
  const userId = auth.currentUser?.uid;
// Check if the user ID exists
  if (!userId) {
// Throw an error if the user is not authenticated
    throw new Error("User must be authenticated to access ideas.");
// Close the if statement
  }
// Return a reference to the specific user's ideas subcollection
  return collection(db, `users/${userId}/ideas`);
// Close the getIdeasCollection function
};

// Export an async function to get all ideas from Firestore
export const getIdeas = async () => {
// Create a query to get ideas ordered by the 'order' field in ascending order
  const q = query(getIdeasCollection(), orderBy('order', 'asc'));
// Execute the query to get a snapshot of the documents
  const querySnapshot = await getDocs(q);
// Initialize an empty array to store the fetched ideas
  const ideas = [];
// Iterate over each document in the snapshot
  querySnapshot.forEach((document) => {
// Push the document data along with its ID into the ideas array
    ideas.push({ id: document.id, ...document.data() });
// Close the forEach loop
  });
// Return the array of ideas
  return ideas;
// Close the getIdeas function
};

// Export an async function to create a new idea in Firestore
export const createIdea = async (idea) => {
// Fetch current ideas to determine the minimum order for placing the new idea at the top
  const currentIdeas = await getIdeas();
// Calculate the minimum order, defaulting to 0 if there are no ideas
  const minOrder = currentIdeas.length > 0 ? Math.min(...currentIdeas.map(i => i.order || 0)) : 0;
  
// Prepare the new idea data object
  const newIdeaData = {
// Spread the existing idea properties
    ...idea,
// Set the order to be one less than the minimum order
    order: minOrder - 1,
// Set archived status to false by default
    archived: false,
// Generate a current timestamp ISO string
    createdAt: new Date().toISOString()
// Close the newIdeaData object
  };
  
// Add the new document to the user's ideas collection
  const docRef = await addDoc(getIdeasCollection(), newIdeaData);
// Return the newly created idea including its assigned Firestore ID
  return { id: docRef.id, ...newIdeaData };
// Close the createIdea function
};

// Export an async function to update an existing idea in Firestore
export const updateIdea = async (id, updatedFields) => {
// Get the current authenticated user's ID
  const userId = auth.currentUser?.uid;
// Create a reference to the specific document to be updated
  const docRef = doc(db, `users/${userId}/ideas`, id);
// Update the document with the provided fields
  await updateDoc(docRef, updatedFields);
// Return the updated fields merged with the ID
  return { id, ...updatedFields };
// Close the updateIdea function
};

// Export an async function to update the order of multiple ideas in Firestore
export const updateIdeaOrder = async (orderedIds) => {
// Get the current authenticated user's ID
  const userId = auth.currentUser?.uid;
// Initialize a Firestore write batch
  const batch = writeBatch(db);
  
// Iterate over the array of ordered IDs
  orderedIds.forEach((id, index) => {
// Create a reference for each specific document
    const docRef = doc(db, `users/${userId}/ideas`, id);
// Add an update operation to the batch to set the new order index
    batch.update(docRef, { order: index });
// Close the forEach loop
  });
  
// Commit all batched operations to Firestore simultaneously
  await batch.commit();
// Return the updated list of ideas by re-fetching them
  return getIdeas();
// Close the updateIdeaOrder function
};

// Export an async function to delete an idea from Firestore
export const deleteIdea = async (id) => {
// Get the current authenticated user's ID
  const userId = auth.currentUser?.uid;
// Create a reference to the specific document to be deleted
  const docRef = doc(db, `users/${userId}/ideas`, id);
// Delete the document from Firestore
  await deleteDoc(docRef);
// Return a success response object
  return { success: true };
// Close the deleteIdea function
};
