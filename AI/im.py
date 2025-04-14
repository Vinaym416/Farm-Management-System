from serpapi import GoogleSearch
import os

def search_images_with_query(query):
    """
    Search for images using a query via SerpAPI.

    Args:
        query (str): The search query.

    Returns:
        dict: The image search results or an error message.
    """
    # Define the parameters for the Google Images search
    params = {
        "engine": "google_images",
        "q": query,
        "location": "Austin, TX, Texas, United States",
        "api_key": "976a8e93414707072a4ec8928b6872b1e40297dfcfd52bf53a0e453da5593695"
    }

    try:
        # Perform the search
        search = GoogleSearch(params)
        results = search.get_dict()

        # Extract images from the results
        images_results = results.get("images_results", [])

        if images_results:
            return {"Images": images_results}
        else:
            return {"error": "No images found for the query."}
    except Exception as e:
        return {"error": f"An error occurred while searching for images: {e}"}


# Example usage
if __name__ == "__main__":
    # Search query
    query = "Coffee"

    # Call the function and print the result
    result = search_images_with_query(query)
    if "error" in result:
        print(result["error"])
    else:
        print("Images Found:")
        for image in result["Images"]:
            print(image.get("link", "No link available"))