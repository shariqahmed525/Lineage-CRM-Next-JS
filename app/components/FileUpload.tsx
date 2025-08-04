// app/components/FileUpload.tsx
import {
  Button, Box, useToast,
} from '@chakra-ui/react';
import Papa from 'papaparse';
import { useState } from 'react';

import { createClient } from '@/utils/supabase/client';


const supabase = createClient();

export default function FileUpload({ onFileParsed }: { onFileParsed: (headers: string[], filePath: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const toast = useToast();

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    if (!file) return;

    setUploading(true);
    setFileName(file.name);

    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      toast({
        title: 'Authentication error',
        description: 'Unable to authenticate user.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      setUploading(false);
      return;
    }

    // Generate a unique file path including the user's ID
    const fileExt = file.name.split('.').pop();
    let filePath = `${user?.user?.id}/${file.name}`; // Adjusted to match the provided code

    // Check if file with the same name already exists
    const { data: fileList, error: fileListError } = await supabase.storage.from('lead-uploads').list(filePath);
    let existingFile = fileList && fileList.find(f => f.name === filePath);

    // If file exists, append a suffix to the file name
    let suffix = 1;
    while (existingFile) {
      const fileParts = filePath.split('.');
      const fileName = fileParts.slice(0, -1).join('.');
      const fileExtension = fileParts.pop();
      filePath = `${fileName}-${suffix}.${fileExtension}`;

      // Check again if file with the new name exists
      const { data: fileListUpdated } = await supabase.storage.from('lead-uploads').list(filePath);
      existingFile = fileListUpdated && fileListUpdated.find(f => f.name === filePath);
      suffix++;
    }

    const { error: uploadError, data } = await supabase.storage.from('lead-uploads').upload(filePath, file);
    if (uploadError) {
      toast({
        title: 'Failed to upload file.',
        description: uploadError.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      setUploading(false);
      return;
    }

    // Parse the CSV file using PapaParse to extract headers
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        onFileParsed(results.meta.fields, filePath);
        setUploading(false);
      },
    });
  };

  return (
    <Box>
      <input
        type="file"
        onChange={onFileChange}
        style={{ display: 'none' }}
        id="file-upload"
      />
      <Button as="label" htmlFor="file-upload" variant="outline" disabled={uploading}>
        {uploading ? 'Uploading...' : fileName || 'Click to Browse Files'}
      </Button>
    </Box>
  );
}

