import { useCylinder } from "@react-three/cannon"
import { useDragConstraint } from "../helper/Drag"
import { SpotLight, useGLTF } from "@react-three/drei"

export function AntiRollBar() {
  const { scene } = useGLTF('/model/roll_bar.glb')
  const [cup] = useCylinder(() => ({
    mass: 1,
    args: [0.62, 0.62, 1.2, 16],
    linearDamping: 0.95,
    angularDamping: 0.95,
    position: [8, 3, 0],
  }))
  const bind = useDragConstraint(cup)
  return (
    <group ref={cup} {...bind} dispose={null}>
      <group rotation={[Math.PI / 2, 0, 0]} scale={[0.012, 0.012, 0.012]}>
        <primitive object={scene} />
      </group>  
    </group>
  )
}

export function Lamp() {
  return (
    <mesh position={[0, 15, 0]}>
      <cylinderGeometry args={[0.5, 1.5, 2, 32]} />
      <meshStandardMaterial />
      <SpotLight
        castShadow
        penumbra={0.2}
        radiusTop={0.4}
        radiusBottom={40}
        distance={80}
        angle={0.45}
        attenuation={20}
        anglePower={5}
        intensity={1}
        opacity={0.2}
      />
    </mesh>
  )
}