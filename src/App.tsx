import "./App.css"
import EncodeDecodeOption from "./components/encodeDecodeOption"
import { ImagePicker } from "./components/imagePicker"
import { useSteganoContext } from "./context/steganoContext"

function App() {
  const { image } = useSteganoContext()
  return (
    <div className="w-full flex justify-center bg-gradient-to-br from-[#26294c] to-[#15152d] min-h-screen p-10">
      <main className="bg-[#1E1F3D] rounded-2xl shadow-xl p-10 max-w-7xl w-full">
        <h1 className="col-span-full mb-8 text-3xl font-bold text-center text-gray-200">
          Image Steganography
        </h1>
        <div className={`w-full ${image ? "grid grid-cols-2 gap-10" : ""}`}>
          <ImagePicker />
          {image && <EncodeDecodeOption />}
          {/* <label
            htmlFor="messageInput"
            className="block font-medium text-gray-600"
          >
            Message to Embed:
          </label>
          <textarea
            id="messageInput"
            placeholder="Enter your secret message here..."
            maxLength={255}
            className="w-full p-2"
          ></textarea>

          <div>
            <button id="encode" className="btn btn-primary">
              Embed Message
            </button>
            <button id="downloadBtn" className="hidden btn btn-secondary">
              Download Image
            </button>
          </div>
        </div>

        <div className="w-full flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-700">
            2. View & Extract
          </h2>
          <div id="canvas-holder" className="w-full h-full">
            <canvas></canvas>
          </div>
          <button id="decode" className="w-fit btn btn-primary">
            Extract Message
          </button>
          <div id="extractedMessageOutput" className="message-box hidden"></div>
          <div id="statusMessage" className="hidden error-box"></div> */}
        </div>
      </main>
    </div>
  )
}

export default App
