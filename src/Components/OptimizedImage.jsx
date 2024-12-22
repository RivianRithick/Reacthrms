import React, { useState, useEffect } from 'react';
import { Box, Skeleton } from '@mui/material';

const OptimizedImage = ({ src, alt, width, height, className, style }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [webpSupported, setWebpSupported] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    // Check WebP support
    const checkWebPSupport = async () => {
      const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
      const blob = await fetch(webpData).then(r => r.blob());
      setWebpSupported(blob.size > 0);
    };

    checkWebPSupport();
  }, []);

  useEffect(() => {
    // Convert image URL to WebP if supported
    if (webpSupported && src) {
      const originalExt = src.split('.').pop();
      const webpSrc = src.replace(`.${originalExt}`, '.webp');
      
      // Check if WebP version exists, fallback to original if not
      fetch(webpSrc)
        .then(response => {
          if (response.ok) {
            setImageSrc(webpSrc);
          } else {
            setImageSrc(src);
          }
        })
        .catch(() => setImageSrc(src));
    } else {
      setImageSrc(src);
    }
  }, [src, webpSupported]);

  return (
    <Box position="relative" width={width} height={height}>
      {!imageLoaded && (
        <Skeleton
          variant="rectangular"
          width={width}
          height={height}
          animation="wave"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            bgcolor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: 1
          }}
        />
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        style={{
          ...style,
          opacity: imageLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          width: width,
          height: height,
          objectFit: 'cover'
        }}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
      />
    </Box>
  );
};

export default OptimizedImage; 