import socket
import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
import sys
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

# Download NLTK resources (first time only)
nltk.download('vader_lexicon', quiet=True)

# Initialize sentiment analyzer
sia = SentimentIntensityAnalyzer()

def is_server_running(url):
    """Check if the server is running at the given URL"""
    try:
        response = requests.get(url, timeout=3)
        return True
    except requests.exceptions.ConnectionError:
        return False
    except Exception:
        return False

def check_port_open(host, port):
    """Check if a port is open on the given host"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(2)
    result = sock.connect_ex((host, port))
    sock.close()
    return result == 0

def analyze_sentiment(text):
    """Analyze sentiment and return appropriate emotion and intensity"""
    sentiment = sia.polarity_scores(text)
    
    # Get the dominant sentiment
    compound = sentiment['compound']
    
    # Map sentiment scores to emotions and intensity
    if compound >= 0.5:
        if 'love' in text.lower() or 'care' in text.lower():
            return 'loving', min(abs(compound) * 1.5, 1.0)
        elif 'excite' in text.lower() or 'awesome' in text.lower():
            return 'excited', min(abs(compound) * 1.5, 1.0)
        else:
            return 'happy', min(abs(compound) * 1.5, 1.0)
    elif compound <= -0.5:
        if 'angry' in text.lower() or 'furious' in text.lower() or 'mad' in text.lower():
            return 'angry', min(abs(compound) * 1.5, 1.0)
        elif 'afraid' in text.lower() or 'scared' in text.lower() or 'fear' in text.lower():
            return 'fearful', min(abs(compound) * 1.5, 1.0)
        else:
            return 'sad', min(abs(compound) * 1.5, 1.0)
    elif 'confus' in text.lower() or 'puzzle' in text.lower():
        return 'confused', 0.7
    elif 'surprise' in text.lower() or 'shock' in text.lower() or 'wow' in text.lower():
        return 'surprised', 0.8
    elif 'focus' in text.lower() or 'concentrat' in text.lower():
        return 'focused', 0.7
    elif 'calm' in text.lower() or 'peace' in text.lower() or 'relax' in text.lower():
        return 'calm', 0.7
    else:
        return 'neutral', 0.5

def setup_emotion_display(driver):
    """Inject display code into the page"""
    display_code = """
    // Create emotion display elements if they don't exist
    if (!document.getElementById('spydr-eis-header')) {
        // Import Sci-Fi Fonts
        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@500;700&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
        
        // Create main header
        const header = document.createElement('div');
        header.id = 'spydr-eis-header';
        header.textContent = 'SPYDR E.I.S. EMOTIONAL INTELLIGENCE SYSTEM';
        header.style.position = 'fixed';
        header.style.top = '15px';
        header.style.left = '0';
        header.style.width = '100%';
        header.style.textAlign = 'center';
        header.style.color = '#00ffff';
        header.style.fontFamily = 'Orbitron, sans-serif';
        header.style.fontSize = '24px';
        header.style.fontWeight = '700';
        header.style.letterSpacing = '3px';
        header.style.textShadow = '0 0 10px rgba(0, 255, 255, 0.7)';
        header.style.zIndex = '9999';
        header.style.textTransform = 'uppercase';
        document.body.appendChild(header);
        
        // Create emotion display container
        const display = document.createElement('div');
        display.id = 'emotion-display';
        display.style.position = 'fixed';
        display.style.top = '50%';
        display.style.right = '30px';
        display.style.transform = 'translateY(-50%)';
        display.style.padding = '20px 30px';
        display.style.borderRadius = '10px';
        display.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        display.style.backdropFilter = 'blur(5px)';
        display.style.color = '#00ffff';
        display.style.fontFamily = 'Rajdhani, sans-serif';
        display.style.fontSize = '20px';
        display.style.textTransform = 'uppercase';
        display.style.letterSpacing = '2px';
        display.style.zIndex = '9999';
        display.style.transition = 'all 0.5s ease';
        display.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.3)';
        display.style.border = '1px solid rgba(0, 255, 255, 0.2)';
        display.style.width = '200px';
        
        // Create emotion status header
        const statusHeader = document.createElement('div');
        statusHeader.textContent = 'CURRENT STATE';
        statusHeader.style.fontSize = '12px';
        statusHeader.style.opacity = '0.6';
        statusHeader.style.marginBottom = '10px';
        statusHeader.style.textAlign = 'center';
        statusHeader.style.fontWeight = '500';
        display.appendChild(statusHeader);
        
        // Create emotion text
        const emotionText = document.createElement('div');
        emotionText.id = 'current-emotion';
        emotionText.textContent = 'NEUTRAL';
        emotionText.style.fontWeight = '700';
        emotionText.style.fontSize = '32px';
        emotionText.style.textAlign = 'center';
        emotionText.style.margin = '10px 0';
        emotionText.style.letterSpacing = '3px';
        emotionText.style.textShadow = '0 0 10px rgba(0, 255, 255, 0.5)';
        display.appendChild(emotionText);
        
        // Create timer element
        const timerContainer = document.createElement('div');
        timerContainer.style.textAlign = 'center';
        timerContainer.style.margin = '15px 0';
        
        const timerLabel = document.createElement('div');
        timerLabel.textContent = 'NEXT CHANGE';
        timerLabel.style.fontSize = '12px';
        timerLabel.style.opacity = '0.6';
        timerLabel.style.marginBottom = '5px';
        timerContainer.appendChild(timerLabel);
        
        const timerText = document.createElement('div');
        timerText.id = 'emotion-timer';
        timerText.textContent = '5.0';
        timerText.style.fontFamily = 'Orbitron, sans-serif';
        timerText.style.fontSize = '26px';
        timerText.style.fontWeight = '700';
        timerContainer.appendChild(timerText);
        
        display.appendChild(timerContainer);
        
        // Create intensity label
        const intensityLabel = document.createElement('div');
        intensityLabel.textContent = 'INTENSITY';
        intensityLabel.style.fontSize = '12px';
        intensityLabel.style.opacity = '0.6';
        intensityLabel.style.marginTop = '10px';
        intensityLabel.style.marginBottom = '5px';
        intensityLabel.style.textAlign = 'center';
        display.appendChild(intensityLabel);
        
        // Create intensity indicator
        const intensityContainer = document.createElement('div');
        intensityContainer.style.width = '100%';
        intensityContainer.style.height = '6px';
        intensityContainer.style.backgroundColor = 'rgba(0, 255, 255, 0.1)';
        intensityContainer.style.borderRadius = '3px';
        intensityContainer.style.overflow = 'hidden';
        intensityContainer.style.margin = '0 auto';
        
        const intensityBar = document.createElement('div');
        intensityBar.id = 'intensity-bar';
        intensityBar.style.height = '100%';
        intensityBar.style.width = '50%';
        intensityBar.style.backgroundColor = '#00ffff';
        intensityBar.style.transition = 'width 0.5s ease, background-color 0.5s ease';
        intensityBar.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.7)';
        
        intensityContainer.appendChild(intensityBar);
        display.appendChild(intensityContainer);
        
        document.body.appendChild(display);
        
        // Add dots pattern to background for sci-fi effect
        const dotsPattern = document.createElement('div');
        dotsPattern.style.position = 'fixed';
        dotsPattern.style.top = '0';
        dotsPattern.style.right = '0';
        dotsPattern.style.width = '300px';
        dotsPattern.style.height = '100%';
        dotsPattern.style.backgroundImage = 'radial-gradient(circle, rgba(0, 255, 255, 0.15) 1px, transparent 1px)';
        dotsPattern.style.backgroundSize = '20px 20px';
        dotsPattern.style.pointerEvents = 'none';
        dotsPattern.style.zIndex = '1';
        dotsPattern.style.opacity = '0.5';
        document.body.appendChild(dotsPattern);
        
        // Store the last emotion to avoid unnecessary updates
        window._lastEmotion = '';
        window._lastIntensity = 0;
        window._countdownInterval = null;
        window._countdownValue = 5.0;
    }
    
    // Define the updateEmotionDisplay function globally
    window.updateEmotionDisplay = function(emotion, intensity, timerDuration) {
        const display = document.getElementById('emotion-display');
        const emotionText = document.getElementById('current-emotion');
        const intensityBar = document.getElementById('intensity-bar');
        const timerText = document.getElementById('emotion-timer');
        
        // Use provided timer duration or default to 5.0
        const duration = timerDuration || 5.0;
        
        // Only update if changed
        if (window._lastEmotion !== emotion || window._lastIntensity !== intensity) {
            // Update emotion text
            emotionText.textContent = emotion.toUpperCase();
            
            // Update intensity bar
            intensityBar.style.width = `${intensity * 100}%`;
            
            // Color coding based on emotion
            let color;
            switch(emotion.toLowerCase()) {
                case 'happy': color = '#FFD700'; break;      // Gold
                case 'sad': color = '#1E90FF'; break;        // Dodger Blue
                case 'angry': color = '#FF4500'; break;      // Red-Orange
                case 'calm': color = '#00CED1'; break;       // Dark Turquoise
                case 'excited': color = '#FF69B4'; break;    // Hot Pink
                case 'fearful': color = '#9932CC'; break;    // Dark Orchid
                case 'surprised': color = '#00FF7F'; break;  // Spring Green
                case 'confused': color = '#DDA0DD'; break;   // Plum
                case 'loving': color = '#FF1493'; break;     // Deep Pink
                case 'focused': color = '#4169E1'; break;    // Royal Blue
                default: color = '#00FFFF'; break;           // Cyan (neutral)
            }
            
            // Apply color to elements
            emotionText.style.color = color;
            emotionText.style.textShadow = `0 0 10px ${color}80`;
            intensityBar.style.backgroundColor = color;
            intensityBar.style.boxShadow = `0 0 10px ${color}80`;
            display.style.borderColor = `${color}40`;
            
            // Add animation effect
            display.style.transform = 'translateY(-50%) scale(1.05)';
            setTimeout(() => {
                display.style.transform = 'translateY(-50%) scale(1)';
            }, 200);
            
            // Reset and start countdown with custom duration
            clearInterval(window._countdownInterval);
            window._countdownValue = duration;
            timerText.textContent = window._countdownValue.toFixed(1);
            
            window._countdownInterval = setInterval(function() {
                window._countdownValue -= 0.1;
                if (window._countdownValue <= 0) {
                    window._countdownValue = 0;
                    clearInterval(window._countdownInterval);
                }
                timerText.textContent = Math.max(0, window._countdownValue).toFixed(1);
                
                // Make timer pulse as it gets closer to 0
                if (window._countdownValue < 1.0) {
                    timerText.style.color = '#FF3333';
                    timerText.style.textShadow = '0 0 10px rgba(255, 51, 51, 0.7)';
                } else {
                    timerText.style.color = '';
                    timerText.style.textShadow = '';
                }
            }, 100);
            
            // Store values
            window._lastEmotion = emotion;
            window._lastIntensity = intensity;
        }
    };
    """
    
    driver.execute_script(display_code)

def update_emotion_display(driver, emotion, intensity, timer_duration=5.0):
    """Update the on-screen emotion display"""
    driver.execute_script(f"window.updateEmotionDisplay('{emotion}', {intensity}, {timer_duration})")

def run_emotion_test(port=1234):
    """Run a test cycling through different emotions every N seconds"""
    url = f"http://localhost:{port}"
    # Check if server is running
    print(f"Checking if server is running at {url}...")
    
    if not is_server_running(url):
        print("❌ Server not running!")
        print(f"Please start your web server at port {port} and try again.")
        if not check_port_open("localhost", port):
            print(f"Port {port} is not open. Make sure your server is listening on this port.")
        return
    
    print("✅ Server is running!")
    
    # Ask for timer duration
    try:
        timer_duration = float(input("Enter seconds between emotions [default: 5.0]: ").strip() or "5.0")
        if timer_duration <= 0:
            timer_duration = 5.0
            print("Using default 5.0 seconds (must be positive)")
    except ValueError:
        timer_duration = 5.0
        print("Invalid input. Using default 5.0 seconds")
    
    # Configure Chrome options
    chrome_options = Options()
    
    # Initialize the Chrome driver
    try:
        driver = webdriver.Chrome(options=chrome_options)
    except Exception as e:
        print(f"❌ Error initializing Chrome: {e}")
        print("Make sure Chrome and ChromeDriver are installed correctly.")
        return
    
    try:
        # Open the webpage
        print(f"Opening URL: {url}")
        driver.get(url)
        
        # Wait for page to load
        time.sleep(2)
        
        # Test if the page has the required JavaScript functions
        try:
            driver.execute_script("return typeof window.setSpydrEmotion === 'function'")
            driver.execute_script("return typeof window.handleAIPrompt === 'function'")
        except Exception:
            print("❌ Required JavaScript functions not found in the page!")
            print("Make sure emotional-core.js is properly imported and window functions are defined.")
            return
        
        # Setup the emotion display
        setup_emotion_display(driver)

        # Give time for the UI to fully initialize
        time.sleep(1)
        
        # Test cases - predefined emotions
        test_cases = [
            # Format: (prompt text, expected emotion)
            ("I'm so happy today! Everything is going great.", "happy"),
            ("This makes me really angry. I can't believe this happened.", "angry"),
            ("I feel so sad and depressed after hearing the news.", "sad"),
            ("I'm feeling quite calm and peaceful right now.", "calm"),
            ("Wow! That's so exciting! I can't wait!", "excited"),
            ("I'm really scared and nervous about this.", "fearful"),
            ("Oh my god! I'm so surprised by this revelation!", "surprised"),
            ("I'm a bit confused by these instructions.", "confused"),
            ("I love you so much. You're amazing!", "loving"),
            ("I need to focus on finishing this project today.", "focused"),
            ("Just a normal day, nothing special happening.", "neutral")
        ]
        
        print("\n🌟 Starting Spydr Emotional Core Test")
        print("====================================")
        
        # First, cycle through direct emotions to test the core functionality
        print("\n📊 Testing direct emotional states:")
        direct_emotions = [
            ("happy", 0.8), ("sad", 0.7), ("angry", 0.9), 
            ("calm", 0.6), ("excited", 0.9), ("fearful", 0.8),
            ("surprised", 0.9), ("confused", 0.7), ("loving", 0.8), 
            ("focused", 0.7), ("neutral", 0.5)
        ]
        
        for emotion, intensity in direct_emotions:
            print(f"Setting emotion: {emotion} (intensity: {intensity})")
            # Update on-screen display with custom timer
            update_emotion_display(driver, emotion, intensity, timer_duration)
            # Call the JavaScript function to set the emotion
            driver.execute_script(f"window.setSpydrEmotion('{emotion}', {intensity})")
            time.sleep(timer_duration + 2)  # Wait the specified time plus a buffer
        
        # Now test with actual prompts
        print("\n💬 Testing with actual prompts:")
        
        for prompt, expected in test_cases:
            emotion, intensity = analyze_sentiment(prompt)
            print(f"\nPrompt: \"{prompt}\"")
            print(f"Detected: {emotion} (intensity: {intensity:.2f})")
            
            # Update on-screen display with custom timer
            update_emotion_display(driver, emotion, intensity, timer_duration)
            
            # Call the JavaScript function with the analyzed sentiment
            driver.execute_script(f"""window.handleAIPrompt('{prompt.replace("'", "\\'")}')""")
            time.sleep(timer_duration + 2)  # Wait the specified time plus a buffer
        
        # Allow some time for the last animation to complete
        time.sleep(timer_duration)
        print("\n✅ Emotion test completed!")
        
    except Exception as e:
        print(f"❌ Error during test: {e}")
    finally:
        # Clean up
        time.sleep(1)
        driver.quit()

def test_custom_prompt(prompt, port=1234):
    """Test a custom prompt entered by the user"""
    url = f"http://localhost:{port}"
    # Check if server is running
    print(f"Checking if server is running at {url}...")
    
    if not is_server_running(url):
        print("❌ Server not running!")
        print(f"Please start your web server at port {port} and try again.")
        if not check_port_open("localhost", port):
            print(f"Port {port} is not open. Make sure your server is listening on this port.")
        return
    
    print("✅ Server is running!")
    
    # Configure Chrome options
    chrome_options = Options()
    
    # Initialize the Chrome driver
    try:
        driver = webdriver.Chrome(options=chrome_options)
    except Exception as e:
        print(f"❌ Error initializing Chrome: {e}")
        print("Make sure Chrome and ChromeDriver are installed correctly.")
        return
    
    try:
        # Open the webpage
        print(f"Opening URL: {url}")
        driver.get(url)
        
        # Wait for page to load
        time.sleep(2)
        
        # Setup the emotion display
        setup_emotion_display(driver)
        
        # Analyze the sentiment of the prompt
        emotion, intensity = analyze_sentiment(prompt)
        
        print(f"\nPrompt: \"{prompt}\"")
        print(f"Detected emotion: {emotion} (intensity: {intensity:.2f})")
        
        # Update on-screen display
        update_emotion_display(driver, emotion, intensity)
        
        # Call the JavaScript function with the analyzed sentiment
        driver.execute_script(f"""window.handleAIPrompt('{prompt.replace("'", "\\'")}')""")
        
        # Keep the browser open for manual inspection
        input("\nPress Enter to close the browser...")
        
    except Exception as e:
        print(f"❌ Error during test: {e}")
    finally:
        # Clean up
        driver.quit()

def test_without_server():
    """Run a simplified test that just shows sentiment analysis without a server"""
    print("\n🔍 Emotion Analysis Demo (No Server Required)")
    print("==========================================")
    
    while True:
        prompt = input("\nEnter a prompt to analyze (or 'exit' to quit): ")
        if prompt.lower() == 'exit':
            break
            
        emotion, intensity = analyze_sentiment(prompt)
        print(f"Detected emotion: {emotion} (intensity: {intensity:.2f})")
        print(f"This would set Spydr's sphere parameters to match '{emotion}' state")

if __name__ == "__main__":
    print("🌌 Spydr Emotional Core Test Suite 🌌")
    print("===================================")
    
    # Default to option 1 for first user input
    choice = "1"
    
    # Ask for port number
    try:
        port = int(input("Enter port number [default: 1234]: ").strip() or "1234")
    except ValueError:
        port = 1234
        print("Invalid port number. Using default port 1234")
    
    if choice == "1":
        run_emotion_test(port)
    elif choice == "2":
        prompt = input("\nEnter your prompt: ")
        test_custom_prompt(prompt, port)
    elif choice == "3":
        test_without_server()
    else:
        print("Invalid choice. Exiting.")