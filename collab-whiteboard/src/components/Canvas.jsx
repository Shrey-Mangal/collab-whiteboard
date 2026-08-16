import { useRef, useState, useEffect, useCallback } from 'react'

function Canvas() {
  const canvasRef = useRef(null)
  const isDrawingRef = useRef(false)
  const currentStrokeRef = useRef(null)
  const strokesRef = useRef([])

  const [strokes, setStrokes] = useState([])

  useEffect(() => {
    strokesRef.current = strokes
  }, [strokes])

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
      color: '#000000',
      size: 3,
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

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 touch-none bg-white"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    />
  )
}

export default Canvas