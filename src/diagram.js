// Helper function to create zoom/pan controls
function createZoomPanControls(svg, isFullscreen = false) {
  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  const ZOOM_STEP = 0.2;
  const MIN_SCALE = 0.1;
  const MAX_SCALE = 5;

  // Apply transform
  const applyTransform = () => {
    svg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    svg.style.transformOrigin = "center";
  };

  // Pan functionality with mouse
  svg.style.cursor = "grab";
  svg.style.willChange = "transform"; // Performance hint for browser

  const onMouseDown = (e) => {
    if (e.button === 0) {
      // Left click only
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
      svg.style.cursor = "grabbing";
      svg.style.transition = "none"; // Disable transition during drag
      e.preventDefault();
    }
  };

  let rafId = null;
  const onMouseMove = (e) => {
    if (isDragging) {
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;

      // Use requestAnimationFrame for smoother updates
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => {
        applyTransform();
        rafId = null;
      });
    }
  };

  const onMouseUp = () => {
    if (isDragging) {
      isDragging = false;
      svg.style.cursor = "grab";
      svg.style.transition = "transform 0.2s ease"; // Re-enable transition
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }
  };

  svg.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);

  // Mouse wheel zoom
  const onWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    const newScale = scale + delta;

    if (newScale >= MIN_SCALE && newScale <= MAX_SCALE) {
      scale = newScale;
      applyTransform();
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
      if (scale < MAX_SCALE) {
        scale += ZOOM_STEP;
        applyTransform();
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
      if (scale > MIN_SCALE) {
        scale -= ZOOM_STEP;
        applyTransform();
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
      translateX = 0;
      translateY = 0;
      svg.style.transition = "transform 0.3s ease";
      applyTransform();
      setTimeout(() => {
        svg.style.transition = "transform 0.2s ease";
      }, 300);
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
