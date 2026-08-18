import { LiveList } from '@liveblocks/client'
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from '@liveblocks/react/suspense'
import Canvas from './components/Canvas'
import Cursors from './components/Cursors'

function App() {
  return (
    <LiveblocksProvider publicApiKey={import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY}>
      <RoomProvider
        id="collab-whiteboard-room"
        initialPresence={{ cursor: null }}
        initialStorage={{ strokes: new LiveList([]) }}
      >
        <ClientSideSuspense
          fallback={
            <div className="flex h-screen items-center justify-center text-gray-500">Connecting…</div>
          }
        >
          <Canvas />
          <Cursors />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  )
}

export default App