import { Options } from 'swagger-jsdoc';

export const swaggerDefinition: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SimpleResu.me API',
      version: '1.0.0',
      description:
        'REST API for resume builder with LinkedIn integration. All endpoints (except LinkedIn OAuth) require Clerk authentication.',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      contact: {
        name: 'SimpleResu.me',
        url: 'https://simpleresu.me',
        email: 'support@simpleresu.me',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
      {
        url: 'https://simpleresu.me/api',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        ClerkAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Clerk session token (obtained after user logs in)',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'User ID in Supabase',
            },
            clerk_user_id: {
              type: 'string',
              description: 'Clerk user ID',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Position: {
          type: 'object',
          required: ['title', 'company', 'startDate', 'endDate', 'description'],
          properties: {
            title: { type: 'string', example: 'Senior Software Engineer' },
            company: { type: 'string', example: 'Tech Corp' },
            startDate: { type: 'string', example: '2020-01' },
            endDate: { type: 'string', example: 'Present' },
            description: { type: 'string', example: 'Led development team...' },
          },
        },
        Education: {
          type: 'object',
          required: ['schoolName', 'degree', 'fieldOfStudy', 'startDate', 'endDate'],
          properties: {
            schoolName: { type: 'string', example: 'University of California' },
            degree: { type: 'string', example: 'Bachelor of Science' },
            fieldOfStudy: { type: 'string', example: 'Computer Science' },
            startDate: { type: 'string', example: '2016' },
            endDate: { type: 'string', example: '2020' },
          },
        },
        Skill: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'JavaScript' },
          },
        },
        Project: {
          type: 'object',
          required: ['title', 'description'],
          properties: {
            title: { type: 'string', example: 'E-commerce Platform' },
            link: { type: 'string', format: 'uri', example: 'https://github.com/user/project' },
            description: { type: 'string', example: 'Built a full-stack e-commerce platform...' },
          },
        },
        Certification: {
          type: 'object',
          required: ['title', 'organization', 'completionDate'],
          properties: {
            title: { type: 'string', example: 'AWS Certified Solutions Architect' },
            organization: { type: 'string', example: 'Amazon Web Services' },
            completionDate: { type: 'string', example: '2023-06' },
            description: { type: 'string', example: 'Professional level certification' },
            credentialUrl: {
              type: 'string',
              format: 'uri',
              example: 'https://aws.amazon.com/verify/abc123',
            },
          },
        },
        ResumeConfig: {
          type: 'object',
          properties: {
            showPhoto: { type: 'boolean', default: true },
            showSummary: { type: 'boolean', default: true },
            showExperience: { type: 'boolean', default: true },
            showEducation: { type: 'boolean', default: true },
            showSkills: { type: 'boolean', default: true },
            showProjects: { type: 'boolean', default: true },
            showRepositories: { type: 'boolean', default: true },
            showAwards: { type: 'boolean', default: true },
            showCertificates: { type: 'boolean', default: true },
            showLanguages: { type: 'boolean', default: true },
            showVolunteer: { type: 'boolean', default: true },
            showCertifications: { type: 'boolean', default: true },
          },
        },
        Resume: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'My Resume', default: 'My Resume' },
            first_name: { type: 'string', example: 'John' },
            last_name: { type: 'string', example: 'Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            headline: { type: 'string', example: 'Software Engineer' },
            summary: { type: 'string', example: 'Experienced developer with...' },
            location: { type: 'string', example: 'San Francisco, CA' },
            phone_number: { type: 'string', example: '+1 (555) 123-4567' },
            linkedin_id: { type: 'string', example: 'johndoe' },
            github_id: { type: 'string', example: 'johndoe' },
            positions: {
              type: 'array',
              items: { $ref: '#/components/schemas/Position' },
            },
            educations: {
              type: 'array',
              items: { $ref: '#/components/schemas/Education' },
            },
            skills: {
              type: 'array',
              items: { $ref: '#/components/schemas/Skill' },
            },
            projects: {
              type: 'array',
              items: { $ref: '#/components/schemas/Project' },
            },
            certifications: {
              type: 'array',
              items: { $ref: '#/components/schemas/Certification' },
            },
            custom_sections: {
              type: 'array',
              items: { type: 'object' },
            },
            config: { $ref: '#/components/schemas/ResumeConfig' },
            template: { type: 'string', example: 'default', default: 'default' },
            zoom: { type: 'integer', minimum: 50, maximum: 200, default: 100 },
            is_active: { type: 'boolean', default: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        LinkedInProfile: {
          type: 'object',
          properties: {
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            headline: { type: 'string', example: 'Software Engineer at Tech Corp' },
            profilePicture: {
              type: 'string',
              format: 'uri',
              example: 'https://media.licdn.com/...',
            },
            summary: { type: 'string', example: '' },
            positions: {
              type: 'array',
              items: { $ref: '#/components/schemas/Position' },
            },
            educations: {
              type: 'array',
              items: { $ref: '#/components/schemas/Education' },
            },
            skills: {
              type: 'array',
              items: { $ref: '#/components/schemas/Skill' },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Internal Server Error',
            },
            message: {
              type: 'string',
              description: 'Detailed error description',
              example: 'Authentication required',
            },
            details: {
              type: 'object',
              description: 'Additional error details',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Users',
        description: 'User management and synchronization',
      },
      {
        name: 'Resumes',
        description: 'Resume CRUD operations',
      },
      {
        name: 'LinkedIn',
        description: 'LinkedIn OAuth and profile integration',
      },
    ],
  },
  apis: ['./app/api/**/*.ts'],
};
