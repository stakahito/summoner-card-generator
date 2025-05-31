import { useState, useEffect } from "react";
import { Image } from "react-konva";

const URLImage = ({ src, x, y, width, height }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => setImage(img);
  }, [src]);

  return <Image image={image} x={x} y={y} width={width} height={height} />;
};

export default URLImage;
