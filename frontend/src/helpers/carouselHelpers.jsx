// src/helpers/carouselHelpers.js

/**
 * Calculates the inline style for a carousel image based on its index.
 * @param {number} index - The index of the image.
 * @param {number} rotation - The global rotation angle.
 * @param {number} angleStep - The angle step between images.
 * @param {number} radius - The radius of the circular layout.
 * @returns {object} - The style object for the image.
 */
export const getCarouselImageStyle = (index, rotation, angleStep, radius) => {
    const angle = rotation + index * angleStep;
    const rad = (angle * Math.PI) / 180;
    const x = radius * Math.sin(rad);
    const scale = 0.25 * (Math.cos(rad) + 1) + 0.5;
    const zIndex = Math.round(100 * Math.cos(rad));
    const minOpacity = 0.3;
    const maxOpacity = 1;
    const normalized = (Math.cos(rad) + 1) / 2;
    const opacity = normalized * (maxOpacity - minOpacity) + minOpacity;
    const rotateY = -15 * Math.sin(rad);
    return {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: `translate(-50%, -50%) translateX(${x}px) scale(${scale}) rotateY(${rotateY}deg)`,
      zIndex: zIndex,
      opacity: opacity,
      transition: 'transform 0.8s ease, opacity 0.8s ease',
    };
  };
  
  /**
   * Determines the index of the image that is at the front of the carousel.
   * @param {number} imagesLength - Total number of images.
   * @param {number} rotation - The current rotation angle.
   * @param {number} angleStep - The angle step between images.
   * @returns {number} - The index of the front image.
   */
  export const getFrontIndex = (imagesLength, rotation, angleStep) => {
    let frontIndex = 0;
    let maxCos = -Infinity;
    for (let i = 0; i < imagesLength; i++) {
      const angle = rotation + i * angleStep;
      const rad = (angle * Math.PI) / 180;
      const cosValue = Math.cos(rad);
      if (cosValue > maxCos) {
        maxCos = cosValue;
        frontIndex = i;
      }
    }
    return frontIndex;
  };
  