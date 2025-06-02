// create a react context

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react"

type SteganoContextType = {
  image: string | undefined
  setImage: (image: string | undefined) => void
  operation: "ENCODE" | "DECODE" | null
  setOperation: (operation: "ENCODE" | "DECODE" | null) => void
  canvasRef: RefObject<HTMLCanvasElement | null> | null
  encodeAndDownload: () => void
}

const SteganoContext = createContext<SteganoContextType>({
  image: undefined,
  setImage: () => {},
  operation: null,
  setOperation: () => {},
  canvasRef: null,
  encodeAndDownload: () => {},
})

export function useSteganoContext() {
  return useContext(SteganoContext)
}

export default function SteganoContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const [image, setImage] = useState<string>()
  const [operation, setOperation] = useState<"ENCODE" | "DECODE" | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return
    const img = new Image()
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    if (image) {
      img.src = image
      img.onload = () => {
        if (canvasRef.current === null) return
        canvasRef.current.width = img.width
        canvasRef.current.height = img.height
        ctx.drawImage(img, 0, 0)
      }
    }
  }, [image, canvasRef])

  function encodeAndDownload() {
    encode()
    download()
  }
  function encode() {}
  function download() {}

  return (
    <SteganoContext.Provider
      value={{
        image,
        setImage,
        operation,
        setOperation,
        canvasRef,
        encodeAndDownload,
      }}
    >
      {children}
    </SteganoContext.Provider>
  )
}
