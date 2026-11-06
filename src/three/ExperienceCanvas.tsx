import { Component, type ErrorInfo, type ReactNode, Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { AdaptiveDpr, useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

type Props = {
  progress: React.MutableRefObject<number>
  reducedMotion: boolean
  darkMode: boolean
}

const scenes = [
  { url: '/models/optimized/old_book_sanskrit.glb', start: 0, end: 4 / 7, size: 3.45, rotation: [0.05, -0.08, 0], actionEnd: 0.26, fadeInEnd: 0, fadeOutStart: 0.98 },
  { url: '/models/optimized/stained_glass_sun_mandala.glb', start: 4 / 7, end: 1.01, size: 3.8, rotation: [0, 0, 0], actionEnd: 0.78, fadeInEnd: 0.12, fadeOutStart: 1 },
  { url: '/models/optimized/lord_krishna_divine_warrior_form.glb', start: 0.36, end: 0.52, size: 2.8, rotation: [0, -0.3, 0], actionEnd: 0.78, fadeInEnd: 0.12, fadeOutStart: 0.88 },
  { url: '/models/optimized/nandi_bull.glb', start: 0.51, end: 0.67, size: 3.7, rotation: [0.04, -0.18, 0], actionEnd: 0.8, fadeInEnd: 0.1, fadeOutStart: 0.82 },
  { url: '/models/optimized/ganapati__ganesha.glb', start: 0.65, end: 0.95, size: 2.65, rotation: [0, -0.12, 0], actionEnd: 0.8, fadeInEnd: 0.08, fadeOutStart: 0.92 },
  { url: '/models/optimized/hindu_god_spear.glb', start: 0.9, end: 1.01, size: 2.7, rotation: [0, 0, 0], actionEnd: 0.82, fadeInEnd: 0.12, fadeOutStart: 1 },
] as const

function smoothstep(edge0: number, edge1: number, value: number) {
  const x = THREE.MathUtils.clamp((value - edge0) / (edge1 - edge0), 0, 1)
  return x * x * (3 - 2 * x)
}

function useGoldenAuraTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
    grad.addColorStop(0, 'rgba(255, 252, 230, 0.98)')
    grad.addColorStop(0.18, 'rgba(255, 215, 64, 0.88)')
    grad.addColorStop(0.38, 'rgba(245, 160, 20, 0.55)')
    grad.addColorStop(0.62, 'rgba(217, 119, 6, 0.22)')
    grad.addColorStop(0.85, 'rgba(180, 83, 9, 0.06)')
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 512, 512)

    ctx.save()
    ctx.translate(256, 256)
    for (let i = 0; i < 24; i++) {
      const angle = (i * Math.PI) / 12
      ctx.rotate(angle)
      const rayGrad = ctx.createLinearGradient(0, 0, 240, 0)
      rayGrad.addColorStop(0, 'rgba(255, 240, 150, 0.4)')
      rayGrad.addColorStop(0.6, 'rgba(245, 180, 30, 0.15)')
      rayGrad.addColorStop(1, 'rgba(245, 180, 30, 0)')
      ctx.fillStyle = rayGrad
      ctx.beginPath()
      ctx.moveTo(0, -3)
      ctx.lineTo(240, 0)
      ctx.lineTo(0, 3)
      ctx.closePath()
      ctx.fill()
      ctx.rotate(-angle)
    }
    ctx.restore()

    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }, [])
}

