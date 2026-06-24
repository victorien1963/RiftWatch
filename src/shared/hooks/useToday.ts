import { useMemo } from 'react';

export const useToday = (): Date => useMemo(() => new Date(), []);
