import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is set dynamically inside the handler

const PROMPT = `Kamu adalah AI yang mengekstrak data dari dokumen JSA (Job Safety Analysis) Indonesia. 
Analisis gambar/dokumen ini dan extract ke format JSON berikut.

Aturan:
- Jika field tidak ditemukan dalam dokumen, isi dengan null
- Untuk field teks panjang, pertahankan format dan line breaks asli
- Jangan menambahkan informasi yang tidak ada di dokumen
- Output HANYA valid JSON. JANGAN sertakan markdown block (seperti \`\`\`json).

Schema:
{
  "type_pekerjaan": "string | null",
  "jenis_unit": "string | null", 
  "cuaca": "string | null",
  "kondisi": "string | null",
  "hasil_pemeriksaan_area": "string | null",
  "rekomendasi_area": "string | null",
  "hasil_pemeriksaan_area_360": "string | null",
  "rekomendasi_area_360": "string | null",
  "hasil_energi_berbahaya": "string | null",
  "rekomendasi_energi_berbahaya": "string | null",
  "hasil_penanggung_jawab": "string | null",
  "rekomendasi_penanggung_jawab": "string | null",
  "urutan_langkah_kerja": "string | null",
  "potensi_bahaya": "string | null",
  "kontrol_resiko": "string | null"
}`;

export const maxDuration = 60; // 60 seconds timeout

export async function POST(req: NextRequest) {
  try {
    const currentApiKey = process.env.GEMINI_API_KEY;
    if (!currentApiKey) {
      return NextResponse.json(
        { error: "Server Configuration Error: GEMINI_API_KEY is missing. Harap restart server Next.js Anda (npm run dev)." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: currentApiKey });

    const { base64Data, mimeType } = await req.json();

    if (!base64Data || !mimeType) {
      return NextResponse.json(
        { error: "Bad Request: Missing base64Data or mimeType" },
        { status: 400 }
      );
    }

    // Call Gemini 2.0 Flash
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: PROMPT },
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        temperature: 0.1, // Low temperature for more deterministic extraction
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    // Attempt to parse JSON. Gemini should respect responseMimeType
    // but we can strip markdown if it accidentally includes it.
    let cleanText = text;
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.replace(/```json\n?/, "").replace(/\n?```$/, "");
    }
    
    const extractedData = JSON.parse(cleanText);

    return NextResponse.json({ success: true, data: extractedData });
  } catch (error: any) {
    console.error("Gemini Extraction Error:", error);
    return NextResponse.json(
      { error: "Extraction failed", details: error.message },
      { status: 500 }
    );
  }
}
