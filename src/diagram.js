// Helper function to create zoom/pan controls using SVG viewBox
// ViewBox manipulation keeps SVG crisp at any zoom level
function createZoomPanControls(svg, isFullscreen = false) {
  // Parse or create viewBox
  let vb = parseViewBox(svg);
  const original = { ...vb };

  function parseViewBox(svgEl) {
    const attr = svgEl.getAttribute("viewBox");
    if (attr) {
      const [x, y, w, h] = attr.split(/[\s,]+/).map(Number);
      return { x, y, width: w, height: h };
    }
    // Fallback: create viewBox from SVG dimensions
    const w = svgEl.width?.baseVal?.value || svgEl.clientWidth || 800;
    const h = svgEl.height?.baseVal?.value || svgEl.clientHeight || 600;
    svgEl.setAttribute("viewBox", `0 0 ${w} ${h}`);
    return { x: 0, y: 0, width: w, height: h };
  }

  let scale = 1;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let startVbX = 0;
  let startVbY = 0;

  const ZOOM_FACTOR = 0.1;
  const MIN_SCALE = 0.1;
  const MAX_SCALE = 10;

  // Apply viewBox - this re-renders SVG at new "zoom" level
  const applyViewBox = () => {
    const w = original.width / scale;
    const h = original.height / scale;
    svg.setAttribute("viewBox", `${vb.x} ${vb.y} ${w} ${h}`);
  };

  // Pan functionality with mouse
  svg.style.cursor = "grab";

  const onMouseDown = (e) => {
    if (e.button === 0) {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startVbX = vb.x;
      startVbY = vb.y;
      svg.style.cursor = "grabbing";
      e.preventDefault();
    }
  };

  let rafId = null;
  const onMouseMove = (e) => {
    if (isDragging) {
      // Convert pixel movement to viewBox units
      const rect = svg.getBoundingClientRect();
      const vbWidth = original.width / scale;
      const vbHeight = original.height / scale;

      const dx = ((e.clientX - startX) / rect.width) * vbWidth;
      const dy = ((e.clientY - startY) / rect.height) * vbHeight;

      vb.x = startVbX - dx;
      vb.y = startVbY - dy;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        applyViewBox();
        rafId = null;
      });
    }
  };

  const onMouseUp = () => {
    if (isDragging) {
      isDragging = false;
      svg.style.cursor = "grab";
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }
  };

  svg.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);

  // Mouse wheel zoom toward cursor
  const onWheel = (e) => {
    e.preventDefault();
    const zoomIn = e.deltaY < 0;
    const factor = zoomIn ? (1 + ZOOM_FACTOR) : (1 / (1 + ZOOM_FACTOR));
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale * factor));

    if (newScale !== scale) {
      const rect = svg.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / rect.width;
      const mouseY = (e.clientY - rect.top) / rect.height;

      const oldW = original.width / scale;
      const oldH = original.height / scale;
      const newW = original.width / newScale;
      const newH = original.height / newScale;

      // Zoom toward mouse cursor
      vb.x += (oldW - newW) * mouseX;
      vb.y += (oldH - newH) * mouseY;

      scale = newScale;
      applyViewBox();
    }
  };

  svg.addEventListener("wheel", onWheel, { passive: false });

  // Only create control buttons for fullscreen mode
  if (isFullscreen) {
    // Zoom In button
    const zoomInBtn = document.createElement("button");
    zoomInBtn.className = "mermaid-control-btn";
    zoomInBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>`;
    zoomInBtn.title = "Zoom in";
    zoomInBtn.onclick = (e) => {
      e.stopPropagation();
      const factor = 1 + ZOOM_FACTOR;
      const newScale = Math.min(MAX_SCALE, scale * factor);
      if (newScale !== scale) {
        // Zoom toward center
        const oldW = original.width / scale;
        const oldH = original.height / scale;
        const newW = original.width / newScale;
        const newH = original.height / newScale;
        vb.x += (oldW - newW) / 2;
        vb.y += (oldH - newH) / 2;
        scale = newScale;
        applyViewBox();
      }
    };

    // Zoom Out button
    const zoomOutBtn = document.createElement("button");
    zoomOutBtn.className = "mermaid-control-btn";
    zoomOutBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>`;
    zoomOutBtn.title = "Zoom out";
    zoomOutBtn.onclick = (e) => {
      e.stopPropagation();
      const factor = 1 / (1 + ZOOM_FACTOR);
      const newScale = Math.max(MIN_SCALE, scale * factor);
      if (newScale !== scale) {
        // Zoom toward center
        const oldW = original.width / scale;
        const oldH = original.height / scale;
        const newW = original.width / newScale;
        const newH = original.height / newScale;
        vb.x += (oldW - newW) / 2;
        vb.y += (oldH - newH) / 2;
        scale = newScale;
        applyViewBox();
      }
    };

    // Reset button
    const resetBtn = document.createElement("button");
    resetBtn.className = "mermaid-control-btn";
    resetBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
          </svg>`;
    resetBtn.title = "Reset view";
    resetBtn.onclick = (e) => {
      e.stopPropagation();
      scale = 1;
      vb.x = original.x;
      vb.y = original.y;
      applyViewBox();
    };

    return {
      buttons: [zoomInBtn, zoomOutBtn, resetBtn],
      cleanup: () => {
        svg.removeEventListener("mousedown", onMouseDown);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        svg.removeEventListener("wheel", onWheel);
      },
    };
  }

  // For regular view, just return cleanup
  return {
    buttons: null,
    cleanup: () => {
      svg.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      svg.removeEventListener("wheel", onWheel);
    },
  };
}

export function addDiagramTool() {
  // Wrap mermaid diagrams in a container div for better styling control

  const cherryPreview = document.querySelector(".cherry-previewer");
  if (cherryPreview) {
    // Find all SVG elements that are mermaid outputs
    const mermaidSvgs = cherryPreview.querySelectorAll('svg[id^="mermaid-"]');
    mermaidSvgs.forEach((svg) => {
      // Check if already wrapped
      if (svg.parentElement.classList.contains("mermaid-diagram-container")) {
        return;
      }
      const wrapper = document.createElement("div");
      wrapper.className = "mermaid-diagram-container";
      svg.parentNode.insertBefore(wrapper, svg);
      wrapper.appendChild(svg);

      // Add fullscreen button in top-right
      const fullscreenBtn = document.createElement("button");
      fullscreenBtn.className = "mermaid-fullscreen-btn mermaid-control-btn";
      fullscreenBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                </svg>
              `;
      fullscreenBtn.title = "View fullscreen";

      // Add click handler for fullscreen
      fullscreenBtn.onclick = (e) => {
        e.stopPropagation();
        const modal = document.createElement("div");
        modal.className = "mermaid-fullscreen-modal";

        const modalContent = document.createElement("div");
        modalContent.className = "mermaid-fullscreen-content";

        const svgClone = svg.cloneNode(true);

        // Make SVG fit the fullscreen modal
        svgClone.style.width = "100%";
        svgClone.style.height = "100%";
        svgClone.style.maxWidth = "100vw";
        svgClone.style.maxHeight = "100vh";
        svgClone.setAttribute("preserveAspectRatio", "xMidYMid meet");

        // Create button container for fullscreen mode (top-right)
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "mermaid-fullscreen-controls";

        // Add zoom/pan controls and get buttons for fullscreen view
        const { buttons: zoomButtons, cleanup } = createZoomPanControls(svgClone, true);

        // Add all zoom buttons to container
        if (zoomButtons) {
          zoomButtons.forEach((btn) => buttonContainer.appendChild(btn));
        }

        // Add close button
        const closeBtn = document.createElement("button");
        closeBtn.className = "mermaid-control-btn mermaid-close-btn";
        closeBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>`;
        closeBtn.title = "Close (ESC)";

        buttonContainer.appendChild(closeBtn);

        modalContent.appendChild(buttonContainer);
        modalContent.appendChild(svgClone);
        modal.appendChild(modalContent);
        cherryPreview.appendChild(modal);

        // Close handlers
        const closeModal = () => {
          cleanup();
          modal.remove();
        };
        closeBtn.onclick = closeModal;
        modal.onclick = (e) => {
          if (e.target === modal) closeModal();
        };
        document.addEventListener("keydown", function escHandler(e) {
          if (e.key === "Escape") {
            closeModal();
            document.removeEventListener("keydown", escHandler);
          }
        });
      };

      wrapper.appendChild(fullscreenBtn);
    });
  }
}
