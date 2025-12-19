
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { Physics, usePlane } from '@react-three/cannon'
import { createXRStore, noEvents, useXRControllerLocomotion, XR, XROrigin, PointerEvents } from '@react-three/xr'
import { useRef, Suspense } from 'react'
import { AntiRollBar } from './components/AntiRollBar'
import { Cursor } from './helper/Drag'

const store = createXRStore({
  hand: { touchPointer: false },
  secondaryInputSources: true,
  offerSession: 'immersive-vr',
})

export function App() {
  return (
    <>
      <button
        style={{
          position: 'absolute',
          zIndex: 10000,
          background: 'black',
          borderRadius: '0.5rem',
          border: 'none',
          fontWeight: 'bold',
          color: 'white',
          padding: '1rem 2rem',
          cursor: 'pointer',
          fontSize: '1.5rem',
          bottom: '1rem',
          left: '40%',
          boxShadow: '0px 0px 20px rgba(0,0,0,1)',
          transform: 'translate(-50%, 0)',
        }}
        onClick={() => store.enterVR()}
      >
        Enter VR
      </button>

      <button
        style={{
          position: 'absolute',
          zIndex: 10000,
          background: '#0066cc',
          borderRadius: '0.5rem',
          border: 'none',
          fontWeight: 'bold',
          color: 'white',
          padding: '1rem 2rem',
          cursor: 'pointer',
          fontSize: '1.5rem',
          bottom: '1rem',
          right: '40%',
          boxShadow: '0px 0px 20px rgba(0,0,0,1)',
        }}
        onClick={() => store.enterAR()}
      >
        Enter AR
      </button>
      <Canvas
        style={{
          width: "100vw",
          height: "100vh"
        }}
        onPointerMissed={() => console.log('missed')}
        dpr={[1, 2]}
        shadows
        events={noEvents}
        camera={{ position: [-40, 40, 40], fov: 25 }}
      >
        <PointerEvents />
        <OrbitControls />
        <XR store={store}>
          <color attach="background" args={['#fff']} />
          <Environment preset='city'/>
          <Suspense>
            <Physics allowSleep={false} iterations={15} gravity={[0, -200, 0]}>
              <Cursor />
              <Floor />
              <AntiRollBar />
            </Physics>
          </Suspense>
          <group position={[0, -5, 0]}>
            <ControlledXROrigin />
          </group>
        </XR>
      </Canvas>
    </>
  )
}

function ControlledXROrigin() {
  const ref = useRef(null)
  useXRControllerLocomotion(ref, { speed: 10 })
  return <XROrigin ref={ref} scale={10} />
}

function Floor() {
  const [ref] = usePlane(() => ({ 
    type: 'Static', 
    position: [0, -5, 0],
    rotation: [-Math.PI / 2, 0, 0] 
  }))
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial
        color="#878790"
      />
    </mesh>
  )
}
