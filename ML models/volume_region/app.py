import folium
import math
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
import gradio as gr

# Load data files
regions_df = pd.read_csv("delhi_region_landmark_distances_corrected.csv")
train_df = pd.read_csv("delhi_region_demand_dataset_(USE).csv")

features = ['day_of_week', 'month', 'holiday', 'temperature', 'humidity',
            'wind_speed', 'rainfall', 'dist_city', 'dist_airport', 'dist_railway']
weather_features = ['temperature', 'humidity', 'wind_speed', 'rainfall']
target = 'demand'

def get_calendar_features(date_str):
    dt = pd.to_datetime(date_str)
    return {'day_of_week': dt.weekday(), 'month': dt.month, 'holiday': int(dt.weekday() == 6)}

def generate_random_weather():
    return {
        'temperature': np.random.uniform(15, 35),
        'humidity': np.random.uniform(20, 80),
        'wind_speed': np.random.uniform(0, 10),
        'rainfall': np.random.choice([0.0, 0.5, 1.0, 5.0])
    }

def destination_point(lat, lon, distance_m, bearing_deg):
    R = 6371000
    bearing = math.radians(bearing_deg)
    lat1, lon1 = math.radians(lat), math.radians(lon)
    lat2 = math.asin(math.sin(lat1)*math.cos(distance_m/R) + math.cos(lat1)*math.sin(distance_m/R)*math.cos(bearing))
    lon2 = lon1 + math.atan2(math.sin(bearing)*math.sin(distance_m/R)*math.cos(lat1),
                             math.cos(distance_m/R) - math.sin(lat1)*math.sin(lat2))
    return math.degrees(lat2), math.degrees(lon2)

def create_map_for_date(date_str, predictions_df):
    delhi_center = (28.6139, 77.2090)
    R = 30000
    R1 = R / math.sqrt(31)
    ring_radii = [R1 * math.sqrt(2**k - 1) for k in range(1, 6)]
    sectors_per_ring = [4 * 2**(k - 1) for k in range(1, 6)]

    m = folium.Map(location=delhi_center, zoom_start=11)
    region_num = 1

    for i, r_outer in enumerate(ring_radii):
        r_inner = 0 if i == 0 else ring_radii[i - 1]
        sectors = sectors_per_ring[i]
        sector_angle = 360 / sectors

        for sector in range(sectors):
            start_angle = sector * sector_angle
            end_angle = (sector + 1) * sector_angle
            points = []

            for angle in np.linspace(start_angle, end_angle, 10):
                lat, lon = destination_point(delhi_center[0], delhi_center[1], r_inner, angle)
                points.append((lat, lon))
            for angle in np.linspace(end_angle, start_angle, 10):
                lat, lon = destination_point(delhi_center[0], delhi_center[1], r_outer, angle)
                points.append((lat, lon))

            demand_val = predictions_df.loc[predictions_df['region'] == region_num, 'predicted_demand'].values
            demand_val = demand_val[0] if len(demand_val) > 0 else 0
            color = 'red' if demand_val == 1 else 'blue'

            folium.Polygon(
                locations=points,
                color=color,
                fill=True,
                fill_color=color,
                fill_opacity=0.4,
                weight=1,
                tooltip=f'Region {region_num}: Demand={"High" if demand_val == 1 else "Low"} - Date: {date_str}'
            ).add_to(m)

            region_num += 1

    return m._repr_html_()

def predict_and_map(dates_input):
    dates_to_predict = [d.strip() for d in dates_input.split(",") if d.strip()]
    output_maps = []

    X = train_df[features].copy()
    y = train_df[target]
    if X['holiday'].dtype == bool:
        X['holiday'] = X['holiday'].astype(int)

    scaler = StandardScaler()
    X[weather_features] = scaler.fit_transform(X[weather_features])

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)

    for date_str in dates_to_predict:
        records = []
        calendar_features = get_calendar_features(date_str)
        weather_vals = generate_random_weather()

        for _, region in regions_df.iterrows():
            record = {
                'region': region['region'],
                'dist_city': region['dist_city'],
                'dist_airport': region['dist_airport'],
                'dist_railway': region['dist_railway'],
                **calendar_features,
                **weather_vals
            }
            records.append(record)

        df_pred = pd.DataFrame(records)
        df_pred[weather_features] = scaler.transform(df_pred[weather_features])
        X_pred = df_pred[features]
        preds = model.predict(X_pred)
        df_pred['predicted_demand'] = preds

        m_html = create_map_for_date(date_str, df_pred)
        output_maps.append(m_html)

    return output_maps[0] if output_maps else "No valid dates provided."

interface = gr.Interface(
    fn=predict_and_map,
    inputs=gr.Textbox(label="Enter date(s) (comma-separated, format: YYYY-MM-DD)"),
    outputs=gr.HTML(label="Predicted Demand Map"),
    title="Delhi Region Demand Forecast Map",
    description="Enter one or more dates to predict demand and visualize it on the Delhi region map."
)

if __name__ == "__main__":
    interface.launch()
