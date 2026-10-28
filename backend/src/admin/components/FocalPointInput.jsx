import { useRef, useState } from 'react'
import { Field, Flex, TextButton, Typography } from '@strapi/design-system'
import { useForm } from '@strapi/strapi/admin'

// Proporción aproximada (ancho / alto) del encabezado de la página en cada pantalla
const FRAMES = [
  { label: 'Computadora', ratio: 5, color: '#4945ff' },
  { label: 'Celular', ratio: 1.5, color: '#ee5e52' },
]

const CENTER = { x: 50, y: 50 }

function getIn(values, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), values)
}

function clamp(value) {
  return Math.min(100, Math.max(0, Math.round(value)))
}

// Mismo cálculo que hace el navegador con background-size: cover y background-position: x% y%
function visibleBox(imageRatio, frameRatio, focus) {
  const width = imageRatio > frameRatio ? (frameRatio / imageRatio) * 100 : 100
  const height = imageRatio > frameRatio ? 100 : (imageRatio / frameRatio) * 100
  return {
    left: ((100 - width) * focus.x) / 100,
    top: ((100 - height) * focus.y) / 100,
    width,
    height,
  }
}

const FocalPointInput = ({ name, value, onChange, label, hint, error, required, disabled }) => {
  // El campo de la imagen se llama igual sin "Focus": imageFocus → image
  const imagePath = name.replace(/Focus$/, '')
  const image = useForm('FocalPointInput', (state) => getIn(state.values, imagePath))
  const [naturalRatio, setNaturalRatio] = useState(null)
  const dragging = useRef(false)

  const focus = value && typeof value.x === 'number' && typeof value.y === 'number' ? value : CENTER
  const imageRatio = naturalRatio || (image?.width && image?.height ? image.width / image.height : null)

  function setFocus(next) {
    onChange(name, { x: clamp(next.x), y: clamp(next.y) })
  }

  function focusFromPointer(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    setFocus({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    })
  }

  function handlePointerDown(event) {
    if (disabled) return
    dragging.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
    focusFromPointer(event)
  }

  function handlePointerMove(event) {
    if (dragging.current) focusFromPointer(event)
  }

  function handleKeyDown(event) {
    if (disabled) return
    const step = event.shiftKey ? 10 : 2
    const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }
    const move = moves[event.key]
    if (!move) return
    event.preventDefault()
    setFocus({ x: focus.x + move[0], y: focus.y + move[1] })
  }

  return (
    <Field.Root name={name} hint={hint} error={error} required={required}>
      <Field.Label>{label}</Field.Label>
      {!image ? (
        <Typography variant="pi" textColor="neutral600">
          Primero elige una imagen en el campo «{imagePath}» para marcar la parte que se verá.
        </Typography>
      ) : (
        <Flex direction="column" alignItems="flex-start" gap={2}>
          <div
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-label="Parte de la imagen que se verá"
            aria-valuetext={`${focus.x}% horizontal, ${focus.y}% vertical`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={() => (dragging.current = false)}
            onKeyDown={handleKeyDown}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 640,
              cursor: disabled ? 'default' : 'crosshair',
              touchAction: 'none',
              userSelect: 'none',
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <img
              src={image.url}
              alt=""
              draggable={false}
              onLoad={(event) => setNaturalRatio(event.currentTarget.naturalWidth / event.currentTarget.naturalHeight)}
              style={{ display: 'block', width: '100%' }}
            />
            {imageRatio &&
              FRAMES.map((frame) => {
                const box = visibleBox(imageRatio, frame.ratio, focus)
                return (
                  <div
                    key={frame.label}
                    style={{
                      position: 'absolute',
                      left: `${box.left}%`,
                      top: `${box.top}%`,
                      width: `${box.width}%`,
                      height: `${box.height}%`,
                      boxSizing: 'border-box',
                      border: `3px solid ${frame.color}`,
                      boxShadow: '0 0 0 1px rgb(255 255 255 / 70%)',
                      pointerEvents: 'none',
                    }}
                  />
                )
              })}
            <div
              style={{
                position: 'absolute',
                left: `${focus.x}%`,
                top: `${focus.y}%`,
                width: 14,
                height: 14,
                marginLeft: -7,
                marginTop: -7,
                borderRadius: '50%',
                border: '2px solid #fff',
                background: '#212134',
                pointerEvents: 'none',
              }}
            />
          </div>
          <Flex gap={4} wrap="wrap">
            {FRAMES.map((frame) => (
              <Flex key={frame.label} gap={2}>
                <span style={{ width: 14, height: 14, border: `3px solid ${frame.color}`, borderRadius: 2 }} />
                <Typography variant="pi">Se ve en {frame.label.toLowerCase()}</Typography>
              </Flex>
            ))}
            {!disabled && (
              <TextButton type="button" onClick={() => setFocus(CENTER)}>
                Centrar
              </TextButton>
            )}
          </Flex>
        </Flex>
      )}
      <Field.Hint />
      <Field.Error />
    </Field.Root>
  )
}

export default FocalPointInput
