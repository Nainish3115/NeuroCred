"use client"

import { useEffect } from "react"

export default function TopBar() {
  useEffect(() => {
    // Declare google type on window
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        { pageLanguage: "en" },
        "google_translate_element"
      )
    }

    const script = document.createElement("script")
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <div className="w-full flex justify-end px-4 py-2 bg-white shadow-md z-10">
      <div id="google_translate_element" className="text-sm scale-90" />

    </div>
  )
}
