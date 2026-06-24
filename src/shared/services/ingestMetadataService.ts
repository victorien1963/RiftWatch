import generatedIngestMetadata from '../generated/ingestMeta.json';
import type { IngestMetadata } from '../types';

const cloneMetadata = (metadata: IngestMetadata): IngestMetadata => ({
  generatedAt: metadata.generatedAt,
  sources: metadata.sources.map((source) => ({ ...source })),
});

export const getIngestMetadata = (): IngestMetadata =>
  cloneMetadata(generatedIngestMetadata as IngestMetadata);
