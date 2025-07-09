"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    google: any
    googleTranslateElementInit: () => void
  }
}

export const GoogleTranslate = () => {
  useEffect(() => {
    const addScript = () => {
      const script = document.createElement("script")
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      script.async = true
      document.body.appendChild(script)

      // @ts-ignore
      window.googleTranslateElementInit = () => {
        // @ts-ignore
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages:
              "en,hi,bn,te,mr,ta,gu,kn,ml,or,pa,as,ur,sd,ne,si,sa",
            layout:
              window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          "google_translate_element"
        )
      }
    }

    addScript()
  }, [])

  return (
    <div className="absolute top-4 right-4 z-50">
      <div className="translate-container">
        <div id="google_translate_element" />
      </div>
    </div>
  )
}
