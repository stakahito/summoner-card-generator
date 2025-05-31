import { Stage, Layer, Image as KonvaImage, Text, Circle, Group } from "react-konva";
import URLImage from "./URLImage";
import useImage from "use-image";
import { useState, useEffect, useRef } from "react";
import "./CardCanvas.css"

const layout = { 'name': { 'x': 495, 'y': 265, 'width': 787, 'height': 45 }, 'gender': { 'x': 1470, 'y': 265, 'width': 347, 'height': 45 }, 'rateAndHistory': { 'x': 538, 'y': 385, 'width': 647, 'height': 45 }, 'weekday': { 'x': 1465, 'y': 355, 'width': 350, 'height': 45 }, 'weekend': { 'x': 1465, 'y': 409, 'width': 350, 'height': 45 }, 'free': { 'x': 488, 'y': 760, 'width': 1329, 'height': 227 } };

const rolePositions = {
  TOP: { x: 375, y: 518 },
  JG: { x: 505, y: 518 },
  MID: { x: 630, y: 518 },
  ADC: { x: 770, y: 518 },
  SUP: { x: 925, y: 518 }
};

const vcPositions = {
  Discord: { x: 1300, y: 518 },
  "聞き専": { x: 1560, y: 518 },
  "なし": { x: 1745, y: 518 }
};


const getChampionIconUrl = (championName) =>
  `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${championName}.png`;

const CardCanvas = ({ formData, templateUrl, strokeColor }) => {
  const [templateImage] = useImage(templateUrl, "anonymous");
  const width = 1920;
  const height = 1080;
  const containerRef = useRef();
  const previewStageRef = useRef();  // プレビュー用
  const downloadStageRef = useRef(); // ダウンロード用

  const [scale, setScale] = useState(1);

  useEffect(() => {
    function handleResize() {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      setScale(containerWidth / width);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Canvas内容をコンポーネント化（両方で使い回し）
  const renderCardLayers = () => (
    <>
      {templateImage && <KonvaImage image={templateImage} width={width} height={height} />}

      <Text text={formData.name} {...layout.name} fontSize={layout.name.height} fontFamily="Mochiy Pop One" fill="#FFFFFF" stroke={strokeColor} strokeWidth={3} />
      <Text text={formData.gender} {...layout.gender} fontSize={layout.gender.height} fontFamily="Mochiy Pop One" fill="#FFFFFF" stroke={strokeColor} strokeWidth={3} />
      <Text text={formData.rankAndHistory} {...layout.rateAndHistory} fontSize={layout.rateAndHistory.height} fontFamily="Mochiy Pop One" fill="#FFFFFF" stroke={strokeColor} strokeWidth={3} />
      <Text text={formData.weekday} {...layout.weekday} fontSize={layout.weekday.height} fontFamily="Mochiy Pop One" fill="#FFFFFF" stroke={strokeColor} strokeWidth={3} />
      <Text text={formData.weekend} {...layout.weekend} fontSize={layout.weekend.height} fontFamily="Mochiy Pop One" fill="#FFFFFF" stroke={strokeColor} strokeWidth={3} />

      {formData.roles.map(role => (
        <Circle key={role} x={rolePositions[role].x} y={rolePositions[role].y} radius={35} stroke={strokeColor} strokeWidth={8} />
      ))}
      {vcPositions[formData.vc] && (
        <Circle x={vcPositions[formData.vc].x} y={vcPositions[formData.vc].y} radius={35} stroke={strokeColor} strokeWidth={8} />
      )}
      <Group x={480} y={595}>
        {formData.champions.map((champion, index) => (
          <URLImage
            key={champion}
            src={getChampionIconUrl(champion)}
            x={(index % 9) * 140}
            y={0}
            width={120}
            height={120}
          />
        ))}
      </Group>
      <Text
        text={formData.free}
        x={layout.free.x}
        y={layout.free.y}
        fontSize={45}
        fontFamily="Mochiy Pop One"
        fill="#FFFFFF"
        stroke={strokeColor}
        strokeWidth={3}
        width={layout.free.width}
        lineHeight={1.4}
      />
    </>
  );

  // ダウンロード用は等倍
  const handleDownload = () => {
    const uri = downloadStageRef.current.toDataURL({ pixelRatio: 1 });
    const link = document.createElement("a");
    link.download = "summoner-card.png";
    link.href = uri;
    link.click();
  };

  return (
    <>
      <div ref={containerRef} className="card-canvas-wrapper">
        <Stage width={width} height={height} scale={{ x: scale, y: scale }} ref={previewStageRef} className="card-canvas">
          <Layer>
            {renderCardLayers()}
          </Layer>
        </Stage>
        <Stage
          width={width}
          height={height}
          scale={{ x: 1, y: 1 }}
          ref={downloadStageRef}
          style={{ display: "none" }}
        >
          <Layer>
            {renderCardLayers()}
          </Layer>
        </Stage>
      </div>
      <button onClick={handleDownload} className="mt-4 px-6 py-2 rounded-full bg-green-400 text-white font-bold shadow hover:scale-105 transition">
        画像をダウンロード
      </button>
    </>
  );
};

export default CardCanvas;