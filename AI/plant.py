from flask import Flask, request, jsonify
from flask_cors import CORS
from google.genai import types
from google import genai

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})  # Allow requests from your frontend

client = genai.Client(api_key="AIzaSyDN91XIzuHfgmh9Y8HviEUezJDxes7Fhuc")

@app.route('/describe_plant', methods=['POST'])
def describe_plant():
    """
    Endpoint to describe a plant based on its name.
    Expects a JSON payload with a 'plant_name' key.
    """
    data = request.get_json()
    plant_name = data.get('plant_name')

    if not plant_name:
        return jsonify({"error": "Plant name is required"}), 400

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[f"Describe the plant: {plant_name}"],
        )
        cleaned_output = response.text.strip().replace("\n", " ")
        return jsonify({"description": cleaned_output})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/caption_image', methods=['POST'])
def caption_image():
    """
    Endpoint to caption an image.
    Expects a file upload with the key 'image'.
    """
    if 'image' not in request.files:
        return jsonify({"error": "Image file is required"}), 400

    image_file = request.files['image']

    try:
        image_bytes = image_file.read()
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=[
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type='image/jpeg',
                ),
                'Caption this image.'
            ]
        )
        cleaned_output = response.text.strip().replace("\n", " ")
        return jsonify({"caption": cleaned_output})
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)