"use client";

import { useState } from "react";

export default function useFaceCapture() {
  const [images, setImages] = useState([]);
  return { images, setImages };
}