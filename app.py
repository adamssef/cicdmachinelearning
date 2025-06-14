# app.py
import streamlit as st
import joblib
import numpy as np

# Load model
model = joblib.load("models/model.pkl")

st.title("Iris Classifier")
st.write("Enter feature values below to get a prediction.")

# Input sliders for features
sepal_length = st.slider("Sepal length (cm)", 4.0, 8.0, 5.1)
sepal_width = st.slider("Sepal width (cm)", 2.0, 4.5, 3.5)
petal_length = st.slider("Petal length (cm)", 1.0, 7.0, 1.4)
petal_width = st.slider("Petal width (cm)", 0.1, 2.5, 0.2)

# Make prediction
features = np.array([[sepal_length, sepal_width, petal_length, petal_width]])
prediction = model.predict(features)[0]

# Output
class_map = {0: "Setosa", 1: "Versicolor", 2: "Virginica"}
st.subheader("Prediction:")
st.write(f"🌸 This is likely a **{class_map[prediction]}**.")
