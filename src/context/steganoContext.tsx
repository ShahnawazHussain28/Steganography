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
  maxCharacters: number
  requirePassword: boolean
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
  maxCharacters: 0,
  requirePassword: false,
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
  const [operation, setOperation] = useState<"ENCODE" | "DECODE" | null>(null)
  const [maxCharacters, setMaxCharacters] = useState(0)
  const [requirePassword, setRequirePassword] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const MAX_DEPTH = 3
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
        setMaxCharacters(
          Math.floor((img.width * img.height * 3 * MAX_DEPTH) / 8)
        )
        ctx.drawImage(img, 0, 0)
      }
    }
  }, [image, canvasRef])

  useEffect(() => {
    if (!canvasRef.current || operation !== "DECODE") return
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return
    const imgData = ctx.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    )
    const img = imgData.data
    const passwordBit = img[32] & 1
    setRequirePassword(passwordBit === 1)
  }, [operation, canvasRef, image])

  function encodeAndDownload(message: string, password?: string) {
    encode(message, password)
    download()
  }
  function encode(message: string, password?: string) {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    const imgData = ctx.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    )
    const img = imgData.data

    if (password) {
      message = Crypto.AES.encrypt(message, password).toString()
    }

    let messageBits = message
      .split("")
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
      .join("")

    const prefixLen = message.length.toString(2).padStart(HEADER_LENGTH, "0")
    const passwordBit = password ? "1" : "0"
    messageBits = prefixLen + passwordBit + messageBits

    let bitsWritten = 0
    let pixelIndex = 0
    let currentDepth = 1

    const embedBit = (
      byteValue: number,
      bitToEmbed: number,
      depth: number
    ): number => {
      const clearMask = ~(1 << (depth - 1))
      const clearedByte = byteValue & clearMask
      const newByte = clearedByte | (bitToEmbed << (depth - 1))
      return newByte
    }

    while (bitsWritten < messageBits.length) {
      if (pixelIndex >= img.length) {
        currentDepth++
        if (currentDepth > MAX_DEPTH) {
          console.error(
            "Not enough capacity in the image to encode the entire message even with multiple depths."
          )
          break
        }
        pixelIndex = 0
      }

      if (pixelIndex % 4 === 3) {
        pixelIndex++
        continue
      }

      const bitToEmbed = parseInt(messageBits.charAt(bitsWritten), 10)
      img[pixelIndex] = embedBit(img[pixelIndex], bitToEmbed, currentDepth)

      bitsWritten++
      pixelIndex++
    }

    ctx.putImageData(new ImageData(img, canvasRef.current.width), 0, 0)
  }

  function decode(password?: string) {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    const imgData = ctx.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    )
    const img = imgData.data // This is a Uint8ClampedArray

    let pixelIndex = 0
    let currentDepth = 1

    const getNextBit = (): string | null => {
      while (true) {
        if (pixelIndex >= img.length) {
          currentDepth++
          if (currentDepth > MAX_DEPTH) {
            console.error(
              "Decoding failed: Max depth reached. Not enough capacity to decode header/message."
            )
            return null
          }
          pixelIndex = 0
        }

        if (pixelIndex % 4 === 3) {
          pixelIndex++
          continue
        }

        const bit = (img[pixelIndex] >> (currentDepth - 1)) & 1
        pixelIndex++
        return bit.toString()
      }
    }

    let lengthBits = ""
    while (lengthBits.length < HEADER_LENGTH) {
      const bit = getNextBit()
      if (bit === null) {
        setOutputMessage(
          "Decoding failed: Not enough data to read message header."
        )
        return
      }
      lengthBits += bit
    }

    const passwordBit = getNextBit()
    if (passwordBit === null) {
      setOutputMessage(
        "Decoding failed: Not enough data to read password flag."
      )
      return
    }
    const needPassword = passwordBit === "1"

    const len = parseInt(lengthBits, 2)
    let bitString = ""

    while (bitString.length / 8 < len) {
      const bit = getNextBit()
      if (bit === null) {
        setOutputMessage(
          "Decoding failed: Not enough data to read full message content."
        )
        return
      }
      bitString += bit
    }

    const chars = []
    for (let j = 0; j < bitString.length; j += 8) {
      const byte = bitString.slice(j, j + 8)
      const char = String.fromCharCode(parseInt(byte, 2))
      chars.push(char)
    }
    let message = chars.join("")

    if (needPassword) {
      try {
        message = Crypto.AES.decrypt(message, password || "").toString(
          Crypto.enc.Utf8
        )
      } catch (e) {
        console.error("Decryption failed:", e)
        message = "Decryption Failed: Invalid password or corrupted data."
      }
    }
    setOutputMessage(message)
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
        maxCharacters,
        requirePassword,
      }}
    >
      {children}
    </SteganoContext.Provider>
  )
}
