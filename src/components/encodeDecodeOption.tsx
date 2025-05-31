import { useSteganoContext } from "../context/steganoContext"
import EncodeForm from "./encodeForm"
import DecodeForm from "./decodeForm"

export default function EncodeDecodeOption() {
  const { operation, setOperation } = useSteganoContext()

  return (
    <div
      className={`flex flex-col transition duration-200 rounded-lg ${
        operation ? "gap-5" : "lg:p-10 gap-5 lg:gap-10"
      }`}
    >
      <div
        className={`option-button grow ${operation === "ENCODE" && "active"} ${
          operation === "DECODE" && "grow-0"
        }`}
      >
        <button
          className={`w-full cursor-pointer transition-all p-3 text-xl font-bold glow ${
            !operation ? "min-h-full" : "min-h-[0px]"
          }`}
          id="encode"
          onClick={() => setOperation("ENCODE")}
        >
          Embed Message
        </button>
        {operation === "ENCODE" && <EncodeForm />}
      </div>
      <div
        className={`option-button grow ${operation === "DECODE" && "active"} ${
          operation === "ENCODE" && "grow-0"
        }`}
      >
        <button
          className={`w-full cursor-pointer transition-all p-3 text-xl font-bold glow ${
            !operation ? "min-h-full" : "min-h-none"
          }`}
          id="decode"
          onClick={() => setOperation("DECODE")}
        >
          Decode Message
        </button>
        {operation === "DECODE" && <DecodeForm />}
      </div>
    </div>
  )
}
