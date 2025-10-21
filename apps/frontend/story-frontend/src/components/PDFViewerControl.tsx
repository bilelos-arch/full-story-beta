"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import "pdfjs-dist/web/pdf_viewer.css"

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

interface PDFViewerControlProps {
  pdfFile: File
}

const PDFViewerControl: React.FC<PDFViewerControlProps> = ({ pdfFile }) => {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [inputPage, setInputPage] = useState<string>("1")
  const [fileUrl, setFileUrl] = useState<string | null>(null)

  useEffect(() => {
    if (pdfFile) {
      try {
        const url = URL.createObjectURL(pdfFile)
        setFileUrl(url)
        console.log("[v0] PDF file URL created:", url)

        return () => {
          URL.revokeObjectURL(url)
          console.log("[v0] PDF file URL revoked")
        }
      } catch (err) {
        console.error("[v0] Error creating object URL:", err)
        setError("Erreur lors de la préparation du fichier PDF")
        setLoading(false)
      }
    }
  }, [pdfFile])

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    console.log("[v0] PDF loaded successfully with", numPages, "pages")
    setNumPages(numPages)
    setLoading(false)
    setError(null)
  }, [])

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error("[v0] PDF load error:", error)
    setError("Erreur lors du chargement du PDF. Veuillez vérifier que le fichier est un PDF valide.")
    setLoading(false)
  }, [])

  const handlePrevious = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1)
      setInputPage((pageNumber - 1).toString())
    }
  }

  const handleNext = () => {
    if (numPages && pageNumber < numPages) {
      setPageNumber(pageNumber + 1)
      setInputPage((pageNumber + 1).toString())
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value)
  }

  const handlePageJump = () => {
    const page = Number.parseInt(inputPage, 10)
    if (numPages && page >= 1 && page <= numPages) {
      setPageNumber(page)
    } else {
      setInputPage(pageNumber.toString())
    }
  }

  if (!fileUrl) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Préparation du fichier PDF...</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Chargement du PDF...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-600 text-center">
          <p className="font-semibold mb-2">Erreur</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* PDF Display */}
      <div className="border rounded-lg overflow-hidden mb-4 bg-white">
        <div className="flex justify-center bg-gray-50 p-4">
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<div className="text-gray-600">Chargement du PDF...</div>}
            error={<div className="text-red-600">Erreur lors du chargement du PDF</div>}
          >
            <Page
              pageNumber={pageNumber}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="shadow-sm"
              width={Math.min(600, window.innerWidth - 40)}
            />
          </Document>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center space-x-4 p-4 bg-gray-100 rounded-lg">
        <button
          onClick={handlePrevious}
          disabled={pageNumber <= 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600"
        >
          Précédent
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-sm">Page</span>
          <input
            type="number"
            min="1"
            max={numPages || 1}
            value={inputPage}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handlePageJump()
              }
            }}
            className="w-16 px-2 py-1 border rounded text-center"
          />
          <span className="text-sm">sur {numPages}</span>
        </div>

        <button
          onClick={handleNext}
          disabled={!numPages || pageNumber >= numPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600"
        >
          Suivant
        </button>
      </div>
    </div>
  )
}

export default PDFViewerControl
