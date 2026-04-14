"use client";

import { useState } from "react";

export default function useCamera() {
  const [image, setImage] = useState(null);
  return { image, setImage };
}