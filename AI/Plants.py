# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from google import genai
# from serpapi import GoogleSearch

# app = Flask(__name__)
# CORS(app)

# # Initialize the GenAI client
# client = genai.Client(api_key="AIzaSyDN91XIzuHfgmh9Y8HviEUezJDxes7Fhuc")

# @app.route('/api/get_plant_details', methods=['POST'])
# def get_plant_details():
#     """
#     Fetch plant details by name.
#     """
#     data = request.json
#     plant_name = data.get('plant_name', '')

#     if not plant_name:
#         return jsonify({"error": "Plant name is required"}), 400

#     prompt = f"Provide details about the plant '{plant_name}', including its type, description, soil type, and other relevant information."

#     try:
#         response = client.models.generate_content(
#             model="gemini-2.0-flash", contents=prompt
#         )
#         plant_details = response.text
#         return jsonify({"Plant Details": plant_details})
#     except Exception as e:
#         return jsonify({"error": f"An error occurred: {e}"}), 500

# @app.route('/api/identify_plant_from_image', methods=['POST'])
# def identify_plant_from_image():
#     """
#     Identify the plant from an image URL.
#     """
#     data = request.json
#     image_url = data.get('image_url', '')

#     if not image_url:
#         return jsonify({"error": "Image URL is required"}), 400

#     params = {
#         "engine": "google_lens",
#         "url": image_url,
#         "api_key": "f61aab1e18bcc95241ea9261c113f9f3e03dcc7fd3211ce02de237238899cee5"
#     }

#     try:
#         search = GoogleSearch(params)
#         results = search.get_dict()
#         visual_matches = results.get("visual_matches", [])
        
#         if visual_matches:
#             plant_name = visual_matches[0].get("title", "Unknown Plant")
#             return jsonify({"Plant Name": plant_name})
#         else:
#             return jsonify({"error": "No plant identified in the image."}), 404
#     except Exception as e:
#         return jsonify({"error": f"An error occurred while identifying the plant: {e}"}), 500

# if __name__ == '__main__':
#     app.run(debug=True)

# -----------------------------------------------------------
# from google import genai
# from tabulate import tabulate
# from serpapi import GoogleSearch

# def get_plant_details(plant_name):
#     """
#     Fetch plant details such as type, description, soil type, etc., using the Google GenAI API.
    
#     Args:
#         plant_name (str): The name of the plant to search for.
    
#     Returns:
#         dict: A dictionary containing plant details or an error message.
#     """
#     # Initialize the GenAI client
#     client = genai.Client(api_key="AIzaSyDN91XIzuHfgmh9Y8HviEUezJDxes7Fhuc")

#     # Prepare the content prompt
#     prompt = f"Provide details about the plant '{plant_name}', including its type, description, soil type, and other relevant information."

#     try:
#         # Generate content using the GenAI API
#         response = client.models.generate_content(
#             model="gemini-2.0-flash", contents=prompt
#         )

#         # Parse the response text
#         plant_details = response.text

#         return {"Plant Details": plant_details}

#     except Exception as e:
#         return {"error": f"An error occurred: {e}"}

# def identify_plant_from_image(image_url):
#     """
#     Identify the plant from an image using the Google Lens engine via SerpAPI.
    
#     Args:
#         image_url (str): The URL of the image to analyze.
    
#     Returns:
#         str: The name of the identified plant or an error message.
#     """
#     params = {
#         "engine": "google_lens",
#         "url": image_url,
#         "api_key": "f61aab1e18bcc95241ea9261c113f9f3e03dcc7fd3211ce02de237238899cee5"
#     }

#     try:
#         search = GoogleSearch(params)
#         results = search.get_dict()
#         visual_matches = results.get("visual_matches", [])
        
#         if visual_matches:
#             # Extract the name of the first matching plant
#             plant_name = visual_matches[0].get("title", "Unknown Plant")
#             return plant_name
#         else:
#             return "No plant identified in the image."

#     except Exception as e:
#         return f"An error occurred while identifying the plant: {e}"

# def format_details_as_table(details):
#     """
#     Format the plant details into a table for easier access.
    
#     Args:
#         details (dict): The dictionary containing plant details.
    
#     Returns:
#         str: A formatted table as a string.
#     """
#     if "error" in details:
#         return details["error"]

#     # Convert the details into a table format
#     table_data = [["Key", "Value"]]
#     for key, value in details.items():
#         table_data.append([key, value])

#     return tabulate(table_data, headers="firstrow", tablefmt="grid")

# # Example usage
# if __name__ == "__main__":
#     choice = input("Do you want to identify a plant by name or image? (name/image): ").strip().lower()

