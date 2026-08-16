const COLORS = ['#000000', '#ef4444', '#3b82f6', '#22c55e', '#eab308']
const SIZES = [2, 5, 10]

function Toolbar({ color, onColorChange, size, onSizeChange, onUndo, onClear, canUndo }) {
  return (
    <div className="fixed top-4 left-4 flex items-center gap-3 rounded-xl bg-white/90 backdrop-blur px-4 py-2 shadow-lg border border-gray-200">
      <div className="flex items-center gap-1">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => onColorChange(c)}
            className={`h-6 w-6 rounded-full border-2 ${color === c ? 'border-gray-800' : 'border-transparent'}`}
            style={{ backgroundColor: c }}
            aria-label={`Color ${c}`}
          />
        ))}
        <input
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="h-6 w-6 cursor-pointer rounded"
          aria-label="Custom color"
        />
      </div>

      <div className="h-6 w-px bg-gray-300" />

      <div className="flex items-center gap-1">
        {SIZES.map((s) => (
          <button
            key={s}
            onClick={() => onSizeChange(s)}
            className={`flex h-7 w-7 items-center justify-center rounded ${size === s ? 'bg-gray-200' : ''}`}
            aria-label={`Brush size ${s}`}
          >
            <span className="rounded-full bg-black" style={{ width: s + 2, height: s + 2 }} />
          </button>
        ))}
      </div>

      <div className="h-6 w-px bg-gray-300" />

      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="rounded px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
      >
        Undo
      </button>
      <button onClick={onClear} className="rounded px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50">
        Clear
      </button>
    </div>
  )
}

export default Toolbar