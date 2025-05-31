// create a react context

import { createContext, useContext, useState, type ReactNode } from "react"

type SteganoContextType = {
  image: string | undefined
  setImage: (image: string | undefined) => void
  operation: "ENCODE" | "DECODE" | null
  setOperation: (operation: "ENCODE" | "DECODE" | null) => void
}

const SteganoContext = createContext<SteganoContextType>({
  image: undefined,
  setImage: () => {},
  operation: null,
  setOperation: () => {},
})

export function useSteganoContext() {
  return useContext(SteganoContext)
}

export default function SteganoContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const [image, setImage] = useState<string | undefined>(undefined)
  const [operation, setOperation] = useState<"ENCODE" | "DECODE" | null>(null)
  return (
    <SteganoContext.Provider
      value={{ image, setImage, operation, setOperation }}
    >
      {children}
    </SteganoContext.Provider>
  )
}
