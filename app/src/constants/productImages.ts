export const DEFAULT_PRODUCT_IMAGE =

  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80';



const THUMB_WIDTH = 220;



const optimizeImageUri = (uri: string, size: 'thumb' | 'full'): string => {

  if (size === 'full') {

    return uri;

  }



  if (uri.includes('images.unsplash.com')) {

    if (/[?&]w=\d+/.test(uri)) {

      return uri.replace(/([?&])w=\d+/, `$1w=${THUMB_WIDTH}`);

    }



    const separator = uri.includes('?') ? '&' : '?';

    return `${uri}${separator}w=${THUMB_WIDTH}&q=80`;

  }



  return uri;

};



export const resolveProductImageUri = (

  image?: string | null,

  size: 'thumb' | 'full' = 'full',

): string => {

  const uri = image?.trim() || DEFAULT_PRODUCT_IMAGE;

  return optimizeImageUri(uri, size);

};

