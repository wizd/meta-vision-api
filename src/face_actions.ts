const serviceEndpoint = process.env.NEXT_PUBLIC_SERVICE_ENDPOINT;

import {
  FaceAPIAnalyzeResponse,
  FaceAPIAnalyzeResult,
  FaceAPIExtractFacesResponse,
} from "./faceApiType";

export async function compareFacesAction(
  image1: string,
  image2: string,
  options: {
    facialRecognitionModel: string;
    faceDetector: string;
    distanceMetric: string;
    antiSpoofing: boolean;
  }
) {
  const requestBody = JSON.stringify({
    model_name: options.facialRecognitionModel,
    detector_backend: options.faceDetector,
    distance_metric: options.distanceMetric,
    align: true,
    img1_path: image1,
    img2_path: image2,
    enforce_detection: false,
    anti_spoofing: options.antiSpoofing,
  });

  const response = await fetch(`${serviceEndpoint}/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: requestBody,
  });

  const data = await response.json();

  if (response.status !== 200) {
    console.error("人脸比较请求失败:", {
      status: response.status,
      statusText: response.statusText,
      data: data,
    });
    throw new Error(
      `人脸比较失败: ${response.status} ${
        response.statusText
      } - ${JSON.stringify(data)}`
    );
  }

  return {
    verified: data.verified,
    distance: data.distance,
    threshold: data.threshold,
    model: data.model,
    detector_backend: data.detector_backend,
    similarity_metric: data.similarity_metric,
  };
}

export async function verifyAction(
  image: string,
  facialDb: Record<string, string>,
  options: {
    facialRecognitionModel: string;
    faceDetector: string;
    distanceMetric: string;
    antiSpoofing: boolean;
  }
) {
  for (const key in facialDb) {
    const targetEmbedding = facialDb[key];

    const requestBody = JSON.stringify({
      model_name: options.facialRecognitionModel,
      detector_backend: options.faceDetector,
      distance_metric: options.distanceMetric,
      align: true,
      img1_path: image,
      img2_path: targetEmbedding,
      enforce_detection: false,
      anti_spoofing: options.antiSpoofing,
    });

    const response = await fetch(`${serviceEndpoint}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    const data = await response.json();

    if (response.status !== 200) {
      console.error("验证请求失败:", {
        status: response.status,
        statusText: response.statusText,
        data: data,
      });
      throw new Error(
        `验证失败: ${response.status} ${response.statusText} - ${JSON.stringify(
          data
        )}`
      );
    }

    if (data.verified === true) {
      return { verified: true, identity: key };
    }
  }

  return { verified: false, identity: null };
}

export async function analyzeAction(
  image: string,
  options: {
    faceDetector: string;
    antiSpoofing: boolean;
  }
): Promise<FaceAPIAnalyzeResult[]> {
  const requestBody = JSON.stringify({
    detector_backend: options.faceDetector,
    align: false,
    img_path: image,
    enforce_detection: false,
    anti_spoofing: options.antiSpoofing,
  });

  const response = await fetch(`${serviceEndpoint}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: requestBody,
  });

  const data: FaceAPIAnalyzeResponse = await response.json();

  if (response.status !== 200) {
    console.error("分析请求失败:", {
      status: response.status,
      statusText: response.statusText,
      data: data,
    });
    throw new Error(
      `分析失败: ${response.status} ${response.statusText} - ${JSON.stringify(
        data
      )}`
    );
  }

  // 确保返回的是一个数组
  return data.results;
}

export async function extractFacesAction(
  image: string,
  options: {
    faceDetector: string;
    antiSpoofing: boolean;
  }
): Promise<FaceAPIExtractFacesResponse> {
  const response = await fetch(`${serviceEndpoint}/extract_faces`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      img_path: image,
      detector_backend: options.faceDetector,
      enforce_detection: false,
      align: true,
      expand_percentage: 0,
      anti_spoofing: options.antiSpoofing,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("提取人脸请求失败:", {
      status: response.status,
      statusText: response.statusText,
      data: errorData,
    });
    throw new Error(
      `提取人脸失败: ${response.status} ${
        response.statusText
      } - ${JSON.stringify(errorData)}`
    );
  }

  const data: FaceAPIExtractFacesResponse = await response.json();
  return data;
}
