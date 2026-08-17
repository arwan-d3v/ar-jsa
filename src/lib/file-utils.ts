export function getAcceptedTypes() {
  return {
    "application/pdf": [".pdf"],
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/heic": [".heic"],
  };
}

export async function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = (error) => reject(error);
  });
}

export async function convertHeicToJpeg(file: File): Promise<Blob> {
  if (file.type !== "image/heic" && !file.name.toLowerCase().endsWith(".heic")) {
    return file; // Return as-is if not HEIC
  }

  try {
    // Dynamic import to avoid SSR issues
    const heic2any = (await import("heic2any")).default;
    
    const convertedBlob = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.8,
    });

    return Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
  } catch (error) {
    console.error("Failed to convert HEIC to JPEG:", error);
    throw new Error("Gagal mengonversi file HEIC");
  }
}
