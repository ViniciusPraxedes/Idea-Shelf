// Define a delay function to simulate network latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Define a local storage key used for data, updated to v5 for archiving
const STORAGE_KEY = 'idea_shelf_data_v5';

// Check if there is no data in local storage
if (!localStorage.getItem(STORAGE_KEY)) {
// Create a helper function to seed data
  const createMockIdea = (id, title, description, tags = [], archived = false) => {
// Return the structured idea object
    return {
// Assign the provided id
      id,
// Assign the provided title
      title,
// Assign the provided description
      description,
// Assign a default blue color
      color: '#3b82f6',
// Assign a default lightbulb emoji
      emoji: '💡',
// Assign the provided tags
      tags,
// Assign order based on id for initial sorting
      order: parseInt(id, 10),
// Assign the archived status
      archived,
// Generate the creation timestamp
      createdAt: new Date().toISOString()
// Close the idea object return
    };
// Close the helper function
  };

// Define the initial data array
  const initialData = [
// Create the Instagram idea
    createMockIdea("1", "Automated Instagram Art Video Poster", "<p>Instagram account that posts animated videos from art. Everything <strong>automated</strong></p>", ["social", "automation", "art"]),
// Create the Punctuation idea
    createMockIdea("2", "Punctuation App", "<p>An app that teaches the user how to better write and use punctuation.</p>", ["education", "writing"]),
// Create the Musical Note idea
    createMockIdea("3", "Musical Note Guesser", "<p>An app that makes a sound and the user have to guess what note it is. It uses musical symbols.</p>", ["music", "game", "education"]),
// Create the Picture Border idea
    createMockIdea("4", "Picture Border App", "<p>An app that adds white border to pictures</p>", ["utility", "image-processing"]),
// Create the Gemini Account idea
    createMockIdea("5", "Gemini Account Tracker", "<p>An App to keep track of my gemini accounts and quota left</p>", ["utility", "tracking"]),
// Create the Discord Bot idea
    createMockIdea("6", "Discord Bot", "<p>Discord Bot</p>", ["bot", "social"], true),
// Create the Xbox Stats idea
    createMockIdea("7", "Xbox Stats Checker", "<p>App to check xbox stats</p>", ["gaming", "tracking"]),
// Create the Idea Organizer idea
    createMockIdea("8", "Idea Organizer", "<p>App to organize my ideas</p>", ["productivity", "app"]),
// Create the Food Price idea
    createMockIdea("9", "Food Price Tracker", "<p>An app to check food prices, it checks if the food prices are going up or down</p>", ["finance", "tracking", "food"]),
// Create the Video Downloader idea
    createMockIdea("10", "Video Downloader App", "<p>An application for downloading videos.</p>", ["utility", "media"]),
// Create the File Converter idea
    createMockIdea("11", "File Converter App", "<p>An application for converting files.</p>", ["utility"]),
// Create the Recipe Tracker idea
    createMockIdea("12", "Recipe Tracker App", "<p>An application for tracking and organizing recipes.</p>", ["food", "tracking", "lifestyle"], true),
// Create the Art Recognition idea
    createMockIdea("13", "Art Recognition App", "<p>An app that uses machine learning to recognize art pieces. The user can take a picture of art at a museum, and the AI recognizes the piece, saving the picture along with a description to the user's folder in the app.</p>", ["ai", "art", "education"]),
// Create the AI Chatbot idea
    createMockIdea("14", "Stretch's AI Chatbot", "<p>A proposal to leverage Stretch's AI chatbot. The team would only need to purchase one Pro license to use data for training the chatbot.</p>", ["ai", "business"]),
// Create the Learning Journey idea
    createMockIdea("15", "Learning Journey Bot", "<p>A bot that fetches information from a learning journey source.</p>", ["bot", "education"]),
// Create the Database Connector idea
    createMockIdea("16", "S4 Database Connector App", "<p>An app that connects to S4 and fetches all data from the database.</p>", ["backend", "database"], true),
// Create the Fiori Development idea
    createMockIdea("17", "Fiori Development Prompt", "<p>A prompt that sets up Antigravity for Fiori development.</p>", ["development", "prompt"])
// Close the initial data array
  ];
// Save the populated array as the initial data
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
}

// Export a function to get all ideas
export const getIdeas = async () => {
// Simulate network latency
  await delay(300);
// Parse the JSON data from local storage or return an empty array
  const ideas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
// Return the ideas sorted by order
  return ideas.sort((a, b) => a.order - b.order);
// Close the getIdeas function
};

// Export a function to create a new idea
export const createIdea = async (idea) => {
  // Simulate network latency
  await delay(300);
  // Parse the current ideas from local storage
  const ideas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  // Find the minimum current order to place the new idea at the top
  const minOrder = ideas.length > 0 ? Math.min(...ideas.map(i => i.order || 0)) : 0;
  // Create a new idea object with a unique ID, createdAt timestamp, order decremented from minimum, and default archived false
  const newIdea = { ...idea, id: Date.now().toString(), order: minOrder - 1, archived: false, createdAt: new Date().toISOString() };
  // Add the new idea to the array
  ideas.push(newIdea);
  // Save the updated array back to local storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
  // Return the newly created idea
  return newIdea;
  // Close the createIdea function
};

// Export a function to update an existing idea
export const updateIdea = async (id, updatedFields) => {
// Simulate network latency
  await delay(300);
// Parse the current ideas from local storage
  const ideas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
// Find the index of the idea to update
  const index = ideas.findIndex(idea => idea.id === id);
// If the idea exists
  if (index !== -1) {
// Update the idea with the new fields
    ideas[index] = { ...ideas[index], ...updatedFields };
// Save the updated array back to local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
// Return the updated idea
    return ideas[index];
// Close the if block
  }
// Throw an error if the idea was not found
  throw new Error('Idea not found');
// Close the updateIdea function
};

// Export a function to update the order of ideas
export const updateIdeaOrder = async (orderedIds) => {
// Simulate network latency (faster for reordering)
  await delay(100);
// Parse the current ideas from local storage
  const ideas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
// Map over ideas to update their order based on the new array of IDs
  const reorderedIdeas = ideas.map(idea => {
// Find the index of the idea in the new ordered array
    const newOrder = orderedIds.indexOf(idea.id);
// Update the order if found, otherwise keep it at the end
    return { ...idea, order: newOrder !== -1 ? newOrder : idea.order };
// Close the map function
  });
// Save the updated array back to local storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reorderedIdeas));
// Return the reordered ideas
  return reorderedIdeas.sort((a, b) => a.order - b.order);
// Close the updateIdeaOrder function
};

// Export a function to delete an idea
export const deleteIdea = async (id) => {
// Simulate network latency
  await delay(300);
// Parse the current ideas from local storage
  let ideas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
// Filter out the idea to be deleted
  ideas = ideas.filter(idea => idea.id !== id);
// Save the updated array back to local storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
// Return a success message
  return { success: true };
// Close the deleteIdea function
};