function GanapatiDivineGlow({ progress, definition }: { progress: Props['progress']; definition: typeof scenes[number] }) {
  const auraTexture = useGoldenAuraTexture()
  const haloRef = useRef<THREE.Mesh>(null)
  const outerHaloRef = useRef<THREE.Mesh>(null)
  const backLightRef = useRef<THREE.PointLight>(null)
  const flashLightRef = useRef<THREE.PointLight>(null)

  useFrame((state) => {
    const p = progress.current
    const local = THREE.MathUtils.clamp((p - definition.start) / (definition.end - definition.start), 0, 1)
    const fadeIn = smoothstep(0, definition.fadeInEnd, local)
    const fadeOut = definition.fadeOutStart >= 1 ? 1 : 1 - smoothstep(definition.fadeOutStart, 1, local)
    const visibility = Math.min(fadeIn, fadeOut)

    const t = state.clock.elapsedTime
    const pulse = 1 + Math.sin(t * 2.8) * 0.08 + Math.sin(t * 5.6) * 0.04
    const flash = Math.max(0, Math.sin(t * 1.5)) ** 6 * 26

    if (haloRef.current) {
      haloRef.current.rotation.z = t * 0.12
      haloRef.current.scale.setScalar(3.4 * pulse)
      const mat = haloRef.current.material as THREE.MeshBasicMaterial
      if (mat) mat.opacity = 0.82 * visibility
      haloRef.current.visible = visibility > 0.003
    }
    if (outerHaloRef.current) {
      outerHaloRef.current.rotation.z = -t * 0.06
      outerHaloRef.current.scale.setScalar(4.5 * (1 + Math.sin(t * 1.9) * 0.06))
      const mat = outerHaloRef.current.material as THREE.MeshBasicMaterial
      if (mat) mat.opacity = 0.48 * visibility
      outerHaloRef.current.visible = visibility > 0.003
    }
    if (backLightRef.current) {
      backLightRef.current.intensity = (40 + flash) * visibility
    }
    if (flashLightRef.current) {
      flashLightRef.current.intensity = (25 + flash * 0.6) * visibility
    }
  })

  if (!auraTexture) return null

  return (
    <group position={[0, 0.28, -0.9]}>
      {/* Intense Golden Back Lights positioned well behind Ganapati */}
      <pointLight ref={backLightRef} position={[0, 0.2, -0.6]} intensity={40} color="#FFB800" distance={14} decay={1.8} />
      <pointLight ref={flashLightRef} position={[0, 0.6, -0.2]} intensity={25} color="#FFF2A8" distance={10} decay={1.9} />
      
      {/* Primary Radiant Golden Back Halo Disc */}
      <mesh ref={haloRef} renderOrder={0}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={auraTexture}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={true}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Secondary Outer Golden Aura Rays */}
      <mesh ref={outerHaloRef} position={[0, 0, -0.1]} renderOrder={0}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={auraTexture}
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={true}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

function SceneModel({ index, progress, reducedMotion }: { index: number; progress: Props['progress']; reducedMotion: boolean }) {
  const definition = scenes[index]
  const { scene, animations } = useGLTF(definition.url)
  const clone = useMemo(() => {
    const copy = scene.clone(true)
    const box = new THREE.Box3().setFromObject(copy)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const longest = Math.max(size.x, size.y, size.z) || 1
    const scale = definition.size / longest
    copy.scale.setScalar(scale)
    // Center in the model's scaled coordinate space. Some source files (notably
    // Ganapati) are authored far from the origin, so an unscaled offset puts the
    // geometry outside the camera frustum after scaling.
    copy.position.copy(center).multiplyScalar(-scale)
    if (index === 4) copy.position.z += 0.35
    copy.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true
        object.receiveShadow = true
        object.renderOrder = 10
        if (index === 5) {
          object.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#B88A34'),
            emissive: new THREE.Color('#241705'),
            emissiveIntensity: 0.18,
            roughness: 0.38,
            metalness: 0.68,
            transparent: true,
            depthWrite: true,
            depthTest: true,
            side: THREE.DoubleSide,
          })
        } else if (index === 4) {
          object.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#D69A3E'),
            roughness: 0.35,
            metalness: 0.65,
            transparent: true,
            depthWrite: true,
            depthTest: true,
            side: THREE.DoubleSide,
          })
        } else {
          const source = Array.isArray(object.material) ? object.material : [object.material]
          const materials = source.map((material) => {
            const cloned = material.clone()
            cloned.transparent = true
            cloned.depthWrite = true
            cloned.depthTest = true
            return cloned
          })
          object.material = Array.isArray(object.material) ? materials : materials[0]
        }
      }
    })
    return copy
  }, [scene, definition.size, index])
  const root = useRef<THREE.Group>(null)
  const { actions } = useAnimations(animations, clone)

  const isDragging = useRef(false)
  const previousPointer = useRef({ x: 0, y: 0 })
  const dragOffset = useRef({ x: 0, y: 0 })
  const dragRotation = useRef({ x: 0, y: 0, z: 0 })

  useEffect(() => {
    Object.values(actions).forEach((action) => {
      if (!action) return
      action.play()
      action.paused = true
    })
  }, [actions])

  useEffect(() => {
    if (index !== 1) return

    const onPointerDown = (e: PointerEvent) => {
      const p = progress.current
      if (p < definition.start - 0.04 || p > definition.end + 0.04) return
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'BUTTON' || target.tagName === 'A' || target.tagName === 'INPUT' || target.closest('button, a, input'))) {
        return
      }
      isDragging.current = true
      previousPointer.current = { x: e.clientX, y: e.clientY }
      document.body.style.cursor = 'grabbing'
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return
      const deltaX = e.clientX - previousPointer.current.x
      const deltaY = e.clientY - previousPointer.current.y
      previousPointer.current = { x: e.clientX, y: e.clientY }

      dragOffset.current.x += deltaX * 0.005
      dragOffset.current.y -= deltaY * 0.005
      dragRotation.current.z += deltaX * 0.015
      dragRotation.current.y += deltaX * 0.01
      dragRotation.current.x += deltaY * 0.01
    }

    const onPointerUp = () => {
      if (!isDragging.current) return
      isDragging.current = false
      document.body.style.cursor = ''
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)

    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      document.body.style.cursor = ''
    }
  }, [index, definition.start, definition.end, progress])

  const floatTime = useRef(0)

  useFrame((state, delta) => {
    if (!root.current) return
    const p = progress.current
    const local = THREE.MathUtils.clamp((p - definition.start) / (definition.end - definition.start), 0, 1)
    const actionProgress = smoothstep(0, definition.actionEnd, local)
    const motionProgress = index === 0 ? actionProgress : local
    const fadeIn = index === 0 ? 1 : smoothstep(0, definition.fadeInEnd, local)
    const fadeOut = definition.fadeOutStart >= 1 ? 1 : 1 - smoothstep(definition.fadeOutStart, 1, local)
    const visibility = Math.min(fadeIn, fadeOut)
    const yTarget = index === 2 ? -0.28 : index === 4 ? -0.1 : index === 5 ? -0.15 : 0
    const floating = index === 0 && !reducedMotion && p >= 1 / 7 && p < 4 / 7
    if (floating) floatTime.current += Math.min(delta, 0.05)
    else floatTime.current = 0
    const floatBlend = floating ? smoothstep(0, 2, floatTime.current) : 0
    const floatY = Math.sin(floatTime.current * 0.7) * 0.12 * floatBlend
    const sceneX = 0
    root.current.position.x = THREE.MathUtils.lerp(root.current.position.x, sceneX + (index === 1 ? dragOffset.current.x : 0), 0.04)
    root.current.position.y = THREE.MathUtils.lerp(root.current.position.y, yTarget + floatY + (0.5 - motionProgress) * 0.35 + (index === 1 ? dragOffset.current.y : 0), 0.04)
    root.current.position.z = THREE.MathUtils.lerp(root.current.position.z, visibility > 0.01 ? 0 : -8, 0.055)
    root.current.rotation.x = definition.rotation[0] + (index === 1 ? dragRotation.current.x : 0)
    if (index !== 1) {
      const rotationTravel = index === 3 ? 0.22 : index === 4 ? 0.16 : 0.55
      root.current.rotation.y = index === 5
        ? definition.rotation[1] + (reducedMotion ? 0 : state.clock.elapsedTime * 0.38)
        : definition.rotation[1] + (reducedMotion ? 0 : index === 0 ? actionProgress * 0.08 : local * rotationTravel)
      root.current.rotation.z = definition.rotation[2]
    }
    if (floating) {
      root.current.rotation.y += floatTime.current * 0.12 * floatBlend
      root.current.rotation.x += Math.sin(floatTime.current * 0.4) * 0.06 * floatBlend
      root.current.rotation.z += Math.sin(floatTime.current * 0.5) * 0.035 * floatBlend
    }
    root.current.visible = visibility > 0.003

    clone.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material) => { material.opacity = visibility })
      }
    })

    Object.values(actions).forEach((action) => {
      if (!action) return
      action.time = (action.getClip().duration || 1) * actionProgress
    })

    if (!reducedMotion && index === 1) {
      if (!isDragging.current) {
        dragOffset.current.x = THREE.MathUtils.lerp(dragOffset.current.x, 0, 0.05)
        dragOffset.current.y = THREE.MathUtils.lerp(dragOffset.current.y, 0, 0.05)
        dragRotation.current.x = THREE.MathUtils.lerp(dragRotation.current.x, 0, 0.05)
        dragRotation.current.y = THREE.MathUtils.lerp(dragRotation.current.y, 0, 0.05)
        dragRotation.current.z += delta * 0.45
      }
      root.current.rotation.z = dragRotation.current.z
      root.current.rotation.y = definition.rotation[1] + dragRotation.current.y + Math.sin(state.clock.elapsedTime * 0.6) * 0.08
    }
  })

  return (
    <group ref={root}>
      {index === 4 && <GanapatiDivineGlow progress={progress} definition={definition} />}
      <primitive object={clone} />
    </group>
  )
}

