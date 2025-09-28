import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  endpoint: process.env.SEVALLA_OBJECT_STORAGE_ENDPOINT!,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.SEVALLA_ACCESS_KEY_ID!,
    secretAccessKey: process.env.SEVALLA_SECRET_ACCESS_KEY!,
  },
});

export async function GET() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.SEVALLA_BUCKET_NAME!,
      Prefix: 'uploads/',
    });

    const response = await s3Client.send(command);
    
    const files = response.Contents?.map(item => ({
      key: item.Key,
      size: item.Size,
      lastModified: item.LastModified,
    })) || [];

    return NextResponse.json({ 
      success: true, 
      files 
    });
  } catch (error) {
    console.error('List error:', error);
    return NextResponse.json(
      { error: 'Failed to list files' }, 
      { status: 500 }
    );
  }
}