import { Events } from './events';

class SpydrEmotionalCore {
  constructor(simMaterial, renderMaterial) {
    // Store references to materials to update uniforms
    this.simMaterial = simMaterial;
    this.renderMaterial = renderMaterial;
    
    // Current and target parameter values
    this.current = {
      pointSize: renderMaterial.uniforms.uPointSize.value || 1.2,
      speed: simMaterial.uniforms.uSpeed.value || 0.3,
      curlFreq: simMaterial.uniforms.uCurlFreq.value || 0.25,
      opacity: renderMaterial.uniforms.uOpacity.value || 0.35
    };
    
    this.target = { ...this.current };
    this.initial = { ...this.current }; // Starting point for transitions
    
    // Transition settings
    this.transitionDuration = 10.0; // seconds
    this.transitionTime = 0;
    this.transitioning = false;
    this.currentEmotion = 'neutral';
    
    // Idle behavior settings
    this.idleTime = 0;
    this.idleThreshold = 300; // 5 minutes
    this.breatheCycle = 0;
    
    // Initialize emotion mappings
    this.initEmotionMappings();
    
    // Add event listeners
    this.addEvents();
    
    console.log('SpydrEmotionalCore initialized with parameters:', this.current);
  }
  
  // Define emotional states and their visual parameters
  initEmotionMappings() {
    this.emotions = {
      neutral: { 
        pointSize: 1.2, 
        speed: 0.3, 
        curlFreq: 0.25, 
        opacity: 0.35
      },
      happy: { 
        pointSize: 1.8, 
        speed: 0.7, 
        curlFreq: 0.4, 
        opacity: 0.6
      },
      sad: { 
        pointSize: 1.0, 
        speed: 0.15, 
        curlFreq: 0.1, 
        opacity: 0.3
      },
      angry: { 
        pointSize: 2.2, 
        speed: 0.9, 
        curlFreq: 0.55, 
        opacity: 0.8
      },
      calm: { 
        pointSize: 1.3, 
        speed: 0.2, 
        curlFreq: 0.15, 
        opacity: 0.4
      },
      excited: { 
        pointSize: 2.0, 
        speed: 0.8, 
        curlFreq: 0.45, 
        opacity: 0.7
      },
      fearful: { 
        pointSize: 1.7, 
        speed: 0.6, 
        curlFreq: 0.35, 
        opacity: 0.5
      },
      surprised: { 
        pointSize: 2.5, 
        speed: 0.75, 
        curlFreq: 0.5, 
        opacity: 0.7
      },
      confused: {
        pointSize: 1.8,
        speed: 0.4,
        curlFreq: 0.6,
        opacity: 0.5
      },
      loving: {
        pointSize: 1.7,
        speed: 0.35,
        curlFreq: 0.25,
        opacity: 0.6
      },
      focused: {
        pointSize: 1.4,
        speed: 0.25,
        curlFreq: 0.2,
        opacity: 0.5
      }
    };
    
    // Emotion word mappings for better matching
    this.emotionWords = {
      happy: ['happy', 'joy', 'joyful', 'cheerful', 'delighted', 'pleased', 'content'],
      sad: ['sad', 'unhappy', 'depressed', 'down', 'blue', 'gloomy', 'somber'],
      angry: ['angry', 'mad', 'furious', 'enraged', 'irate', 'hostile', 'irritated'],
      calm: ['calm', 'peaceful', 'relaxed', 'mellow', 'composed', 'collected', 'tranquil'],
      excited: ['excited', 'eager', 'enthusiastic', 'animated', 'spirited', 'energetic'],
      fearful: ['fearful', 'afraid', 'scared', 'frightened', 'terrified', 'anxious', 'worried'],
      surprised: ['surprised', 'shocked', 'astonished', 'amazed', 'startled'],
      confused: ['confused', 'perplexed', 'puzzled', 'bewildered', 'disoriented'],
      loving: ['loving', 'affectionate', 'caring', 'tender', 'fond', 'warm'],
      focused: ['focused', 'concentrated', 'attentive', 'determined', 'resolute']
    };
  }
  
  // Add event listeners
  addEvents() {
    Events.on('tick', this.update.bind(this));
  }
  