function Atmosphere({ progress, reducedMotion }: Pick<Props, 'progress' | 'reducedMotion'>) {
  const points = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const values = new Float32Array(270 * 3)
    let seed = 23
    const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
    for (let i = 0; i < values.length; i += 3) {
      values[i] = (random() - 0.5) * 13
      values[i + 1] = (random() - 0.5) * 8
      values[i + 2] = (random() - 0.5) * 7
    }
    return values
  }, [])
  useFrame((state) => {
    if (!points.current || reducedMotion) return
    points.current.rotation.y = state.clock.elapsedTime * 0.012
    points.current.position.y = Math.sin(state.clock.elapsedTime * 0.13) * 0.08
    const material = points.current.material as THREE.PointsMaterial
    material.color.lerpColors(new THREE.Color('#D6A84B'), new THREE.Color('#54D8E8'), smoothstep(0.62, 0.9, progress.current))
  })
  return (
    <points ref={points}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial size={0.018} color="#D6A84B" transparent opacity={0.56} sizeAttenuation depthWrite={false} />
    </points>
  )
}

function CameraDirector({ progress, reducedMotion }: Pick<Props, 'progress' | 'reducedMotion'>) {
  const { camera } = useThree()
  const pointer = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const move = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 0.12
      pointer.current.y = (event.clientY / window.innerHeight - 0.5) * 0.08
    }
    if (!reducedMotion && matchMedia('(pointer:fine)').matches) window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [reducedMotion])
  useFrame(() => {
    const p = progress.current
    const px = reducedMotion ? 0 : pointer.current.x
    const py = reducedMotion ? 0 : pointer.current.y
    const manuscriptLocal = THREE.MathUtils.clamp((p - scenes[0].start) / (scenes[0].end - scenes[0].start), 0, 1)
    const readingView = smoothstep(0.01, 0.22, manuscriptLocal) * (1 - smoothstep(0.85, 1, manuscriptLocal))
    
    const baseTravelX = px + Math.sin(p * Math.PI * 2) * 0.22
    const baseTravelY = py + 1.8 + Math.cos(p * Math.PI * 1.5) * 0.12
    const baseTravelZ = 4.8 - p * 0.35

    const topViewX = px * 0.3 + 0.15
    const topViewY = 4.9
    const topViewZ = 0.6

    const targetX = THREE.MathUtils.lerp(baseTravelX, topViewX, readingView)
    const targetY = THREE.MathUtils.lerp(baseTravelY, topViewY, readingView)
    const targetZ = THREE.MathUtils.lerp(baseTravelZ, topViewZ, readingView)

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05)
    camera.lookAt(targetX * 0.35, 0, 0)
  })
  return null
}

