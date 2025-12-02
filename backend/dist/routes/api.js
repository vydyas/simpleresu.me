"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/resumes:
 *   get:
 *     summary: Get all resumes
 *     description: Retrieve a list of all resumes
 *     tags: [Resumes]
 *     responses:
 *       200:
 *         description: List of resumes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: Get all resumes endpoint
 *               data: []
 */
router.get('/resumes', (req, res) => {
    res.json({
        success: true,
        message: 'Get all resumes endpoint',
        data: []
    });
});
/**
 * @swagger
 * /api/resumes/{id}:
 *   get:
 *     summary: Get a resume by ID
 *     description: Retrieve a single resume by its unique identifier
 *     tags: [Resumes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resume ID
 *         example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       200:
 *         description: Resume retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: Get resume with ID 123e4567-e89b-12d3-a456-426614174000
 *               data:
 *                 id: 123e4567-e89b-12d3-a456-426614174000
 *       404:
 *         description: Resume not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/resumes/:id', (req, res) => {
    const { id } = req.params;
    res.json({
        success: true,
        message: `Get resume with ID: ${id}`,
        data: { id }
    });
});
/**
 * @swagger
 * /api/resumes:
 *   post:
 *     summary: Create a new resume
 *     description: Create a new resume with the provided data
 *     tags: [Resumes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Resume title
 *                 example: Software Engineer Resume
 *               content:
 *                 type: object
 *                 description: Resume content data
 *                 example:
 *                   personalInfo:
 *                     name: John Doe
 *                     email: john@example.com
 *                   experience: []
 *                   education: []
 *     responses:
 *       201:
 *         description: Resume created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: Resume created successfully
 *               data:
 *                 title: Software Engineer Resume
 *                 content: {}
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/resumes', (req, res) => {
    const resumeData = req.body;
    res.status(201).json({
        success: true,
        message: 'Resume created successfully',
        data: resumeData
    });
});
/**
 * @swagger
 * /api/resumes/{id}:
 *   put:
 *     summary: Update a resume
 *     description: Update an existing resume by ID
 *     tags: [Resumes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resume ID
 *         example: 123e4567-e89b-12d3-a456-426614174000
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Resume title
 *                 example: Updated Software Engineer Resume
 *               content:
 *                 type: object
 *                 description: Resume content data
 *     responses:
 *       200:
 *         description: Resume updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: Resume 123e4567-e89b-12d3-a456-426614174000 updated successfully
 *               data:
 *                 id: 123e4567-e89b-12d3-a456-426614174000
 *                 title: Updated Software Engineer Resume
 *       404:
 *         description: Resume not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/resumes/:id', (req, res) => {
    const { id } = req.params;
    const resumeData = req.body;
    res.json({
        success: true,
        message: `Resume ${id} updated successfully`,
        data: { id, ...resumeData }
    });
});
/**
 * @swagger
 * /api/resumes/{id}:
 *   delete:
 *     summary: Delete a resume
 *     description: Delete a resume by ID
 *     tags: [Resumes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resume ID
 *         example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       200:
 *         description: Resume deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Resume 123e4567-e89b-12d3-a456-426614174000 deleted successfully
 *       404:
 *         description: Resume not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/resumes/:id', (req, res) => {
    const { id } = req.params;
    res.json({
        success: true,
        message: `Resume ${id} deleted successfully`
    });
});
exports.default = router;
//# sourceMappingURL=api.js.map