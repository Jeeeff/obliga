import { Response, NextFunction } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import prisma from '../utils/prisma'
import { AuthRequest } from '../middleware/auth'

// --- Multer Configuration ---
const uploadDir = path.join(process.cwd(), 'uploads')

// Ensure base upload dir exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            const authReq = req as AuthRequest
            const tenantId = authReq.user?.tenantId
            const obligationId = authReq.params.id as string

            if (!tenantId || !obligationId) {
                return cb(new Error('Missing tenant or obligation ID'), '')
            }

            // Verify permission BEFORE upload
            // This runs for each file, which is slightly inefficient but safe
            const obligation = await prisma.obligation.findFirst({
                where: { id: obligationId, tenantId }
            })

            if (!obligation) {
                return cb(new Error('Obligation not found'), '')
            }

            // Check if CLIENT has access
            if (authReq.user?.role === 'CLIENT' && authReq.user.clientId) {
                if (obligation.clientId !== authReq.user.clientId) {
                    return cb(new Error('Forbidden'), '')
                }
            }

            const dir = path.join(uploadDir, tenantId, obligationId)
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true })
            }

            cb(null, dir)
        } catch (error) {
            cb(error as Error, '')
        }
    },
    filename: (req, file, cb) => {
        // Safe filename: uuid + extension
        const ext = path.extname(file.originalname)
        const name = `${uuidv4()}${ext}`
        cb(null, name)
    }
})

const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
})

export const uploadMiddleware = upload.single('file')

// --- Controllers ---

export const uploadAttachment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' })
        }

        const tenantId = req.user!.tenantId
        const obligationId = req.params.id as string

        // Create record
        const attachment = await prisma.attachment.create({
            data: {
                tenantId,
                obligationId,
                fileName: req.file.originalname,
                fileUrl: '' // Placeholder
            }
        })

        // Rename file to match attachment ID
        const ext = path.extname(req.file.originalname)
        const oldPath = req.file.path
        const newPath = path.join(path.dirname(oldPath), `${attachment.id}${ext}`)
        
        fs.renameSync(oldPath, newPath)

        // Update with actual download URL
        const updated = await prisma.attachment.update({
            where: { id: attachment.id },
            data: { fileUrl: `/attachments/${attachment.id}/download` }
        })

        // Log activity
        await prisma.activityLog.create({
            data: {
                tenantId,
                actorUserId: req.user!.userId,
                entityType: 'OBLIGATION',
                entityId: obligationId,
                action: 'ATTACHMENT_ADDED',
                meta: { fileName: req.file.originalname }
            }
        })

        res.status(201).json(updated)
    } catch (error) {
        // Cleanup file if DB insert fails
        if (req.file) {
            fs.unlink(req.file.path, () => {})
        }
        next(error)
    }
}

export const listAttachments = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const tenantId = req.user!.tenantId
        const obligationId = req.params.id as string

        // Check permissions
        const obligation = await prisma.obligation.findFirst({
            where: { id: obligationId, tenantId }
        })

        if (!obligation) return res.status(404).json({ error: 'Obligation not found' })

        if (req.user?.role === 'CLIENT' && req.user.clientId) {
            if (obligation.clientId !== req.user.clientId) {
                return res.status(403).json({ error: 'Forbidden' })
            }
        }

        const attachments = await prisma.attachment.findMany({
            where: { obligationId, tenantId },
            orderBy: { createdAt: 'desc' }
        })

        res.json(attachments)
    } catch (error) {
        next(error)
    }
}

export const downloadAttachment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const tenantId = req.user!.tenantId
        const attachmentId = req.params.id as string // This is attachment ID from route /attachments/:id/download

        const attachment = await prisma.attachment.findFirst({
            where: { id: attachmentId, tenantId },
            include: { obligation: true }
        })

        if (!attachment) return res.status(404).json({ error: 'Attachment not found' })

        // Check permissions on the obligation
        // Force type check if needed, but include should work.
        const obligation = attachment.obligation
        if (req.user?.role === 'CLIENT' && req.user.clientId) {
            if (obligation.clientId !== req.user.clientId) {
                return res.status(403).json({ error: 'Forbidden' })
            }
        }

        // Construct file path
        // We need to find the file on disk. 
        // We stored it in uploads/tenantId/obligationId/FILENAME
        // Wait, in storage.filename we used a UUID name. 
        // But we didn't store the *on-disk* filename in the DB? 
        // Ah, schema has `fileUrl`. I stored `/attachments/:id/download`.
        // I need to store the `systemPath` or `storedFileName` in DB or derive it.
        
        // ISSUE: My schema `Attachment` doesn't have a field for the on-disk filename (UUID).
        // It has `fileName` (original name) and `fileUrl`.
        // I should have stored the on-disk filename.
        // Quick fix: I'll use the `fileUrl` field to store the on-disk filename temporarily? 
        // No, `fileUrl` is exposed to frontend.
        
        // Better approach for this task without migration:
        // Use `fileUrl` to store the download path, and maybe repurpose a field? 
        // No, let's look at `Attachment` model again.
        // `id`, `tenantId`, `obligationId`, `fileName`, `fileUrl`, `createdAt`.
        
        // I can change how I save the file. 
        // If I save the file as `attachment.id` (UUID), I can find it easily!
        // But `multer` runs BEFORE I have the attachment ID.
        
        // Workaround: 
        // 1. Let multer save with a random UUID.
        // 2. Store that random UUID in `fileUrl` locally? No.
        // 3. Store the relative path in `fileUrl`? e.g. "uploads/ws/ob/uuid.ext"
        //    And the frontend API url is constructed dynamically?
        //    Or just store the download URL and assume we can find the file?
        
        // Let's check `fileUrl` usage.
        // If I store `fileUrl` as `/attachments/<id>/download`, I lose the reference to the file on disk unless I rename the file to match ID or something.
        
        // OPTION: Rename the file AFTER DB creation.
        // 1. Multer saves to temp.
        // 2. Create DB record -> get ID.
        // 3. Rename file to `ID` (no extension? or keep extension).
        // 4. Update DB with URL.
        
        // Let's do that. It's robust.
        
        const ext = path.extname(attachment.fileName)
        // Try to find the file.
        // If I renamed it to `attachment.id` + ext, I can find it.
        
        const filePath = path.join(uploadDir, tenantId, attachment.obligationId, `${attachment.id}${ext}`)
        
        if (!fs.existsSync(filePath)) {
             // Fallback: maybe we haven't implemented the rename logic yet?
             // Let's implement the rename logic in `uploadAttachment`.
             return res.status(404).json({ error: 'File not found on server' })
        }
        
        res.download(filePath, attachment.fileName)

    } catch (error) {
        next(error)
    }
}
