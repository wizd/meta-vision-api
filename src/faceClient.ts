import axios, { AxiosResponse } from "axios";
import FormData from "form-data";

// 定义搜索结果的接口
export interface SearchResult {
  score: number;
  url: string;
  image_base64: string;
  markdown_content?: string;
  analysis?: AnalysisResult;
}

// 定义分析结果的接口
export interface AnalysisResult {
  analysis: string;
  names: string[];
  additional_info: string;
}

type TopNameEntry = [string, number];

export interface FaceSearchTaskResult {
  task_id: string;
  status: string;
  start_time: string;
  end_time?: string;
  input_image: string;
  results: SearchResult[];
  error?: string;
  top_names: TopNameEntry[];
}

interface FaceSearchResponse {
  results: SearchResult[];
}

interface AsyncSearchResponse {
  task_id: string;
  message: string;
}

class FaceClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async searchFace(fileBuffer: Buffer): Promise<FaceSearchResponse> {
    const formData = new FormData();
    formData.append("image", fileBuffer, {
      filename: "image.jpg",
      contentType: "image/jpeg",
    });

    try {
      const response: AxiosResponse<FaceSearchResponse> = await axios.post(
        `${this.baseUrl}/api/face_search/`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("人脸搜索出错:", error);
      throw error;
    }
  }

  async searchFaceAsync(
    fileBuffer: Buffer,
    fileName: string,
    contentType: string
  ): Promise<AsyncSearchResponse> {
    const formData = new FormData();
    formData.append("image", fileBuffer, {
      filename: fileName,
      contentType: contentType,
    });

    try {
      const response: AxiosResponse<AsyncSearchResponse> = await axios.post(
        `${this.baseUrl}/api/face_search_async/`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("启动异步人脸搜索出错:", error);
      throw error;
    }
  }
}

export default FaceClient;
