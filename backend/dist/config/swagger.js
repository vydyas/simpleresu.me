"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SimpleResume API',
            version: '1.0.0',
            description: 'API documentation for SimpleResume - Transform Your Professional Profile Into a Standout Resume',
            contact: {
                name: 'API Support',
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT',
            },
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Development server',
            },
            {
                url: 'https://api.simpleresu.me',
                description: 'Production server',
            },
        ],
        tags: [
            {
                name: 'Health',
                description: 'Health check endpoints',
            },
            {
                name: 'Resumes',
                description: 'Resume management endpoints',
            },
        ],
        components: {
            schemas: {
                Resume: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Resume unique identifier',
                            example: '123e4567-e89b-12d3-a456-426614174000',
                        },
                        title: {
                            type: 'string',
                            description: 'Resume title',
                            example: 'Software Engineer Resume',
                        },
                        content: {
                            type: 'object',
                            description: 'Resume content data',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Last update timestamp',
                        },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false,
                        },
                        message: {
                            type: 'string',
                            description: 'Error message',
                            example: 'An error occurred',
                        },
                    },
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true,
                        },
                        message: {
                            type: 'string',
                            description: 'Success message',
                        },
                        data: {
                            type: 'object',
                            description: 'Response data',
                        },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.ts', './src/server.ts'],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
//# sourceMappingURL=swagger.js.map