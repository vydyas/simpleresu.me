import { NextResponse } from 'next/server';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerDefinition } from '@/lib/swagger';

/**
 * GET /api/swagger
 * Returns the generated OpenAPI specification
 */
export async function GET() {
  try {
    const spec = swaggerJsdoc(swaggerDefinition);
    return NextResponse.json(spec);
  } catch (error) {
    console.error('Error generating Swagger spec:', error);
    return NextResponse.json(
      { error: 'Failed to generate API documentation' },
      { status: 500 }
    );
  }
}
