import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { IoClose, IoCloudUploadOutline } from "react-icons/io5"
import { LuImageUp } from "react-icons/lu"
import { useSteganoContext } from "../context/steganoContext"

export function ImagePicker() {
  const { image, setImage } = useSteganoContext()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      // read image data from file
      const reader = new FileReader()
      reader.onload = () => {
        const src = reader.result
        if (typeof src !== "string") return
        setImage(src)
      }
      reader.readAsDataURL(file)
    },
    [setImage]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg"],
    },
    maxFiles: 1,
  })

  return (
    <div className="w-full mx-auto max-w-2xl">
      {!image && (
        <p className="mb-5">
          Please select an image to start with. Either you want to hide a
          message or extract a message
        </p>
      )}
      <div className="w-full border-2 border-gray-600 border-dashed shadow-xl shadow-[#15152d] rounded-lg overflow-hidden">
        <div className="w-full relative">
          {image && (
            <IoClose
              className="absolute top-2 right-2 text-3xl cursor-pointer hover:bg-gray-600 p-1 rounded-full transition"
              onClick={(e) => {
                e.stopPropagation()
                setImage(undefined)
              }}
            />
          )}
          {image && (
            <img
              src={image || undefined}
              alt="selected image"
              className="w-full"
            />
          )}
        </div>
        <label
          htmlFor="dropzone-file"
          id="fileInputHolder"
          className={`flex flex-col items-center overflow-hidden justify-center relative w-full ${
            image ? "h-32" : "h-60"
          } cursor-pointer hover:bg-gray-900 bg-gray-800 transition`}
          {...getRootProps()}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isDragActive ? (
              <LuImageUp className="mb-3 text-gray-400 text-6xl animate-bounce" />
            ) : (
              <IoCloudUploadOutline className="mb-3 text-gray-400 text-6xl" />
            )}
            <p className="mb-2 text-base text-gray-500 dark:text-gray-400">
              {isDragActive ? (
                "Drop the file here"
              ) : !image ? (
                <>
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </>
              ) : (
                "Click or drag-n-drop to select a different image"
              )}
            </p>
            {!image && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ( Upload a JPEG or PNG image )
              </p>
            )}
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            {...getInputProps()}
          />
        </label>
      </div>
    </div>
  )
}
