import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  endpoint: process.env.SEVALLA_OBJECT_STORAGE_ENDPOINT!,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.SEVALLA_ACCESS_KEY_ID!,
    secretAccessKey: process.env.SEVALLA_SECRET_ACCESS_KEY!,
  },
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const key = searchParams.get('key');
    
    if (!key) {
      return NextResponse.json({ error: 'No key provided' }, { status: 400 });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.SEVALLA_BUCKET_NAME!,
      Key: key,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 3600 
    });

    return NextResponse.json({ 
      success: true, 
      presignedUrl,
      expiresIn: 3600 
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to generate download URL' }, 
      { status: 500 }
    );
  }
}