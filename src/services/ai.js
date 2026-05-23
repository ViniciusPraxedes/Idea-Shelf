// Export an asynchronous function that takes title, tags, and current description
export const explainIdea = async (title, tags, currentDescription) => {
  // Retrieve the API key from environment variables
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  // Check if the API key is not present
  if (!apiKey) {
    // Throw a descriptive error indicating the API key is missing
    throw new Error('API key is missing. Please add VITE_GEMINI_API_KEY to your .env file.');
    // Close the if statement
  }
  // Construct the API endpoint URL with the key as a query parameter
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  // Formulate the prompt for the Gemini AI model to reformulate the user's description
  const prompt = [
    // Instruct the model to act as an assistant
    'You are an AI assistant helping a creator refine their project idea description.',
    // Tell the model to rewrite to make it clearer and more professional
    'Please rewrite the following project description to make it clearer, more professional, and better structured.',
    // Direct it to use only clean HTML markup
    'Use ONLY clean HTML markup: <p>, <strong>, <ul>, and <li> tags.',
    // Warn it against using markdown or code blocks
    'Do NOT use markdown, code blocks (such as ```html), or raw markdown formatting.',
    // Direct it to keep it focused and of reasonable length
    'Keep the explanation focused and of reasonable length, directly improving and expanding on the user\'s input.',
    // Provide the project title
    `Project Title: ${title}`,
    // Provide the project tags
    `Project Tags: ${tags}`,
    // Provide the current description
    `User Inputted Description: ${currentDescription}`
    // Join the array elements with newline characters to form the final prompt string
  ].join('\n');
  // Construct the payload matching the Gemini API schema
  const payload = {
    // Define the contents array containing the prompt
    contents: [
      // Define the single content object
      {
        // Define the parts array with the prompt text
        parts: [
          // Define the text parts object
          {
            // Set the text property to the prompt string
            text: prompt
            // Close the text parts object
          }
          // Close the parts array
        ]
        // Close the content object
      }
      // Close the contents array
    ]
    // Close the payload object
  };
  // Perform the HTTP POST request to the API
  const response = await fetch(url, {
    // Set the HTTP request method to POST
    method: 'POST',
    // Define headers indicating JSON content type
    headers: {
      // Set the content-type header to application/json
      'Content-Type': 'application/json'
      // Close the headers object
    },
    // Convert the payload to a JSON string representation
    body: JSON.stringify(payload)
    // Close the fetch parameters object
  });
  // Check if the response status is not OK
  if (!response.ok) {
    // Read the error message text from the response body
    const errorText = await response.text();
    // Throw a detailed error with the HTTP status and description
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    // Close the if statement
  }
  // Parse the response body as JSON
  const data = await response.json();
  // Extract the generated text from the JSON structure
  const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  // Check if generated text was found in the response
  if (!generatedText) {
    // Throw an error if the model returned an empty or invalid response
    throw new Error('No content returned from Gemini.');
    // Close the if statement
  }
  // Return the refined explanation text
  return generatedText;
  // Close the explainIdea function
};
