import { createWorker } from 'tesseract.js';

export interface OCRResult {
  text: string;
  confidence: number;
  language: string;
}

export class OCRService {
  private static instance: OCRService;
  private worker: any = null;

  private constructor() {}

  public static getInstance(): OCRService {
    if (!OCRService.instance) {
      OCRService.instance = new OCRService();
    }
    return OCRService.instance;
  }

  public async initialize() {
    if (!this.worker) {
      this.worker = await createWorker('fra');
    }
  }

  public async extractText(imageUrl: string): Promise<OCRResult> {
    try {
      if (!this.worker) {
        await this.initialize();
      }

      const { data: { text, confidence } } = await this.worker.recognize(imageUrl);

      return {
        text,
        confidence,
        language: 'fra'
      };
    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  public async terminate() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
}

export const ocrService = OCRService.getInstance();
