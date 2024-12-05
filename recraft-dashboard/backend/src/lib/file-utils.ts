import { UploadedFile } from 'express-fileupload';
import FormData from 'form-data';

export const createFormDataFile = (file: UploadedFile | Buffer): { buffer: Buffer; mimetype: string; name: string } => {
  if (Buffer.isBuffer(file)) {
    return {
      buffer: file,
      mimetype: 'application/octet-stream',
      name: 'file'
    };
  }

  return {
    buffer: file.data,
    mimetype: file.mimetype,
    name: file.name
  };
};

export const appendFileToFormData = (formData: FormData, fieldName: string, file: UploadedFile | Buffer) => {
  const fileData = createFormDataFile(file);
  formData.append(fieldName, fileData.buffer, {
    filename: fileData.name,
    contentType: fileData.mimetype
  });
}; 