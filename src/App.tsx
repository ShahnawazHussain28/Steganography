import "./App.css"
import EncodeDecodeOption from "./components/encodeDecodeOption"
import { ImagePicker } from "./components/imagePicker"
import { useSteganoContext } from "./context/steganoContext"

function App() {
  const { image } = useSteganoContext()
  return (
    <div className="w-full flex justify-center bg-gradient-to-br from-[#26294c] to-[#15152d] min-h-screen p-3 lg:p-10">
      <main className="bg-[#1E1F3D] rounded-2xl shadow-xl p-3 lg:p-10 max-w-7xl w-full">
        <h1 className="col-span-full mb-8 text-3xl font-bold text-center text-gray-200">
          Image Steganography
        </h1>
        <div
          className={`w-full ${
            image ? "grid md:grid-cols-2 gap-5 lg:gap-10" : ""
          }`}
        >
          <ImagePicker />
          {image && <EncodeDecodeOption />}
        </div>
      </main>
    </div>
  )
}

export default App
