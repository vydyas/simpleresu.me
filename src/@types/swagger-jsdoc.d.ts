declare module 'swagger-jsdoc' {
  export interface Options {
    definition: {
      openapi: string;
      info: {
        title: string;
        version: string;
        description?: string;
        license?: {
          name: string;
          url?: string;
        };
        contact?: {
          name?: string;
          url?: string;
          email?: string;
        };
      };
      servers?: Array<{
        url: string;
        description?: string;
      }>;
      components?: {
        securitySchemes?: Record<string, unknown>;
        schemas?: Record<string, unknown>;
      };
      security?: Array<Record<string, unknown>>;
      tags?: Array<{
        name: string;
        description?: string;
      }>;
    };
    apis: string[];
  }

  function swaggerJsdoc(options: Options): Record<string, unknown>;
  export default swaggerJsdoc;
  export { Options };
}

