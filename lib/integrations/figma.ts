import axios from 'axios';

interface FigmaFile {
  key: string;
  name: string;
  lastModified: string;
  thumbnailUrl: string;
}

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
}

export class FigmaService {
  private apiKey: string;
  private baseUrl = 'https://api.figma.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private get headers() {
    return {
      'X-Figma-Token': this.apiKey,
    };
  }

  async getFile(fileKey: string): Promise<FigmaFile> {
    try {
      const response = await axios.get(`${this.baseUrl}/files/${fileKey}`, {
        headers: this.headers,
      });
      
      return {
        key: fileKey,
        name: response.data.name,
        lastModified: response.data.lastModified,
        thumbnailUrl: response.data.thumbnailUrl,
      };
    } catch (error) {
      console.error('Figma API Error:', error);
      throw new Error('Failed to fetch Figma file');
    }
  }

  async getNodes(fileKey: string, nodeIds: string[]): Promise<FigmaNode[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/files/${fileKey}/nodes`, {
        headers: this.headers,
        params: { ids: nodeIds.join(',') },
      });

      return Object.values(response.data.nodes).map((node: any) => node.document);
    } catch (error) {
      console.error('Figma API Error:', error);
      throw new Error('Failed to fetch Figma nodes');
    }
  }

  async getImage(fileKey: string, nodeId: string): Promise<string> {
    try {
      const response = await axios.get(`${this.baseUrl}/images/${fileKey}`, {
        headers: this.headers,
        params: { ids: nodeId, format: 'png' },
      });

      return response.data.images[nodeId];
    } catch (error) {
      console.error('Figma API Error:', error);
      throw new Error('Failed to fetch Figma image');
    }
  }
}

// Instance par défaut utilisant la variable d'environnement
export const figmaService = new FigmaService(process.env.FIGMA_ACCESS_TOKEN || '');
