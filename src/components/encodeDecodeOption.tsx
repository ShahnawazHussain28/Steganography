import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import { useSteganoContext } from "../context/steganoContext"
import { useState } from "react"

export default function EncodeDecodeOption() {
  const { operation, setOperation } = useSteganoContext()
  const [usePassword, setUsePassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [requirePassword, setRequirePassword] = useState(true)
  const [decodedText, setDecodedText] = useState("")

  return (
    <div
      className={`flex flex-col bg-[#191738] transition duration-200 rounded-lg ${
        operation ? "p-5 gap-5" : "p-10 gap-10"
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
        {operation === "ENCODE" && (
          <div className="w-full p-5">
            <textarea
              className="w-full p-2 three-d"
              id="message-input"
              placeholder="Enter your secret message here..."
              rows={4}
            ></textarea>
            <label
              htmlFor="use-password"
              className="flex items-center gap-2 mt-5 ml-2"
            >
              <input
                onChange={(e) => setUsePassword(e.target.checked)}
                type="checkbox"
                id="use-password"
                className="w-5 h-5"
              />
              <span>Use Password</span>
            </label>

            {usePassword && (
              <div className="w-full mt-4 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  maxLength={20}
                  className="p-2 pl-4 w-full three-d focus:outline-none"
                />
                {!showPassword ? (
                  <FaRegEye
                    onClick={() => setShowPassword(true)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 mr-4 text-2xl hover:text-gray-400 cursor-pointer transition"
                  />
                ) : (
                  <FaRegEyeSlash
                    onClick={() => setShowPassword(false)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 mr-4 text-2xl hover:text-gray-400 cursor-pointer transition"
                  />
                )}
              </div>
            )}
            <div className="flex justify-between items-center mt-6">
              <button
                id="encode"
                className="py-3 px-6 three-d cursor-pointer !bg-[#29265c] !rounded-full"
              >
                Encode and Download
              </button>
              <button
                onClick={() => setOperation(null)}
                className="mr-4 cursor-pointer hover:bg-red-500/50 py-2 px-4 rounded-full"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
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
        {operation === "DECODE" && (
          <div className="p-4">
            <p>
              The message is encrypted with a password. Please enter the
              password below
            </p>
            {requirePassword && (
              <div className="w-full mt-4 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  maxLength={20}
                  className="p-2 pl-4 w-full three-d focus:outline-none"
                  placeholder="Enter the password"
                />
                {!showPassword ? (
                  <FaRegEye
                    onClick={() => setShowPassword(true)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 mr-4 text-2xl hover:text-gray-400 cursor-pointer transition"
                  />
                ) : (
                  <FaRegEyeSlash
                    onClick={() => setShowPassword(false)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 mr-4 text-2xl hover:text-gray-400 cursor-pointer transition"
                  />
                )}
              </div>
            )}
            <div className="flex justify-between items-center mt-6">
              <button
                id="encode"
                className="py-3 px-6 three-d cursor-pointer !bg-[#29265c] !rounded-full"
              >
                Decode Message
              </button>
              <button
                onClick={() => setOperation(null)}
                className="mr-4 cursor-pointer hover:bg-red-500/50 py-2 px-4 rounded-full"
              >
                Start Over
              </button>
            </div>
            <div className="relative">
              <textarea
                className="w-full p-2 three-d mt-8"
                id="message-input"
                rows={4}
                disabled
                value={decodedText}
                onClick={(e) => {
                  navigator.clipboard.writeText(decodedText)
                }}
              ></textarea>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
