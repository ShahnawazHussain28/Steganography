import "./App.css"

function App() {
  return (
    <div className="w-full flex justify-center bg-[#120d2a] min-h-screen p-10">
      <main className="bg-[#0c0922] rounded-2xl shadow-lg p-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
        <h1 className="col-span-full mb-4 text-3xl font-bold text-center text-gray-200">
          Image Steganography
        </h1>
        <div className="w-full flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-700">
            1. Prepare Image & Message
          </h2>

          <div
            id="imageUpload"
            className="flex items-center justify-center w-full"
          >
            <label
              htmlFor="dropzone-file"
              id="fileInputHolder"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
            </label>
          </div>

          <label
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
          <div id="canvas-holder" className="w-full h-full"></div>
          <button id="decode" className="w-fit btn btn-primary">
            Extract Message
          </button>
          <div id="extractedMessageOutput" className="message-box hidden"></div>
          <div id="statusMessage" className="hidden error-box"></div>
        </div>
      </main>
    </div>
  )
}

export default App
