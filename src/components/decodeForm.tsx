import { useState } from "react"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"
import { useSteganoContext } from "../context/steganoContext"

export default function DecodeForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { setOperation, decode, outputMessage, requirePassword } =
    useSteganoContext()
  const [password, setPassword] = useState("")

  return (
    <div className="p-4 w-full">
      {requirePassword && (
        <>
          <p>
            The message is encrypted with a password. Please enter the password
            below
          </p>
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
        </>
      )}
      <div className="flex justify-between items-center mt-6">
        <button
          id="decode"
          onClick={() => decode(password)}
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
      <div className="relative mb-5">
        <textarea
          className="w-full p-2 three-d mt-8"
          id="message-input"
          rows={4}
          disabled
          value={outputMessage}
          onClick={() => {
            navigator.clipboard.writeText(outputMessage)
          }}
        ></textarea>
      </div>
    </div>
  )
}
