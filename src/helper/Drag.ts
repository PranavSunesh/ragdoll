import { createRef, useCallback, useEffect, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { usePointToPointConstraint, useSphere } from '@react-three/cannon'
import { Vector3, Object3D } from 'three'


export const cursor: RefObject<Object3D | null> = createRef()


let grabbingPointerId: number | undefined
const grabbedPosition = new Vector3()


interface DragConstraintHandlers {
  onPointerUp: (e: ThreeEvent<PointerEvent>) => void
  onPointerMove: (e: ThreeEvent<PointerEvent>) => void
  onPointerDown: (e: ThreeEvent<PointerEvent>) => void
}


export function useDragConstraint(child: RefObject<Object3D | null>): DragConstraintHandlers {
  const [, , api] = usePointToPointConstraint(cursor, child, { 
    pivotA: [0, 0, 0], 
    pivotB: [0, 0, 0] 
  })
  
  useEffect(() => {
    api.disable()
  }, [api])
  
  const onPointerUp = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (grabbingPointerId == null) {
      return
    }
    grabbingPointerId = undefined
    document.body.style.cursor = 'grab'
    
    try {
      const target = (e.nativeEvent?.target || e.target) as Element
      if (target && 'releasePointerCapture' in target) {
        target.releasePointerCapture(e.pointerId)
      }
    } catch (err) {
    }
    
    api.disable()
  }, [api])
  
  const onPointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (grabbingPointerId != null) {
      return
    }
    grabbingPointerId = e.pointerId
    grabbedPosition.copy(e.point)
    document.body.style.cursor = 'grabbing'
    e.stopPropagation()
    
    try {
      const target = (e.nativeEvent?.target || e.target) as Element
      if (target && 'setPointerCapture' in target) {
        target.setPointerCapture(e.pointerId)
      }
    } catch (err) {
    }
    
    api.enable()
  }, [api])
  
  const onPointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (grabbingPointerId !== e.pointerId) {
      return
    }
    grabbedPosition.copy(e.point)
  }, [])
  
  return { onPointerUp, onPointerMove, onPointerDown }
}


export function Cursor(): null {
  const [, api] = useSphere(
    () => ({ 
      collisionFilterMask: 0, 
      type: 'Kinematic', 
      mass: 0, 
      args: [0.5] 
    }), 
    cursor
  )
  
  useFrame(() => {
    if (grabbingPointerId == null) {
      return
    }
    api.position.set(grabbedPosition.x, grabbedPosition.y, grabbedPosition.z)
  })
  
  return null
}
