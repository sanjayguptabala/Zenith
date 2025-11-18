import React, { useMemo } from 'react';
import { marked } from 'marked';

// Basic styling for rendered markdown
const markdownStyles = `
  .markdown-content ul, .markdown-content ol {
    list-style-position: inside;
    padding-left: 1.5rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .markdown-content li {
    margin-bottom: 0.25rem;
  }
  .markdown-content p {
    margin-bottom: 0.5rem;
  }
  .markdown-content a {
    color: #4A90E2;
    text-decoration: underline;
  }
  .markdown-content a:hover {
    color: #357ABD;
  }
  .markdown-content strong {
    font-weight: bold;
  }
  .markdown-content em {
    font-style: italic;
  }
  .markdown-content p:last-child {
    margin-bottom: 0;
  }
`;

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    
    const htmlContent = useMemo(() => {
        // In a real production app, this HTML should be sanitized
        // to prevent XSS attacks. For this project, we trust the AI's output
        // which is guided by a system prompt.
        return marked.parse(content, { gfm: true, breaks: true }) as string;
    }, [content]);

    return (
        <>
            <style>{markdownStyles}</style>
            <div 
                className="markdown-content"
                dangerouslySetInnerHTML={{ __html: htmlContent }} 
            />
        </>
    );
};

export default MarkdownRenderer;