# train.py
import os
import joblib
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, ConfusionMatrixDisplay
from sklearn.model_selection import train_test_split

# Load and split
iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, test_size=0.2, random_state=42
)

# Train
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

# Evaluate
y_pred = clf.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.2f}")

# Save model
os.makedirs("models", exist_ok=True)
joblib.dump(clf, "models/model.pkl")

# Save plot
os.makedirs("reports", exist_ok=True)
ConfusionMatrixDisplay.from_predictions(y_test, y_pred)
plt.title("Confusion Matrix")
plt.savefig("reports/confusion_matrix.png")

# Write report (Markdown)
with open("reports/report.md", "w") as f:
    f.write(f"# Model Evaluation Report\n")
    f.write(f"**Accuracy**: {accuracy:.2f}\n\n")
    f.write("![Confusion Matrix](confusion_matrix.png)\n")
