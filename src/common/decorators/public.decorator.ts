import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// Attach custom metadata to route handlers
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
