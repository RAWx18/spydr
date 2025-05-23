import gl from './gl';

// Example function to process AI prompts and set emotions
function handleAIPrompt(prompt, sentiment) {
  // Simple sentiment-to-emotion mapping (expand as needed)
  let emotion = 'neutral';
  let intensity = 1.0;
  
  if (sentiment.includes('happy')) {
    emotion = 'happy';
    intensity = 0.8;
  } else if (sentiment.includes('angry')) {
    emotion = 'angry';
    intensity = 0.9;
  }
  // Add more mappings as needed
  
  // Set the emotion in the GL system
  gl.setEmotion(emotion, intensity);
  
  console.log(`Setting emotion: ${emotion} with intensity ${intensity}`);
}

// Example usage (you would replace this with your actual AI prompt handling)
window.setSpydrEmotion = function(emotion, intensity = 1.0) {
  gl.setEmotion(emotion, intensity);
  console.log(`Manual emotion set: ${emotion} with intensity ${intensity}`);
};

// You can expose this function globally for testing
window.handleAIPrompt = handleAIPrompt;

// Example: setTimeout(() => handleAIPrompt("I'm excited!", "happy"), 2000);