  // Set the emotional state with optional intensity
  setEmotion(emotion, intensity = 1.0) {
    // Find the closest matching emotion
    const emotionKey = this.findClosestEmotion(emotion);
    const emotionParams = this.emotions[emotionKey] || this.emotions.neutral;
    
    console.log(`Transitioning to emotion: ${emotionKey} with intensity ${intensity}`);
    
    // Store initial values for transition
    this.initial = { ...this.current };
    
    // Calculate target values based on intensity
    const neutral = this.emotions.neutral;
    this.target = {
      pointSize: neutral.pointSize + (emotionParams.pointSize - neutral.pointSize) * intensity,
      speed: neutral.speed + (emotionParams.speed - neutral.speed) * intensity,
      curlFreq: neutral.curlFreq + (emotionParams.curlFreq - neutral.curlFreq) * intensity,
      opacity: neutral.opacity + (emotionParams.opacity - neutral.opacity) * intensity
    };
    
    // Reset transition timer and mark as transitioning
    this.transitionTime = 0;
    this.transitioning = true;
    this.idleTime = 0;
    this.currentEmotion = emotionKey;
    
    return this; // Enable chaining
  }
  
  // Match input emotion string to defined emotions
  findClosestEmotion(input) {
    if (!input) return 'neutral';
    
    const emotionText = input.toLowerCase().trim();
    
    // Direct match
    if (this.emotions[emotionText]) return emotionText;
    
    // Word similarity matching
    for (const [emotion, words] of Object.entries(this.emotionWords)) {
      if (words.some(word => emotionText.includes(word))) {
        return emotion;
      }
    }
    
    // Default to neutral if no match found
    return 'neutral';
  }
  
  // Update function to be called in animation loop
  update(time) {
    const dt = time ? time.delta / 1000 : 0.016; // Convert to seconds or use default
    
    if (this.transitioning) {
      // Progress the transition
      this.transitionTime += dt;
      const progress = Math.min(this.transitionTime / this.transitionDuration, 1.0);
      
      // Use cubic ease-in-out for smoother transition
      const easedProgress = this.easeInOutCubic(progress);
      
      // Interpolate between initial and target values
      this.current.pointSize = this.lerp(this.initial.pointSize, this.target.pointSize, easedProgress);
      this.current.speed = this.lerp(this.initial.speed, this.target.speed, easedProgress);
      this.current.curlFreq = this.lerp(this.initial.curlFreq, this.target.curlFreq, easedProgress);
      this.current.opacity = this.lerp(this.initial.opacity, this.target.opacity, easedProgress);
      
      // Mark transition as complete when done
      if (progress >= 1.0) {
        this.transitioning = false;
      }
    } else {
      // Update idle timer when not transitioning
      this.idleTime += dt;
      
      // Add breathing effect when idle
      if (this.idleTime > 5) { // Start breathing after 5 seconds of idle
        this.applyBreathingEffect(dt);
      }
      
      // Return to neutral after extended idle time
      if (this.idleTime >= this.idleThreshold) {
        this.setEmotion('neutral', 0.7); // Gentle return to a slightly subdued neutral
      }
    }
    
    // Apply current values to the materials
    this.applyToMaterials();
  }
  
  // Apply subtle breathing effect during idle periods
  applyBreathingEffect(dt) {
    this.breatheCycle += dt * 0.5; // Slow breathing cycle
    
    // Create sinusoidal breathing pattern
    const breatheFactor = Math.sin(this.breatheCycle) * 0.05; // 5% variation
    
    // Apply subtle variations to material uniforms directly
    this.renderMaterial.uniforms.uPointSize.value = this.current.pointSize * (1 + breatheFactor);
    this.renderMaterial.uniforms.uOpacity.value = this.current.opacity * (1 + breatheFactor * 0.8);
    this.simMaterial.uniforms.uSpeed.value = this.current.speed * (1 + breatheFactor * 0.3);
    // curlFreq stays constant for more stability
  }
  
  // Apply current parameters to shader uniforms
  applyToMaterials() {
    // Only update if materials are valid
    if (this.renderMaterial && this.simMaterial) {
      this.renderMaterial.uniforms.uPointSize.value = this.current.pointSize;
      this.simMaterial.uniforms.uSpeed.value = this.current.speed;
      this.simMaterial.uniforms.uCurlFreq.value = this.current.curlFreq;
      this.renderMaterial.uniforms.uOpacity.value = this.current.opacity;
    }
  }
  
  // Easing function for smoother transitions
  easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  
  // Simple linear interpolation
  lerp(a, b, t) {
    return a + (b - a) * t;
  }
  
  // Get current emotion
  getCurrentEmotion() {
    return {
      name: this.currentEmotion,
      parameters: { ...this.current },
      transitioning: this.transitioning,
      progress: this.transitioning ? this.transitionTime / this.transitionDuration : 1.0
    };
  }
  
  // Reset to neutral state
  reset() {
    this.setEmotion('neutral', 1.0);
  }
}

export default SpydrEmotionalCore;