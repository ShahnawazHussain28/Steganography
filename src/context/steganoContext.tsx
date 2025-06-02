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
  encodeAndDownload: (message: string) => void
  decode: () => void
  outputMessage: string
}

const SteganoContext = createContext<SteganoContextType>({
  image: undefined,
  setImage: () => {},
  operation: null,
  setOperation: () => {},
  canvasRef: null,
  encodeAndDownload: () => {},
  decode: () => {},
  outputMessage: "",
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
  const [outputMessage, setOutputMessage] = useState<string>("")
  const [depth] = useState(1)
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

  function encodeAndDownload(message: string) {
    encode(message)
    download()
  }
  function encode(message: string) {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return
    const img = ctx.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    ).data

    let messageBits = message
      .split("")
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
      .join("")

    const prefixLen = message.length.toString(2).padStart(24, "0")
    messageBits = prefixLen + messageBits

    let index = 0

    for (let j = 0; j < canvasRef.current.height; j++) {
      for (let i = 0; i < canvasRef.current.width; i++) {
        if (index >= messageBits.length) break
        const idx = (j * canvasRef.current.width + i) * 4

        const r = img[idx + 0]
        const g = img[idx + 1]
        const b = img[idx + 2]
        const binR = r.toString(2)
        const binG = g.toString(2)
        const binB = b.toString(2)
        const newR =
          binR.slice(0, binR.length - depth) + messageBits.charAt(index)
        const newG =
          binG.slice(0, binG.length - depth) + messageBits.charAt(index + 1)
        const newB =
          binB.slice(0, binB.length - depth) + messageBits.charAt(index + 2)
        img[idx + 0] = parseInt(newR, 2)
        img[idx + 1] = parseInt(newG, 2)
        img[idx + 2] = parseInt(newB, 2)
        index += 3
      }
    }
    ctx.putImageData(new ImageData(img, canvasRef.current.width), 0, 0)
  }

  function decode() {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return
    const img = ctx.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    ).data

    const headerLen = 8
    let lengthBits = ""
    for (let i = 0; i < headerLen * 4; i += 4) {
      const binR = img[i + 0].toString(2)
      const binG = img[i + 1].toString(2)
      const binB = img[i + 2].toString(2)
      lengthBits += binR[binR.length - depth]
      lengthBits += binG[binG.length - depth]
      lengthBits += binB[binB.length - depth]
    }
    const len = parseInt(lengthBits, 2)

    let bitString = ""

    for (let j = 0; j < canvasRef.current.height; j++) {
      for (let i = 0; i < canvasRef.current.width; i++) {
        if (bitString.length / 8 >= len) break
        const idx = (j * canvasRef.current.width + i) * 4
        if (idx < headerLen * 4) continue

        if (img[idx + 3] === 0) continue

        const binR = img[idx + 0].toString(2)
        bitString += binR[binR.length - depth]

        const binG = img[idx + 1].toString(2)
        bitString += binG[binG.length - depth]

        const binB = img[idx + 2].toString(2)
        bitString += binB[binB.length - depth]
      }
    }

    const chars = []
    for (let i = 0; i < bitString.length; i += 8) {
      const byte = bitString.slice(i, i + 8)
      const char = String.fromCharCode(parseInt(byte, 2))
      chars.push(char)
    }
    setOutputMessage(chars.join(""))
    bitString = ""
  }

  function download() {
    if (!canvasRef.current) return
    const extension = image?.split(";")[0].split("/")[1]
    const link = document.createElement("a")
    link.download = "stegano." + extension
    link.href = canvasRef.current.toDataURL("image/" + extension)
    link.click()
    link.remove()
  }

  return (
    <SteganoContext.Provider
      value={{
        image,
        setImage,
        operation,
        setOperation,
        canvasRef,
        encodeAndDownload,
        decode,
        outputMessage,
      }}
    >
      {children}
    </SteganoContext.Provider>
  )
}
