# 🚚 Logistics Volume Classifier with PyTorch & Gradio

This project is an AI-powered tool designed to **predict shipment volume categories**—'Small', 'Medium', or 'Large' —based on various time, location, weather, and goods-specific inputs. The goal is to help logistics companies make smarter, data-driven decisions for **resource allocation**, **fleet planning**, and **route optimization**.

It includes:
-> A softmax classification model built with PyTorch
-> Preprocessing using 'StandardScaler'
-> A friendly web UI built with Gradio

---

## 🧠 Problem Statement

In logistics and supply chain operations, anticipating demand volume is critical. Knowing whether a shipment is likely to be **small, medium, or large** enables:
-> Proper **vehicle assignment**
-> Better **fuel and driver allocation**
-> Improved **on-time delivery rates**

This classifier takes multiple context features and returns a predicted volume label to assist in such operational decisions.

---

## ✅ Features

-> 🧮 **23-feature input vector**, combining numeric, time-based, and one-hot encoded categorical data
-> 🧠 **Softmax classifier** trained on synthetic or real-world logistics data
-> 🖥️ **Gradio interface** for easy user interaction with no coding required
-> ⚖️ **StandardScaler** to ensure input normalization as per training distribution

---

## 🧾 Tech Stack

- **Language:** Python
- **Model Framework:** PyTorch
- **Frontend:** Gradio (interactive UI)
- **Preprocessing:** Scikit-learn ('StandardScaler')
- **Deployment-Ready:** Can be deployed locally or on Hugging Face Spaces/Streamlit Cloud

---

## 🏗️ Model Architecture

Input (23 features)
   ↓
Linear Layer (23 → 3)
   ↓
Softmax (via CrossEntropyLoss during training)
   ↓
Output: Class probabilities for [Small, Medium, Large]
