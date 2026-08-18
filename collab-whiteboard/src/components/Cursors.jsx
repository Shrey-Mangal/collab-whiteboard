import { useEffect } from 'react'
import { useOthers, useUpdateMyPresence } from '@liveblocks/react/suspense'

const CURSOR_COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ec4899']

function cursorColor(connectionId) {
  return CURSOR_COLORS[connectionId % CURSOR_COLORS.length]
}

function Cursors() {
  const others = useOthers()
  const updateMyPresence = useUpdateMyPresence()

  useEffect(() => {
    const handlePointerMove = (e) => {
      updateMyPresence({ cursor: { x: e.clientX, y: e.clientY } })
    }

    window.addEventListener('pointermove', handlePointerMove)
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [updateMyPresence])

  return (
    <>
      {others.map(({ connectionId, presence }) =>
        presence.cursor ? (
          <div
            key={connectionId}
            className="pointer-events-none fixed top-0 left-0 z-50"
            style={{ transform: `translate(${presence.cursor.x}px, ${presence.cursor.y}px)` }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M2 2L18 8L10 10L8 18L2 2Z"
                fill={cursorColor(connectionId)}
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        ) : null
      )}
    </>
  )
}

export default Cursors