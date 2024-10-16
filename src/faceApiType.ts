export interface FaceAPIAnalyzeResult {
  region: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  age: number;
  face_confidence: number;
  dominant_gender: "Man" | "Woman";
  gender: {
    Man: number;
    Woman: number;
  };
  dominant_emotion:
    | "sad"
    | "angry"
    | "surprise"
    | "fear"
    | "happy"
    | "disgust"
    | "neutral";
  emotion: {
    sad: number;
    angry: number;
    surprise: number;
    fear: number;
    happy: number;
    disgust: number;
    neutral: number;
  };
  dominant_race:
    | "indian"
    | "asian"
    | "latino hispanic"
    | "black"
    | "middle eastern"
    | "white";
  race: {
    indian: number;
    asian: number;
    "latino hispanic": number;
    black: number;
    "middle eastern": number;
    white: number;
  };
}

export type FaceAPIAnalyzeResponse = {
  results: FaceAPIAnalyzeResult[];
};

export interface FaceAPIExtractFacesResponse {
  results: Array<{
    face: number[][]; // 二维数组表示图像向量化数据
    facial_area: {
      x: number;
      y: number;
      w: number;
      h: number;
    };
    confidence?: number; // 可选字段,表示检测置信度
  }>;
  message?: string; // 可选字段,用于错误信息
}
