// Type declarations for djvujs-dist (no official @types package exists)
declare module "djvujs-dist/library/src/index.js" {
  interface DjVuPage {
    getImageData(rotate?: boolean): ImageData;
  }

  interface DjVuDocument {
    getPagesQuantity(): number;
    isBundled(): boolean;
    getPage(pageNumber: number): Promise<DjVuPage>;
  }

  interface DjVuDocumentConstructor {
    new (
      buffer: ArrayBuffer,
      options?: { baseUrl?: string; memoryLimit?: number },
    ): DjVuDocument;
  }

  interface DjVuStatic {
    Document: DjVuDocumentConstructor;
    VERSION: string;
  }

  const DjVu: DjVuStatic;
  export default DjVu;
}
