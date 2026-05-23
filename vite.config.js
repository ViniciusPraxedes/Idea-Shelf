// Import the defineConfig utility function from Vite
import { defineConfig } from 'vite'
// Import the Vite React plugin from the package
import react from '@vitejs/plugin-react'

// Define the configuration options for the Vite project
export default defineConfig({
  // Configure the active plugins array
  plugins: [
    // Enable the React plugin
    react()
    // Close the plugins array
  ],
  // Configure the preview server properties for production hosting compatibility
  preview: {
    // Parse the port number from environment variables or default to 8080
    port: parseInt(process.env.PORT || '8080', 10),
    // Bind to all available network host interfaces (0.0.0.0)
    host: true
    // Close the preview server properties object
  }
  // Close the defineConfig configuration object
})
