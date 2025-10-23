
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // The result is "data:image/jpeg;base64,..."
        // We need to remove the prefix for the Gemini API
        const base64 = result.split(',')[1];
        if (base64) {
            resolve(base64);
        } else {
            reject(new Error("Failed to read Base64 data from file."));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };
