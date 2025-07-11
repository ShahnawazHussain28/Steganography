import { useState } from "react"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"
import { useSteganoContext } from "../context/steganoContext"

export default function EncodeForm() {
  const [usePassword, setUsePassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  // random characters of length 25000
  const [message, setMessage] = useState(
    Array.from({ length: 25000 }, () =>
      String.fromCharCode(Math.floor(Math.random() * 95) + 32)
    ).join("")
  )
  const [password, setPassword] = useState("")
  const { setOperation, encodeAndDownload, maxCharacters } = useSteganoContext()

  return (
    <div className="w-full p-5">
      <textarea
        className="w-full p-2 three-d"
        id="message-input"
        placeholder={`Enter your secret message here (max ${maxCharacters} characters)...`}
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <div className="w-full flex justify-end">
        <p className="text-gray-400 mt-2">
          {message.length} / {maxCharacters} characters
        </p>
      </div>
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
            placeholder="Enter the password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
      <div className="flex justify-between items-center mt-6 mb-3">
        <button
          id="encode"
          onClick={() => encodeAndDownload(message, password || undefined)}
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
  )
}
