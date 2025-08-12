import React, { useState, useEffect, useRef } from 'react';
import Split from 'split.js';
import '../stylesFolder/CodeEditor.css'; // Ensure you have the appropriate styles


const CodeEditor = () => {
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [js, setJs] = useState('');
  const containerRef = useRef(null);
  const iframeContainerRef = useRef(null);
  const iframeRef = useRef(null);

  // Initialize Split.js when component mounts
  useEffect(() => {
    if (containerRef.current && iframeContainerRef.current) {
      Split([containerRef.current, iframeContainerRef.current], {
        sizes: [50, 50],
        minSize: 200,
        gutterSize: 8,
        cursor: 'col-resize',
      });
    }
  }, []);

  // Update iframe content whenever code changes
  useEffect(() => {
    updateIframe();
  }, [html, css, js]);

  const updateIframe = () => {
    if (!iframeRef.current) return;
    
    const combinedCode = `
      ${html}
      <style>${css}</style>
      <script>${js}</script>
    `;
    
    const iframeDoc = iframeRef.current.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(combinedCode);
    iframeDoc.close();
  };

  return (
   <>

    <div className="editor-container">
      <div className="code-container split" ref={containerRef}>
        <div className="code-section">
          <div className="section-header">HTML</div>
          <textarea
            className="code-editor"
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder="Type HTML code here"
          />
        </div>
        
        <div className="code-section">
          <div className="section-header">CSS</div>
          <textarea
            className="code-editor"
            value={css}
            onChange={(e) => setCss(e.target.value)}
            placeholder="Type CSS code here"
          />
        </div>
        
        <div className="code-section">
          <div className="section-header">JavaScript</div>
          <textarea
            className="code-editor"
            value={js}
            onChange={(e) => setJs(e.target.value)}
            placeholder="Type JavaScript code here"
          />
        </div>
      </div>
      
      <div className="preview-container split" ref={iframeContainerRef}>
        <div className="section-header">Preview</div>
        <iframe 
          ref={iframeRef} 
          className="preview-iframe"
          title="Code Preview"
        />
      </div>
    </div>
   </>
  );
};

export default CodeEditor;