function Experience(props: Props) {
  const warm = new THREE.Color('#E88932')
  const cool = new THREE.Color('#54D8E8')
  const key = useRef<THREE.PointLight>(null)
  useFrame(() => {
    key.current?.color.lerpColors(warm, cool, smoothstep(0.62, 0.88, props.progress.current))
  })
  return (
    <>
      <fog attach="fog" args={[props.darkMode ? '#0b0e14' : '#e8dfcf', 7.5, 18]} />
      <ambientLight intensity={props.darkMode ? 1.35 : 2.2} color={props.darkMode ? '#c9c0ad' : '#fff3dc'} />
      <hemisphereLight args={[props.darkMode ? '#ddd4c2' : '#fff8e9', props.darkMode ? '#17120e' : '#6a4938', props.darkMode ? 1.7 : 2.6]} />
      <directionalLight position={[0, 8, 2]} intensity={props.darkMode ? 1.8 : 2.4} color={props.darkMode ? '#f2dfbd' : '#fffaf0'} />
      <pointLight ref={key} position={[3, 5, 4]} intensity={34} color="#E88932" />
      <pointLight position={[-4, 2, 4]} intensity={22} color="#54D8E8" />
      <CameraDirector progress={props.progress} reducedMotion={props.reducedMotion} />
      <Atmosphere progress={props.progress} reducedMotion={props.reducedMotion} />
      {scenes.map((_, index) => [2, 3, 4, 5].includes(index) ? null : (
        <Suspense key={index} fallback={null}>
          <SceneModel index={index} progress={props.progress} reducedMotion={props.reducedMotion} />
        </Suspense>
      ))}
      <AdaptiveDpr pixelated />
    </>
  )
}

class WebGLErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('WebGL experience unavailable', error, info) }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

export function ExperienceCanvas(props: Props) {
  return (
    <div className="canvas-layer">
      <WebGLErrorBoundary fallback={<div className="webgl-fallback"><span>सूत्र</span></div>}>
        <Canvas
          dpr={[1, 1.75]}
          camera={{ fov: 34, near: 0.1, far: 100, position: [0, 0, 5.2] }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          shadows
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping
            gl.toneMappingExposure = 1.28
            gl.outputColorSpace = THREE.SRGBColorSpace
            gl.domElement.setAttribute('role', 'img')
            gl.domElement.setAttribute('aria-label', 'A cinematic three-dimensional journey from a Sanskrit manuscript through sound, grammar and computational language networks.')
          }}
        >
          <Experience {...props} />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  )
}

useGLTF.preload('/models/optimized/old_book_sanskrit.glb')
useGLTF.preload('/models/optimized/stained_glass_sun_mandala.glb')



