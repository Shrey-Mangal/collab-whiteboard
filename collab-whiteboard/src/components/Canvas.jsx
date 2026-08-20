import { useRef, useState, useEffect, useCallback } from 'react'
import { useStorage, useMutation } from '@liveblocks/react/suspense'
import Toolbar from './Toolbar'

function Canvas() {
  const canvasRef = useRef(null)
  const isDrawingRef = useRef(false)
  const currentStrokeRef = useRef(null)
  const strokesRef = useRef([])
  const lastSizeRef = useRef({ width: 0, height: 0 })

  const strokes = useStorage((root) => root.strokes)
  const [color, setColor] = useState('#000000')
  const [size, setSize] = useState(3)

  const addStroke = useMutation(({ storage }, stroke) => {
    storage.get('strokes').push(stroke)
  }, [])

  const undoStroke = useMutation(({ storage }) => {
    const list = storage.get('strokes')
    if (list.length > 0) list.delete(list.length - 1)
  }, [])

  const clearStrokes = useMutation(({ storage }) => {
    storage.get('strokes').clear()
  }, [])

  const redrawAll = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

    strokesRef.current.forEach((stroke) => {
      if (stroke.points.length < 2) return
      ctx.beginPath()
      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.size
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
      stroke.points.slice(1).forEach((p) => ctx.lineTo(p.x, p.y))
      ctx.stroke()
    })
  }, [])

  useEffect(() => {
    strokesRef.current = strokes
    redrawAll()
  }, [strokes, redrawAll])

  const resizeCanvas = useCallback(() => {
    const width = window.innerWidth
    const height = window.innerHeight

    if (lastSizeRef.current.width === width && lastSizeRef.current.height === height) {
      return
    }
    lastSizeRef.current = { width, height }

    const canvas = canvasRef.current
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.getContext('2d').scale(dpr, dpr)
    redrawAll()
  }, [redrawAll])

  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [resizeCanvas])

  const getPoint = (e) => ({ x: e.clientX, y: e.clientY })

  const handlePointerDown = (e) => {
    isDrawingRef.current = true
    const point = getPoint(e)
    currentStrokeRef.current = {
      id: crypto.randomUUID(),
      color,
      size,
      points: [point],
    }
  }

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current) return
    const point = getPoint(e)
    const stroke = currentStrokeRef.current
    const prev = stroke.points[stroke.points.length - 1]
    stroke.points.push(point)

    const ctx = canvasRef.current.getContext('2d')
    ctx.beginPath()
    ctx.strokeStyle = stroke.color
    ctx.lineWidth = stroke.size
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.moveTo(prev.x, prev.y)
    ctx.lineTo(point.x, point.y)
    ctx.stroke()
  }

  const handlePointerUp = () => {
    if (!isDrawingRef.current) return
    isDrawingRef.current = false
    addStroke(currentStrokeRef.current)
    currentStrokeRef.current = null
  }

  const handleUndo = () => {
    undoStroke()
  }

  const handleClear = () => {
    clearStrokes()
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-screen h-screen touch-none bg-white"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
      <Toolbar
        color={color}
        onColorChange={setColor}
        size={size}
        onSizeChange={setSize}
        onUndo={handleUndo}
        onClear={handleClear}
        canUndo={strokes.length > 0}
      />
    </>
  )
}

export default Canvas