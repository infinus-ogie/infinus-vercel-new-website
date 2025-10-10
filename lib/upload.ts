export async function uploadFile(file: File, filename: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
    method: 'POST',
    body: file,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const blob = await response.json();
  return blob.url;
}

export async function uploadFromPath(filePath: string, filename: string): Promise<string> {
  const response = await fetch(filePath);
  const blob = await response.blob();
  
  const uploadResponse = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
    method: 'POST',
    body: blob,
  });

  if (!uploadResponse.ok) {
    throw new Error('Upload failed');
  }

  const result = await uploadResponse.json();
  return result.url;
}
