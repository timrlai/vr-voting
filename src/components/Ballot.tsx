import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useXRInputSourceState } from "@react-three/xr";
import { BookOpenCheck, ThumbsDown, ThumbsUp } from "@react-three/uikit-lucide";
import {
  type Object3D,
  type Mesh,
  type Material,
  Box3,
  DoubleSide,
  CanvasTexture,
  TextureLoader,
  Vector2,
  LoopOnce,
} from "three";

import ballotFront from "/models/ballot_front.webp";
import ballotBack from "/models/ballot_back.webp";

type BallotProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  onDragged?: (box: Box3) => void;
  onOpened?: () => void;
  onConfirmed?: () => void;
};

type MaterialWithMap = Material & {
  map: { needsUpdate: boolean };
};

export default function Ballot({
  position = [0, 0, 1],
  rotation = [0, 0, 0],
  scale = 1,
  onDragged,
  onOpened,
  onConfirmed,
}: BallotProps) {
  const groupRef = useRef<Object3D>(null);
  const ballotRef = useRef<Object3D>(null);
  const { scene: ballotModel, animations } = useGLTF("/models/ballot.gltf");
  const { actions, names } = useAnimations(animations, ballotRef);
  const { scene } = useThree();
  const rightController = useXRInputSourceState("controller", "right");
  const frontCanvas = useRef<HTMLCanvasElement>(null);
  const frontCtx = useRef<CanvasRenderingContext2D>(null);
  const frontTexture = useRef<CanvasTexture>(null);
  const prevUV = useRef<Vector2 | null>(null);
  const boundingBox = useRef<Box3>(null);
  const [isFolded, setIsFolded] = useState(true);
  const [isGrabbed, setIsGrabbed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const ballotWidth = 2400;
  const ballotHeight = 1108;

  useEffect(() => {
    if (frontCanvas.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = ballotWidth;
    canvas.height = ballotHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const texture = new CanvasTexture(canvas);
    texture.flipY = true;

    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    frontCanvas.current = canvas;
    frontCtx.current = ctx;
    frontTexture.current = texture;

    const img = new Image();
    img.src = ballotFront;
    img.onload = () => {
      ctx.save();
      ctx.translate(0, canvas.height);
      ctx.scale(1, -1);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.restore();
      texture.needsUpdate = true;
    };
  }, [frontCanvas, frontCtx, frontTexture]);

  useEffect(() => {
    if (!ballotModel || !frontTexture.current) return;

    ballotModel.traverse((object) => {
      if ((object as Mesh).isMesh && frontTexture.current) {
        const mesh = object as Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const material = mesh.material as MaterialWithMap;
        material.side = DoubleSide;

        if (material.name === "Front") {
          material.map = frontTexture.current;
        } else if (material.name === "Back") {
          const backTexture = new TextureLoader().load(ballotBack);
          backTexture.flipY = false;
          material.map = backTexture;
        }
        material.needsUpdate = true;
      }
    });
  }, [ballotModel, frontTexture]);

  const drawOnUV = (uv: Vector2, prevUV: Vector2) => {
    if (
      frontCanvas?.current?.width &&
      frontCanvas?.current?.height &&
      frontCtx?.current &&
      frontTexture.current
    ) {
      const x = uv.x * frontCanvas.current.width;
      const y = (1 - uv.y) * frontCanvas?.current?.height;

      if (isDrawing) {
        const prevX = prevUV.x * frontCanvas.current.width;
        const prevY = (1 - prevUV.y) * frontCanvas?.current?.height;
        frontCtx.current.quadraticCurveTo(prevX, prevY, x, y);
        frontCtx.current.stroke();
      } else {
        frontCtx.current.beginPath();
        frontCtx.current.moveTo(x, y);
        frontCtx.current.arc(x, y, 10, 0, Math.PI * 2);
        frontCtx.current.fill();
      }

      frontTexture.current.needsUpdate = true;
    }
  };

  const drawOnBallot = (event: ThreeEvent<PointerEvent>) => {
    if (event.uv) {
      prevUV.current = event.uv;
      if (prevUV) {
        drawOnUV(event.uv, prevUV.current);
      }
    }
  };

  const grabBallot = () => {
    if (groupRef.current && rightController?.object) {
      rightController.object.attach(groupRef.current);
      setIsGrabbed(true);
    }
  };

  const releaseBallot = () => {
    if (isGrabbed && groupRef.current) {
      scene.attach(groupRef.current);
      setIsGrabbed(false);
    }
  };

  const onPointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (!isFolded && !isDrawing) {
      setIsDrawing(true);
      drawOnBallot(event);
    } else {
      grabBallot();
    }
  };

  const onPointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!isFolded && isDrawing) {
      drawOnBallot(event);
    }
  };

  const onPointerUp = () => {
    if (!isFolded && isDrawing) {
      setIsDrawing(false);
    } else {
      releaseBallot();
    }
  };

  const foldBallot = () => {
    const actionName = names[0];
    const action = actions[actionName];
    if (action) {
      action.reset();
      // eslint-disable-next-line
      action.timeScale = 1;
      action.time = 0;
      action.setLoop(LoopOnce, 1);
      action.clampWhenFinished = true;
      action.play();
      setIsFolded(true);
    }
  };

  const openBallot = () => {
    const actionName = names[0];
    const action = actions[actionName];
    if (action) {
      action.reset();
      // eslint-disable-next-line
      action.timeScale = -1;
      action.time = action.getClip().duration;
      action.setLoop(LoopOnce, 1);
      action.clampWhenFinished = true;
      action.play();
      setIsFolded(false);
      if (onOpened) onOpened();
    }
  };

  const clearBallot = () => {
    const img = new Image();
    img.src = ballotFront;
    img.onload = () => {
      if (frontCtx.current && frontCanvas.current && frontTexture.current) {
        frontCtx.current.save();
        frontCtx.current.translate(0, frontCanvas.current.height);
        frontCtx.current.scale(1, -1);
        frontCtx.current.drawImage(
          img,
          0,
          0,
          frontCanvas.current.width,
          frontCanvas.current.height,
        );
        frontCtx.current.restore();
        frontTexture.current.needsUpdate = true;
      }
    };
  };

  const onCancel = () => {
    clearBallot();
  };

  const onConfirm = () => {
    foldBallot();
    setIsConfirmed(true);
    if (onConfirmed) onConfirmed();
  };

  useEffect(() => {
    const actionName = names[0];
    const action = actions[actionName];
    if (action) {
      action.reset();
      // eslint-disable-next-line
      action.timeScale = 1;
      action.time = 0;
      action.setLoop(LoopOnce, 1);
      action.clampWhenFinished = true;
      action.play();
    }
  }, [names, actions]);

  useLayoutEffect(() => {
    if (!ballotRef.current) return;

    const mesh = ballotRef.current.getObjectByProperty("isMesh", true) as Mesh;

    if (mesh && mesh?.geometry?.boundingBox) {
      mesh.geometry.computeBoundingBox();
      boundingBox.current = mesh.geometry.boundingBox.clone();
    }
  }, []);

  useFrame(() => {
    if (isGrabbed && groupRef.current && boundingBox.current && onDragged) {
      const box = boundingBox.current.clone();
      box.applyMatrix4(groupRef.current.matrixWorld);
      onDragged(box);
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive
        ref={ballotRef}
        object={ballotModel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      />
      {isFolded && !isConfirmed && (
        <group>
          <mesh
            position={[1, -0.3, 0]}
            rotation={[1.6, 0, 0]}
            onClick={openBallot}
          >
            <cylinderGeometry args={[0.2, 0.2, 0.1]} />
            <meshStandardMaterial color="blue" />
          </mesh>

          <group position={[0.95, -0.3, 0.1]} onClick={openBallot}>
            <BookOpenCheck height={24} width={24} color="white" />
          </group>
        </group>
      )}
      {!isFolded && !isConfirmed && (
        <group>
          <mesh
            position={[1, -0.3, 0]}
            rotation={[1.6, 0, 0]}
            onClick={onCancel}
          >
            <cylinderGeometry args={[0.2, 0.2, 0.1]} />
            <meshStandardMaterial color="red" />
          </mesh>

          <group position={[0.95, -0.3, 0.1]} onClick={onCancel}>
            <ThumbsDown height={24} width={24} color="white" />
          </group>

          <mesh
            position={[1.5, -0.3, 0]}
            rotation={[1.6, 0, 0]}
            onClick={onConfirm}
          >
            <cylinderGeometry args={[0.2, 0.2, 0.1]} />
            <meshStandardMaterial color="green" />
          </mesh>

          <group position={[1.45, -0.28, 0.1]} onClick={onConfirm}>
            <ThumbsUp height={24} width={24} color="white" />
          </group>
        </group>
      )}
    </group>
  );
}