#     if choice == "name":
#         plant_name = input("Enter the plant name: ")
#         details = get_plant_details(plant_name)
#         formatted_details = format_details_as_table(details)
#         print(formatted_details)
#     elif choice == "image":
#         image_url = input("Enter the image URL: ")
#         plant_name = identify_plant_from_image(image_url)
#         if "error" not in plant_name:
#             print(f"Identified Plant: {plant_name}")
#             details = get_plant_details(plant_name)
#             formatted_details = format_details_as_table(details)
#             print(formatted_details)
#         else:
#             print(plant_name)
#     else:
#         print("Invalid choice. Please enter 'name' or 'image'.")



# ------------------------------------------------------------no table

# from google import genai

# # Initialize the GenAI client
# client = genai.Client(api_key="AIzaSyDN91XIzuHfgmh9Y8HviEUezJDxes7Fhuc")

# def get_plant_details_tree(plant_name):
#     """
#     Fetch plant details using GenAI and organize the response into a tree-like structure.

#     Args:
#         plant_name (str): The name of the plant to search for.

#     Returns:
#         dict: A dictionary containing categorized plant details.
#     """
#     # Prepare the content prompt
#     prompt = f"Provide details about the plant '{plant_name}', including its type, description, soil type, and other relevant information."

#     try:
#         # Generate content using the GenAI API
#         response = client.models.generate_content(
#             model="gemini-2.0-flash", contents=prompt
#         )

#         # Parse the response text
#         plant_details_raw = response.text

#         # Example parsing logic to create a tree-like structure
#         plant_details_tree = {
#             "Plant Name": plant_name,
#             "Details": {
#                 "Type": None,
#                 "Description": None,
#                 "Soil Type": None,
#                 "Other Information": None
#             }
#         }

#         # Split the response into lines and categorize
#         for line in plant_details_raw.split("\n"):
#             if "type" in line.lower():
#                 plant_details_tree["Details"]["Type"] = line.split(":")[-1].strip()
#             elif "description" in line.lower():
#                 plant_details_tree["Details"]["Description"] = line.split(":")[-1].strip()
#             elif "soil" in line.lower():
#                 plant_details_tree["Details"]["Soil Type"] = line.split(":")[-1].strip()
#             else:
#                 if plant_details_tree["Details"]["Other Information"] is None:
#                     plant_details_tree["Details"]["Other Information"] = line.strip()
#                 else:
#                     plant_details_tree["Details"]["Other Information"] += f" {line.strip()}"

#         return plant_details_tree

#     except Exception as e:
#         return {"error": f"An error occurred: {e}"}

# # Example usage
# if __name__ == "__main__":
#     plant_name = input("Enter the plant name: ")
#     details_tree = get_plant_details_tree(plant_name)
#     print(details_tree)



# 
import requests
import base64
import os

# Plant.id API configuration
PLANT_API_KEY = "XKZK8j1S41fV8uRXjaY92mp2KV5YY0Cnhib3JTEsdtV45pPlcL"
PLANT_API_URL = "https://plant.id/api/v3"

def identify_plant_from_image(image_path):
    """
    Identify the plant from an image file using the Plant.id API.
    """
    try:
        # Read the file as a base64 string
        with open(image_path, "rb") as image_file:
            image_base64 = base64.b64encode(image_file.read()).decode('utf-8')

        # Prepare the request payload
        payload = {
            "api_key": PLANT_API_KEY,
            "images": [image_base64],
            "modifiers": ["crops_fast", "similar_images"],
            "plant_language": "en",
            "plant_details": ["common_names", "url", "wiki_description", "taxonomy"]
        }

        # Send the request to the Plant.id API
        response = requests.post(f"{PLANT_API_URL}/identify", json=payload)

        if response.status_code != 200:
            return f"Error: Plant.id API returned status {response.status_code} - {response.text}"

        results = response.json()
        if "suggestions" in results and results["suggestions"]:
            plant = results["suggestions"][0]
            plant_details = {
                "Common Name": ", ".join(plant.get("plant_details", {}).get("common_names", ["Not available"])),
                "Scientific Name": plant.get("plant_name", "Not available"),
                "Family": plant.get("plant_details", {}).get("taxonomy", {}).get("family", "Not available"),
                "Soil Type": plant.get("plant_details", {}).get("growth_requirements", {}).get("soil", "Not available"),
                "Description": plant.get("plant_details", {}).get("wiki_description", {}).get("value", "Not available"),
                "More Info": plant.get("plant_details", {}).get("url", "Not available")
            }
            return plant_details
        else:
            return "No plant identified in the image."
    except Exception as e:
        return f"An error occurred: {e}"

def main():
    print("Welcome to the Plant Identifier!")
    print("Analyzing the image from the 'images' folder...")

    # Path to the image in the 'images' folder
    image_path = r"c:\Users\user\OneDrive\Desktop\New folder (3)\AI\images\images.jpeg"

    if not os.path.exists(image_path):
        print("Error: The specified file does not exist.")
        return

    print("Analyzing the image...")
    result = identify_plant_from_image(image_path)

    if isinstance(result, dict):
        print("\nPlant Details:")
        for key, value in result.items():
            print(f"{key}: {value}")
    else:
        print(result)

if __name__ == "__main__":
    main()