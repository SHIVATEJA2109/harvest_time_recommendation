import io
import os
import httpx
import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
from dotenv import load_dotenv
import tensorflow as tf

load_dotenv()

app = FastAPI(title="Harvest-Sync API", description="AI crop quality analysis and predictability platform.")

# Allow communication with React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
MODEL_PATH = "../ml-model/fruit_quality.h5"
model = tf.keras.models.load_model(MODEL_PATH)

# Define the classes based on alphabetical directory structuring
CLASS_NAMES = ["Fresh", "Medium", "Poor"]

def process_image(img_bytes):
    """Resize to 224x224 and normalize."""
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0
    # Expand dimensions for model prediction -> (1, 224, 224, 3)
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

def predict_quality(img_array):
    """
    Use trained MobileNetV2 map index to class label.
    """
    # The model expects a batch, predict returns an array of shape (1, 3)
    predictions = model.predict(img_array)
    class_idx = np.argmax(predictions[0])
    return CLASS_NAMES[class_idx]

@app.post("/analyze-crop")
async def analyze_crop(file: UploadFile = File(...)):
    # Read the image file
    contents = await file.read()
    
    # Process the image for the model
    processed_image = process_image(contents)
    
    # Run prediction using the trained model
    prediction = predict_quality(processed_image)
    
    # Map predictions to business actions
    response_data = {
        "filename": file.filename,
        "quality": prediction,
        "label": "",
        "action": ""
    }
    
    if prediction == "Fresh":
        response_data["label"] = "Premium"
        response_data["action"] = "Contacting High-Value Buyers."
    elif prediction == "Medium":
        response_data["label"] = "Standard"
        response_data["action"] = "Diverting to Juice/Processing Units."
    else:
        response_data["label"] = "Spoiled"
        response_data["action"] = "Marking for Compost/Fertilizer."
        
    return response_data

class Location(BaseModel):
    latitude: float
    longitude: float

@app.post("/weather-risk")
async def evaluate_weather_risk(location: Location):
    api_key = os.getenv("OPENWEATHERMAP_API_KEY")
    if not api_key or api_key == "your_openweathermap_api_key_here":
        raise HTTPException(status_code=500, detail="Weather API key not configured")

    weather_url = f"https://api.openweathermap.org/data/2.5/forecast?lat={location.latitude}&lon={location.longitude}&appid={api_key}&units=metric"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(weather_url)
            response.raise_for_status()
            data = response.json()
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 401:
                raise HTTPException(status_code=401, detail="Weather API key is invalid or not yet activated (can take 10-15 mins).")
            raise HTTPException(status_code=e.response.status_code, detail=f"Weather API error: {e.response.text}")
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Weather API request failed: {str(e)}")

    # The first item in the forecast list is effectively the "current" weather
    current_data = data["list"][0]
    temp = current_data["main"]["temp"]
    conditions = current_data["weather"][0]["main"].lower()
    description = current_data["weather"][0]["description"]
    
    # Aggregate 3-hour chunks into a 5-day daily forecast
    daily_forecasts = {}
    for item in data["list"]:
        date = item["dt_txt"].split(" ")[0]
        if date not in daily_forecasts:
            daily_forecasts[date] = {
                "temps": [],
                "conditions": []
            }
        daily_forecasts[date]["temps"].append(item["main"]["temp"])
        daily_forecasts[date]["conditions"].append(item["weather"][0]["main"])
        
    formatted_forecast = []
    for date, info in daily_forecasts.items():
        main_condition = max(set(info["conditions"]), key=info["conditions"].count)
        formatted_forecast.append({
            "date": date,
            "temp_max": round(max(info["temps"]), 1),
            "temp_min": round(min(info["temps"]), 1),
            "condition": main_condition
        })
    
    # Limit to 5 days
    formatted_forecast = formatted_forecast[:5]
    
    risk_score = "Low"
    recommendation = "Optimal harvesting conditions."
    
    if "rain" in conditions or "storm" in conditions:
        risk_score = "High"
        recommendation = "Heavy rain predicted. Accelerate harvest to prevent crop rot."
    elif temp > 35:
        risk_score = "Medium"
        recommendation = "Heat stress risk. Harvest early morning or late evening."
    elif temp < 5:
        risk_score = "Medium"
        recommendation = "Frost risk. Monitor sensitive crops tightly."

    return {
        "location": data["city"]["name"],
        "temperature": temp,
        "conditions": description.capitalize(),
        "risk_score": risk_score,
        "recommendation": recommendation,
        "forecast": formatted_forecast
    }

@app.get("/price-trends/{crop}")
async def get_price_trends(crop: str):
    """
    Generate dynamic mock price trends for the Hackathon MVP.
    Uses a base price for each crop and introduces realistic daily fluctuations
    to simulate a live market curve.
    """
    base_prices = {
        "Tomato": 45.0,
        "Potato": 18.0,
        "Banana": 35.0,
        "Mango": 130.0,
        "Chilli": 68.0
    }
    
    # Default to Tomato if crop not found
    crop_name = crop.capitalize()
    base_price = base_prices.get(crop_name, 45.0)
    
    # Generate 11 days of data: 5 past, 1 today, 5 future
    days_labels = [
        "-5 Days", "-4 Days", "-3 Days", "-2 Days", "Yesterday",
        "Today",
        "+1 Day", "+2 Days", "+3 Days", "+4 Days", "+5 Days"
    ]
    
    trend_data = []
    current_price = base_price
    
    for i, label in enumerate(days_labels):
        is_today = (label == "Today")
        is_predicted = i > 5
        
        # Add random fluctuation between -3% and +6% daily
        fluctuation = current_price * np.random.uniform(-0.03, 0.06)
        current_price = round(current_price + fluctuation, 2)
        
        day_data = {
            "day": label,
            "price": current_price,
            "predicted": is_predicted,
        }
        
        if is_today:
            day_data["isToday"] = True
            
        trend_data.append(day_data)
        
    # Find the peak day in the PREDICTED future (indices 6 to 10)
    # This simulates our "AI Peak Prediction" feature
    predicted_slice = trend_data[6:]
    peak_day = max(predicted_slice, key=lambda x: x["price"])
    peak_index = trend_data.index(peak_day)
    trend_data[peak_index]["isPeak"] = True

    return trend_data

@app.get("/")
def read_root():
    return {"message": "Harvest-Sync API is running!"}
