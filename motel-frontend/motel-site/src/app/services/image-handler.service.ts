import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageHandlerService {
  constructor() {
  }

  // getBlob(b64Data, contentType) {
  //   const sliceSize = 512;

  //   b64Data = b64Data.replace(/data\:image\/(jpeg|jpg|png)\;base64\,/gi, '');

  //   const byteCharacters = atob(b64Data);
  //   const byteArrays = [];

  //   for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
  //     const slice = byteCharacters.slice(offset, offset + sliceSize);

  //     const byteNumbers = new Array(slice.length);
  //     for (let i = 0; i < slice.length; i++) {
  //       byteNumbers[i] = slice.charCodeAt(i);
  //     }

  //     const byteArray = new Uint8Array(byteNumbers);
  //     byteArrays.push(byteArray);
  //   }

  //   const blob = new Blob(byteArrays, {type: contentType});
  //   return blob;
  // }

  getBlobFromBase64(base64data: string, fileType: string): Blob {
    base64data = base64data.replace(/data\:image\/(jpeg|jpg|png)\;base64\,/gi, '');
    const binaryString = window.atob(base64data);
    const bytes = Uint8Array.from(binaryString, char => char.charCodeAt(0));
    return new Blob([bytes], { type: fileType });
  }
}
