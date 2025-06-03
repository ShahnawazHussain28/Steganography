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

import Crypto from "crypto-js"

type SteganoContextType = {
  image: string | undefined
  setImage: (image: string | undefined) => void
  operation: "ENCODE" | "DECODE" | null
  setOperation: (operation: "ENCODE" | "DECODE" | null) => void
  canvasRef: RefObject<HTMLCanvasElement | null> | null
  encodeAndDownload: (message: string, password?: string) => void
  decode: (password?: string) => void
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
  const HEADER_LENGTH = 24

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

  function encodeAndDownload(message: string, password?: string) {
    encode(message, password)
    download()
  }
  function encode(message: string, password?: string) {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return
    const img = ctx.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    ).data

    if (password) {
      message = Crypto.AES.encrypt(message, password).toString()
    }

    let messageBits = message
      .split("")
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
      .join("")

    const prefixLen = message.length.toString(2).padStart(HEADER_LENGTH, "0")
    const passwordBit = password ? "1" : "0"
    console.log(messageBits)
    messageBits = prefixLen + passwordBit + messageBits
    console.log(messageBits)

    let bitsWritten = 0

    let i = 0
    while (bitsWritten < messageBits.length) {
      if (i % 4 === 3) {
        i++
        continue
      }
      const bin = img[i].toString(2)
      const newByte =
        bin.slice(0, bin.length - depth) + messageBits.charAt(bitsWritten)
      img[i] = parseInt(newByte, 2)
      bitsWritten++
      i++
    }
    ctx.putImageData(new ImageData(img, canvasRef.current.width), 0, 0)
  }

  function decode(password?: string) {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return
    const img = ctx.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    ).data

    let lengthBits = ""
    let i = 0
    while (lengthBits.length < HEADER_LENGTH) {
      if (i % 4 === 3) {
        i++
        continue
      }
      const bit = img[i++].toString(2)
      lengthBits += bit[bit.length - depth]
    }
    const passwordByte = img[i % 4 === 3 ? i++ + 1 : i++].toString(2)
    i++
    const needPassword = passwordByte[passwordByte.length - depth] === "1"
    const len = parseInt(lengthBits, 2)
    console.log(len, needPassword)

    let bitString = ""

    while (bitString.length / 8 < len) {
      if (i % 4 === 3) {
        i++
        continue
      }
      const binR = img[i].toString(2)
      bitString += binR[binR.length - depth]
      i++
    }
    console.log(bitString)

    const chars = []
    for (let i = 0; i < bitString.length; i += 8) {
      const byte = bitString.slice(i, i + 8)
      const char = String.fromCharCode(parseInt(byte, 2))
      chars.push(char)
    }
    let message = chars.join("")
    console.log(message)

    if (needPassword) {
      message = Crypto.AES.decrypt(message, password || "").toString(
        Crypto.enc.Utf8
      )
      console.log(message)
    }
    setOutputMessage(message)
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
