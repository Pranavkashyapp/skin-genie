// Utility functions for manipulating images

/**
 * Creates a canvas element with the image drawn on it for processing
 */
export function createImageCanvas(imageSrc: string): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        resolve(canvas);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageSrc;
    });
  }
  
  /**
   * Highlights regions of an image based on detected conditions
   */
  export async function highlightConditionRegions(
    imageSrc: string, 
    regions: { x: number, y: number, size: number }[]
  ): Promise<string> {
    try {
      const canvas = await createImageCanvas(imageSrc);
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Failed to get canvas context');
      
      // Draw highlight markers for each region
      regions.forEach(region => {
        ctx.strokeStyle = '#f59e0b'; // amber-500
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(region.x, region.y, region.size, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Add pulsing effect (not animated here, just the appearance)
        ctx.fillStyle = 'rgba(245, 158, 11, 0.2)'; // amber-500 with low opacity
        ctx.fill();
      });
      
      return canvas.toDataURL('image/jpeg');
    } catch (error) {
      console.error('Error highlighting regions:', error);
      return imageSrc; // Return original if there's an error
    }
  }
  
  /**
   * Generate simulated regions for detected skin conditions
   * In a real application, these would come from the analysis results
   */
  export function generateSimulatedRegions(imageWidth: number, imageHeight: number, count = 2): { x: number, y: number, size: number }[] {
    const regions = [];
    
    for (let i = 0; i < count; i++) {
      // Generate random positions, ensuring they're not too close to the edges
      const padding = 50;
      const x = padding + Math.random() * (imageWidth - padding * 2);
      const y = padding + Math.random() * (imageHeight - padding * 2);
      const size = 10 + Math.random() * 15; // Random size between 10-25px
      
      regions.push({ x, y, size });
    }
    
    return regions;
  }
  
  /**
   * Utility to get image dimensions from a base64 string
   */
  export function getImageDimensions(base64: string): Promise<{ width: number, height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = base64;
    });
  }
  