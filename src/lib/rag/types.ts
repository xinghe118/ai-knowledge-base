export type ParsedDocumentPage = {
  pageNumber?: number;
  text: string;
};

export type ParsedDocument = {
  title?: string;
  pages?: ParsedDocumentPage[];
  text: string;
};

export type DocumentChunkInput = {
  content: string;
  chunkIndex: number;
  sourcePage?: number;
  sourceTitle?: string;
};

export type Citation = {
  documentId: string;
  documentName: string;
  chunkId: string;
  sourcePage?: number;
  sourceTitle?: string;
  preview: string;
};

export type RetrievedChunk = Citation & {
  content: string;
  score: number;
};
