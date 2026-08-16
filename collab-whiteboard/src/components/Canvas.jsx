import { useRef, useState, useEffect, useCallback } from 'react'
import Toolbar from './Toolbar'

function Canvas() {
  const canvasRef = useRef(null)
  const isDrawingRef = useRef(false)
  const currentStrokeRef = useRef(null)
  const strokesRef = useRef([])

  const [strokes, setStrokes] = useState([])
  const [color, setColor] = useState('#000000')
  const [size, setSize] = useState(3)

  const redrawAll = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    ctx.clearRect(0, 0, rect.width, rect.height)

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
    const canvas = canvasRef.current
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.getContext('2d').scale(dpr, dpr)
    redrawAll()
  }, [redrawAll])

  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [resizeCanvas])

  const getPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

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
    setStrokes((prev) => [...prev, currentStrokeRef.current])
    currentStrokeRef.current = null
  }

  const handleUndo = () => {
    setStrokes((prev) => prev.slice(0, -1))
  }

  const handleClear = () => {
    setStrokes([])
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 touch-none bg-white"
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