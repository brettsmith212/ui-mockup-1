import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const codeString = String(children).replace(/\n$/, '')
            const isInline = !node || node.tagName !== 'pre'
            
            if (!isInline && match) {
              return (
                <div className="relative group">
                  <button
                    onClick={() => copyCode(codeString)}
                    className="absolute top-2 right-2 p-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    title="Copy code"
                  >
                    {copiedCode === codeString ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                  <SyntaxHighlighter
                    style={vscDarkPlus as any}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-md"
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              )
            }
            
            // Inline code
            return (
              <code
                className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            )
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400">
                {children}
              </blockquote>
            )
          },
          h1({ children }) {
            return (
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                {children}
              </h1>
            )
          },
          h2({ children }) {
            return (
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {children}
              </h2>
            )
          },
          h3({ children }) {
            return (
              <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">
                {children}
              </h3>
            )
          },
          p({ children }) {
            return (
              <p className="text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">
                {children}
              </p>
            )
          },
          ul({ children }) {
            return (
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-2 space-y-1">
                {children}
              </ul>
            )
          },
          ol({ children }) {
            return (
              <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 mb-2 space-y-1">
                {children}
              </ol>
            )
          },
          li({ children }) {
            return (
              <li className="text-gray-700 dark:text-gray-300">
                {children}
              </li>
            )
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                {children}
              </a>
            )
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-gray-200 dark:border-gray-700">
                  {children}
                </table>
              </div>
            )
          },
          th({ children }) {
            return (
              <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-gray-800 text-left font-medium text-gray-900 dark:text-gray-100">
                {children}
              </th>
            )
          },
          td({ children }) {
            return (
              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-gray-700 dark:text-gray-300">
                {children}
              </td>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
