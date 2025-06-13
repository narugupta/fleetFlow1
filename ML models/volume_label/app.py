import gradio as gr
import torch
import torch.nn as nn
from datetime import datetime, timedelta
import json
import numpy as np
from sklearn.preprocessing import StandardScaler

# --- Model Definition ---
class Softmax_Model(nn.Module):
    def __init__(self, input_features, output_classes):
        super(Softmax_Model, self).__init__()
        self.l1 = nn.Linear(input_features, output_classes)

    def forward(self, x):
        return self.l1(x)

# --- Load Model and Scaler ---
input_features = 23
output_classes = 3
class_labels = ['Small', 'Medium', 'Large']

model = Softmax_Model(input_features, output_classes)
model.load_state_dict(torch.load("softmax_model.pth", map_location=torch.device("cpu")))
model.eval()

with open("scaler.json", "r") as f:
    scaler_data = json.load(f)

scaler = StandardScaler()
scaler.mean_ = np.array(scaler_data['mean'])
scaler.scale_ = np.array(scaler_data['scale'])
scaler.var_ = scaler.scale_ ** 2
scaler.n_features_in_ = len(scaler.mean_)

# --- Prediction Function ---
def predict_volume(date_input, hour, zone, weather, goods_type):
    try:
        date_obj = datetime.strptime(date_input, "%Y-%m-%d")
        hour = int(hour)
        if not (0 <= hour <= 23):
            return "Hour must be between 0 and 23."
    except:
        return "Invalid date or hour format."

    day_of_week = date_obj.weekday()
    next_month = date_obj.replace(day=28) + timedelta(days=4)
    last_day = (next_month - timedelta(days=next_month.day)).day
    is_month_end = int(date_obj.day == last_day)
    is_quarter_end = int(date_obj.month in [3, 6, 9, 12] and is_month_end)

    # One-hot encoding for zones
    zones = ['North_zone', 'South_zone', 'West_zone']
    zone_onehot = [1.0 if zone == z else 0.0 for z in zones]

    # One-hot for weather
    weathers = ['Foggy', 'Rainy', 'Stormy']
    weather_onehot = [1.0 if weather == w else 0.0 for w in weathers]

    # One-hot for goods type
    goods_types = ['Chemicals', 'Clothing', 'Electronics', 'Fragile', 'Perishable']
    goods_onehot = [1.0 if goods_type == g else 0.0 for g in goods_types]

    features = [
        1.0,  # traffic_level = Medium
        0.0,  # is_holiday
        1.0,  # priority_level = Medium
        80.0,  # fuel_price
        hour,
        day_of_week,
        is_month_end,
        is_quarter_end,
        *zone_onehot,
        *weather_onehot,
        0.0, 0.0, 1.0,  # Assigned vehicle hardcoded to Van
        *goods_onehot,
        50.0  # order_volume
    ]

    x = np.array(features, dtype=np.float32).reshape(1, -1)
    x_scaled = scaler.transform(x)
    x_tensor = torch.tensor(x_scaled, dtype=torch.float32)

    with torch.no_grad():
        output = model(x_tensor)
        _, pred = torch.max(output, dim=1)

    return class_labels[pred.item()]

# --- Gradio Interface ---
iface = gr.Interface(
    fn=predict_volume,
    inputs=[
        gr.Textbox(label="Date (YYYY-MM-DD)", placeholder="2025-06-10"),
        gr.Number(label="Hour (0–23)", precision=0, value=12),
        gr.Dropdown(['North_zone', 'South_zone', 'West_zone'], label="Zone", info="Select delivery zone"),
        gr.Dropdown(['Foggy', 'Rainy', 'Stormy'], label="Weather", info="Select weather condition"),
        gr.Dropdown(['Chemicals', 'Clothing', 'Electronics', 'Fragile', 'Perishable'], label="Goods Type", info="Select goods category")
    ],
    outputs=gr.Label(label="Predicted Volume Label"),
    title="Logistics Volume Classifier",
    description="Predict shipment volume label (Small, Medium, Large) based on date, time, and logistics conditions."
)

# --- Launch ---
if __name__ == "__main__":
    iface.launch()
