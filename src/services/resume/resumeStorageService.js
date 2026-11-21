import { isSupabaseConfigured, supabase } from '../../lib/supabase.js';

export const RESUMES_BUCKET = 'resumes';
export const MAX_RESUME_BYTES = 10 * 1024 * 1024;

export const ALLOWED_RESUME_MIME_TYPES = Object.freeze([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx'];

const MIME_BY_EXTENSION = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

const COLUMN_CANDIDATES = {
  id: ['id'],
  userId: ['user_id', 'candidate_id', 'owner_id', 'auth_user_id'],
  storagePath: ['storage_path', 'file_path', 'object_path', 'path'],
  fileName: ['file_name', 'filename', 'name'],
  fileSize: ['file_size_bytes', 'file_size', 'size_bytes', 'size'],
  mimeType: ['mime_type', 'content_type', 'file_type'],
  status: ['status', 'upload_status'],
  bucket: ['storage_bucket', 'bucket', 'bucket_name'],
  uploadedAt: ['uploaded_at', 'created_at'],
};

const FALLBACK_COLUMNS = {
  id: 'id',
  userId: 'user_id',
  storagePath: 'storage_path',
  fileName: 'file_name',
  fileSize: 'file_size_bytes',
  mimeType: 'mime_type',
  status: 'status',
  bucket: 'storage_bucket',
  uploadedAt: 'uploaded_at',
};

function getExtension(fileName) {
  return String(fileName || '')
    .split('.')
    .pop()
    .toLowerCase();
}

function createResumeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `resume-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function sanitizeResumeFileName(fileName) {
  const sanitized = String(fileName || 'resume')
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 120);
  return sanitized || 'resume';
}

export function validateResumeFile(file) {
  if (
    !file ||
    typeof file.name !== 'string' ||
    !ALLOWED_EXTENSIONS.includes(getExtension(file.name))
  ) {
    return { ok: false, error: 'Only PDF, DOC, and DOCX files are supported.' };
  }

  if (Number.isFinite(file.size) && file.size > MAX_RESUME_BYTES) {
    return { ok: false, error: 'File size must be less than 10MB.' };
  }

  const inferredMimeType = MIME_BY_EXTENSION[getExtension(file.name)];
  if (file.type && file.type !== inferredMimeType) {
    return { ok: false, error: 'The file type does not match the file extension.' };
  }

  return { ok: true, mimeType: inferredMimeType };
}

async function columnExists(columnName) {
  if (!columnName) return false;
  const { error } = await supabase.from('resumes').select(columnName).limit(1);
  return !error;
}

async function resolveResumeColumns() {
  const entries = await Promise.all(
    Object.entries(COLUMN_CANDIDATES).map(async ([key, candidates]) => {
      for (const candidate of candidates) {
        if (await columnExists(candidate)) return [key, candidate];
      }
      return [key, null];
    }),
  );

  const resolved = Object.fromEntries(entries);
  const hasRequiredColumns = Boolean(resolved.userId && resolved.storagePath && resolved.fileName);
  if (!hasRequiredColumns) return FALLBACK_COLUMNS;

  return resolved;
}

export async function uploadResumeToSupabase({ file, userId }) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured for this workspace.');
  }
  if (!userId) throw new Error('You must be signed in to upload a resume.');

  const validation = validateResumeFile(file);
  if (!validation.ok) throw new Error(validation.error);

  const resumeId = createResumeId();
  const fileName = sanitizeResumeFileName(file.name);
  const storagePath = `${userId}/${resumeId}/${fileName}`;
  const fileSizeBytes = Number(file.size) || 0;
  const uploadedAt = new Date().toISOString();

  const { error: uploadError } = await supabase.storage
    .from(RESUMES_BUCKET)
    .upload(storagePath, file, {
      contentType: validation.mimeType,
      upsert: false,
      cacheControl: '3600',
    });
  if (uploadError) throw new Error(uploadError.message || 'Unable to upload resume.');

  const columns = await resolveResumeColumns();
  const metadata = {
    [columns.id]: resumeId,
    [columns.userId]: userId,
    [columns.storagePath]: storagePath,
    [columns.fileName]: fileName,
    [columns.fileSize]: fileSizeBytes,
    [columns.mimeType]: validation.mimeType,
    [columns.status]: 'uploaded',
    [columns.bucket]: RESUMES_BUCKET,
    [columns.uploadedAt]: uploadedAt,
  };
  const payload = Object.fromEntries(
    Object.entries(metadata).filter(
      ([key, value]) => Boolean(key) && value !== undefined && value !== null,
    ),
  );

  const { error: insertError } = await supabase.from('resumes').insert(payload);
  if (insertError) {
    await supabase.storage.from(RESUMES_BUCKET).remove([storagePath]);
    throw new Error(insertError.message || 'Resume uploaded but metadata could not be saved.');
  }

  return {
    id: resumeId,
    bucket: RESUMES_BUCKET,
    storagePath,
    fileName,
    originalFileName: file.name,
    fileSizeBytes,
    mimeType: validation.mimeType,
    status: 'uploaded',
    uploadedAt,
    analysisType: 'supabase-storage',
    isDemoExtraction: false,
  };
}
