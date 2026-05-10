export function StudioLogo() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        lineHeight: 1,
        padding: '3px 4px 3px 0',
        userSelect: 'none',
      }}
    >
      <span
        style={{
          fontFamily: '"Georgia", "Times New Roman", serif',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.22em',
          color: '#1a1a1a',
          textTransform: 'uppercase',
        }}
      >
        LUXE
      </span>
      <span
        style={{
          fontFamily: '"Georgia", "Times New Roman", serif',
          fontSize: '7px',
          letterSpacing: '0.4em',
          color: '#d99a1b',
          fontWeight: 500,
          textTransform: 'uppercase',
          marginTop: '2px',
        }}
      >
        PARFUM
      </span>
    </div>
  )
}
